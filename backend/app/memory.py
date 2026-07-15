import json
import logging
from typing import Any

from openai import OpenAI

try:
    from pinecone import Pinecone
except ImportError:  # pragma: no cover - exercised when Pinecone is unavailable
    Pinecone = None

from .config import Settings
from .schemas import ComplianceReport

logger = logging.getLogger(__name__)
_MAX_MEMORY_TEXT_CHARS = 12_000


def _compact_text(value: str) -> str:
    return " ".join(value.split())


def _report_memory_text(report: ComplianceReport) -> str:
    """Create a bounded, searchable representation of a completed report."""

    sections = [
        f"Document: {report.document_title}",
        f"Analysis type: {report.analysis_type}",
        f"Risk: {report.risk_level.value} ({report.risk_score}/100)",
        f"Executive summary: {report.executive_summary}",
        "Compliance issues: " + "; ".join(
            f"{issue.title}: {issue.description}" for issue in report.compliance_issues
        ),
        "Financial risks: " + "; ".join(
            f"{risk.title}: {risk.description}" for risk in report.financial_risks
        ),
        "Audit flags: " + "; ".join(
            f"{flag.title}: {flag.description}" for flag in report.audit_flags
        ),
        "Recommendations: " + "; ".join(
            f"{recommendation.title}: {recommendation.description}" for recommendation in report.recommendations
        ),
    ]
    return _compact_text("\n".join(sections))[:_MAX_MEMORY_TEXT_CHARS]


class PineconeReportMemory:
    """Retrieve and persist report summaries without changing the analysis API contract."""

    def __init__(self, settings: Settings):
        self._settings = settings
        self._openai = OpenAI(api_key=settings.openai_api_key)
        self._index = Pinecone(api_key=settings.pinecone_api_key).Index(host=settings.pinecone_index_host)

    @classmethod
    def from_settings(cls, settings: Settings) -> "PineconeReportMemory | None":
        if not settings.pinecone_api_key or not settings.pinecone_index_host:
            return None
        return cls(settings)

    def _embed(self, text: str) -> list[float]:
        response = self._openai.embeddings.create(
            model=self._settings.openai_embedding_model,
            input=text[:_MAX_MEMORY_TEXT_CHARS],
        )
        return response.data[0].embedding

    def retrieve(self, *, document_text: str, prompt: str) -> list[str]:
        """Return the most related historical report summaries for Manager-only context."""

        query = _compact_text(f"Analysis request: {prompt}\nDocument: {document_text}")
        result = self._index.query(
            vector=self._embed(query),
            top_k=self._settings.pinecone_top_k,
            include_metadata=True,
            namespace=self._settings.pinecone_namespace,
        )
        matches = getattr(result, "matches", None) or result.get("matches", [])
        related_reports: list[str] = []
        for match in matches:
            metadata: dict[str, Any]
            if isinstance(match, dict):
                metadata = match.get("metadata", {})
            else:
                metadata = getattr(match, "metadata", {}) or {}
            memory_text = metadata.get("memory_text")
            if isinstance(memory_text, str) and memory_text.strip():
                related_reports.append(memory_text)
        return related_reports

    def save(self, *, report_id: str, report: ComplianceReport) -> None:
        memory_text = _report_memory_text(report)
        self._index.upsert(
            vectors=[
                {
                    "id": report_id,
                    "values": self._embed(memory_text),
                    "metadata": {
                        "document_title": report.document_title[:500],
                        "analysis_type": report.analysis_type[:500],
                        "risk_level": report.risk_level.value,
                        "risk_score": report.risk_score,
                        "memory_text": memory_text,
                    },
                }
            ],
            namespace=self._settings.pinecone_namespace,
        )


def retrieve_related_reports(
    memory: PineconeReportMemory | None, *, document_text: str, prompt: str
) -> list[str]:
    if memory is None:
        return []
    try:
        return memory.retrieve(document_text=document_text, prompt=prompt)
    except Exception:
        logger.warning("Pinecone memory retrieval failed; continuing without report memory", exc_info=True)
        return []


def store_report(memory: PineconeReportMemory | None, *, report_id: str, report: ComplianceReport) -> None:
    if memory is None:
        return
    try:
        memory.save(report_id=report_id, report=report)
    except Exception:
        logger.warning("Pinecone memory write failed", exc_info=True)
