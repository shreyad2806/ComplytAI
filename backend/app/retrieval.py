"""Agent-specific document chunk retrieval for RAG without passing full documents."""

from __future__ import annotations

import hashlib
import logging
import re
import time
from dataclasses import dataclass, field

from .config import Settings

logger = logging.getLogger(__name__)

_PAGE_MARKER = re.compile(r"^\[Page\s+(\d+)\]\s*$", re.MULTILINE)

_AGENT_PROFILES: dict[str, dict[str, object]] = {
    "document_analyst": {
        "query": "compliance risk control policy obligation regulation financial exposure audit",
        "keywords": (
            "compliance",
            "risk",
            "control",
            "policy",
            "obligation",
            "regulation",
            "financial",
            "audit",
            "requirement",
            "violation",
        ),
        "top_k": 10,
    },
    "compliance_officer": {
        "query": "compliance obligation control violation regulatory requirement policy gap sanction",
        "keywords": (
            "compliance",
            "regulation",
            "obligation",
            "violation",
            "control",
            "requirement",
            "policy",
            "regulatory",
            "standard",
            "framework",
        ),
        "top_k": 8,
    },
    "risk_auditor": {
        "query": "financial exposure penalty audit control failure risk loss remediation",
        "keywords": (
            "financial",
            "exposure",
            "penalty",
            "audit",
            "failure",
            "risk",
            "loss",
            "remediation",
            "weakness",
            "deficiency",
        ),
        "top_k": 8,
    },
    "aml_specialist": {
        "query": "aml kyc sanctions money laundering suspicious activity cdd pep",
        "keywords": (
            "aml",
            "kyc",
            "sanction",
            "laundering",
            "suspicious",
            "cdd",
            "pep",
            "transaction",
            "screening",
            "beneficial",
        ),
        "top_k": 8,
    },
}


@dataclass
class DocumentChunk:
    text: str
    page: int | None
    chunk_id: str


@dataclass
class AgentRetrievalContexts:
    document_analyst: str
    compliance_officer: str
    chunking_seconds: float = 0.0
    retrieval_seconds: float = 0.0
    chunk_count: int = 0
    retrieved_counts: dict[str, int] = field(default_factory=dict)


def _normalize_whitespace(text: str) -> str:
    return " ".join(text.split())


def _chunk_fingerprint(text: str) -> str:
    return hashlib.sha256(_normalize_whitespace(text).lower().encode("utf-8")).hexdigest()


def chunk_document(document_text: str, *, chunk_size: int = 1200, overlap: int = 150) -> list[DocumentChunk]:
    """Split a page-marked document into overlapping chunks while preserving page metadata."""

    if not document_text.strip():
        return []

    sections: list[tuple[int | None, str]] = []
    current_page: int | None = None
    buffer: list[str] = []

    for line in document_text.splitlines():
        marker = _PAGE_MARKER.match(line.strip())
        if marker:
            if buffer:
                sections.append((current_page, "\n".join(buffer).strip()))
                buffer = []
            current_page = int(marker.group(1))
            continue
        buffer.append(line)

    if buffer:
        sections.append((current_page, "\n".join(buffer).strip()))

    if not sections:
        sections = [(None, document_text.strip())]

    chunks: list[DocumentChunk] = []
    for page, section_text in sections:
        if not section_text:
            continue
        start = 0
        while start < len(section_text):
            end = min(len(section_text), start + chunk_size)
            piece = section_text[start:end].strip()
            if piece:
                chunks.append(
                    DocumentChunk(
                        text=piece,
                        page=page,
                        chunk_id=f"p{page or 0}-{start}",
                    )
                )
            if end >= len(section_text):
                break
            start = max(0, end - overlap)

    return chunks


def deduplicate_chunks(chunks: list[DocumentChunk]) -> list[DocumentChunk]:
    seen: set[str] = set()
    unique: list[DocumentChunk] = []
    for chunk in chunks:
        fingerprint = _chunk_fingerprint(chunk.text)
        if fingerprint in seen:
            continue
        seen.add(fingerprint)
        unique.append(chunk)
    return unique


def _score_chunk(chunk: DocumentChunk, *, query: str, keywords: tuple[str, ...]) -> float:
    haystack = chunk.text.lower()
    query_terms = [term for term in query.lower().split() if term]
    score = 0.0
    for term in query_terms:
        if term in haystack:
            score += 2.0
    for keyword in keywords:
        if keyword in haystack:
            score += 1.0
    return score


def retrieve_chunks(
    chunks: list[DocumentChunk],
    *,
    query: str,
    keywords: tuple[str, ...],
    top_k: int,
) -> list[DocumentChunk]:
    if not chunks:
        return []

    ranked = sorted(
        chunks,
        key=lambda chunk: _score_chunk(chunk, query=query, keywords=keywords),
        reverse=True,
    )
    selected: list[DocumentChunk] = []
    seen: set[str] = set()
    for chunk in ranked:
        fingerprint = _chunk_fingerprint(chunk.text)
        if fingerprint in seen:
            continue
        if _score_chunk(chunk, query=query, keywords=keywords) <= 0 and selected:
            continue
        seen.add(fingerprint)
        selected.append(chunk)
        if len(selected) >= top_k:
            break

    if not selected:
        selected = ranked[:top_k]
    return deduplicate_chunks(selected)


def format_retrieved_context(chunks: list[DocumentChunk], *, heading: str) -> str:
    if not chunks:
        return f"{heading}\n(No relevant retrieved context.)"

    lines = [heading]
    for index, chunk in enumerate(chunks, start=1):
        page_label = f"Page {chunk.page}" if chunk.page is not None else "Page unknown"
        lines.append(f"[Chunk {index} | {page_label}]\n{chunk.text}")
    return "\n\n".join(lines)


def prepare_agent_contexts(
    *,
    document_text: str,
    prompt: str,
    settings: Settings,
) -> AgentRetrievalContexts:
    chunk_start = time.perf_counter()
    chunks = chunk_document(document_text, chunk_size=settings.rag_chunk_size)
    chunks = deduplicate_chunks(chunks)
    chunking_seconds = time.perf_counter() - chunk_start

    retrieval_start = time.perf_counter()
    retrieved_counts: dict[str, int] = {}
    contexts: dict[str, str] = {}

    combined_query = f"{prompt} {_normalize_whitespace(document_text[:2000])}"
    for agent_key in ("document_analyst", "compliance_officer"):
        profile = _AGENT_PROFILES[agent_key]
        selected = retrieve_chunks(
            chunks,
            query=f"{profile['query']} {combined_query}",
            keywords=tuple(profile["keywords"]),  # type: ignore[arg-type]
            top_k=int(profile["top_k"]),
        )
        retrieved_counts[agent_key] = len(selected)
        contexts[agent_key] = format_retrieved_context(
            selected,
            heading=f"Retrieved context for {agent_key.replace('_', ' ').title()} (use as primary document evidence):",
        )

    retrieval_seconds = time.perf_counter() - retrieval_start
    logger.info(
        "[PERF] chunking=%.3fs retrieval=%.3fs chunks=%d retrieved=%s",
        chunking_seconds,
        retrieval_seconds,
        len(chunks),
        retrieved_counts,
    )

    return AgentRetrievalContexts(
        document_analyst=contexts["document_analyst"],
        compliance_officer=contexts["compliance_officer"],
        chunking_seconds=chunking_seconds,
        retrieval_seconds=retrieval_seconds,
        chunk_count=len(chunks),
        retrieved_counts=retrieved_counts,
    )
