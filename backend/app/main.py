import logging
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request, status

from .config import get_settings
from .crew import run_compliance_crew
from .documents import DocumentExtractionError, extract_text
from .memory import PineconeReportMemory, retrieve_related_reports, store_report
from .schemas import AnalysisResponse, GuardrailResult, ReportEvaluation

logger = logging.getLogger(__name__)

app = FastAPI(title="Complyt CrewAI Backend", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "complyt-crewai"}


@app.post("/analyse", response_model=AnalysisResponse)
async def analyse(request: Request) -> AnalysisResponse:
    """Run CrewAI using the existing document_text input or the current multipart upload contract."""

    request_id = str(uuid4())
    settings = get_settings()
    report_memory = None
    try:
        content_type = request.headers.get("content-type", "")
        if "multipart/form-data" in content_type:
            form = await request.form()
            prompt = str(form.get("prompt", "")).strip()
            document_name = str(form.get("document_name", "")).strip()
            file = form.get("file")
            if not prompt:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="prompt is required")
            if file is None or not hasattr(file, "read"):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="file is required")

            filename = getattr(file, "filename", None) or "uploaded-document"
            content = await file.read()
            if not content:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="file is required")
            document_text = extract_text(filename, content, settings.crewai_max_document_chars)
            document_title = document_name or filename
        else:
            payload = await request.json()
            if not isinstance(payload, dict):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="JSON object is required")
            prompt = str(payload.get("prompt", "")).strip()
            document_text = str(payload.get("document_text", "")).strip()
            document_title = str(payload.get("document_name", "uploaded-document")).strip() or "uploaded-document"
            if not prompt:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="prompt is required")
            if not document_text:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="document_text is required")
            document_text = document_text[: settings.crewai_max_document_chars]

        related_reports = retrieve_related_reports(
            report_memory,
            document_text=document_text,
            prompt=prompt,
        )
        report, agent_trace, crew_metrics, guardrail, evaluation = await run_compliance_crew(
            document_title=document_title,
            document_text=document_text,
            prompt=prompt,
            related_reports=related_reports,
            settings=settings,
        )
        
        # If guardrail failed, return the guardrail result instead of the report
        if guardrail is not None and not guardrail.passed:
            logger.warning(
                "Guardrail validation failed",
                extra={
                    "request_id": request_id,
                    "failed_checks": [fc.check for fc in guardrail.failed_checks],
                },
            )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": "Guardrail validation failed",
                    "guardrail_result": guardrail.model_dump(),
                },
            )
        
        store_report(report_memory, report_id=request_id, report=report)
    except DocumentExtractionError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("CrewAI analysis failed", extra={"request_id": request_id})
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="CrewAI analysis failed") from error

    response = AnalysisResponse(
        analysis_type=report.analysis_type,
        report=report,
        request_id=request_id,
        agent_trace=agent_trace,
        crew_metrics=crew_metrics,
        evaluation=evaluation,
    )

    return response
