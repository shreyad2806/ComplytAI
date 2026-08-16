import logging
import time
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request, status

from .config import get_settings
from .crew import run_compliance_crew
from .documents import DocumentExtractionError, extract_text
from .memory import PineconeReportMemory, retrieve_related_reports, store_report
from .retrieval import prepare_agent_contexts
from .schemas import AnalysisResponse

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
    report_memory = PineconeReportMemory.from_settings(settings)
    workflow_start = time.perf_counter()
    parse_seconds = 0.0

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
            parse_start = time.perf_counter()
            document_text = extract_text(filename, content, settings.crewai_max_document_chars)
            parse_seconds = time.perf_counter() - parse_start
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
            parse_start = time.perf_counter()
            document_text = document_text[: settings.crewai_max_document_chars]
            parse_seconds = time.perf_counter() - parse_start

        print(f"[PERF] document_parse={parse_seconds:.3f}s")

        agent_contexts = prepare_agent_contexts(
            document_text=document_text,
            prompt=prompt,
            settings=settings,
        )
        print(
            f"[PERF] chunking={agent_contexts.chunking_seconds:.3f}s "
            f"retrieval={agent_contexts.retrieval_seconds:.3f}s"
        )

        related_reports = retrieve_related_reports(
            report_memory,
            document_text=document_text,
            prompt=prompt,
        )
        report, agent_trace, crew_metrics = await run_compliance_crew(
            document_title=document_title,
            prompt=prompt,
            related_reports=related_reports,
            settings=settings,
            document_analyst_context=agent_contexts.document_analyst,
            compliance_officer_context=agent_contexts.compliance_officer,
        )
        store_report(report_memory, report_id=request_id, report=report)
    except DocumentExtractionError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("CrewAI analysis failed", extra={"request_id": request_id})
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="CrewAI analysis failed") from error

    total_seconds = time.perf_counter() - workflow_start
    print(f"[PERF] request_total={total_seconds:.3f}s")

    return AnalysisResponse(
        analysis_type=report.analysis_type,
        report=report,
        request_id=request_id,
        agent_trace=agent_trace,
        crew_metrics=crew_metrics,
    )
