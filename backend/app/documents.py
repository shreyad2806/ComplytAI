from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader


class DocumentExtractionError(ValueError):
    """Raised when an uploaded document cannot be converted to text."""


def extract_text(filename: str, content: bytes, max_characters: int) -> str:
    """Extract text from supported uploads and cap the prompt size sent to the crew."""

    suffix = Path(filename).suffix.lower()
    try:
        if suffix == ".pdf":
            text = "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages)
        elif suffix == ".docx":
            text = "\n".join(paragraph.text for paragraph in Document(BytesIO(content)).paragraphs)
        elif suffix in {".txt", ".md", ".csv", ".json"}:
            text = content.decode("utf-8", errors="replace")
        else:
            raise DocumentExtractionError("Supported file types are PDF, DOCX, TXT, MD, CSV, and JSON.")
    except DocumentExtractionError:
        raise
    except Exception as error:
        raise DocumentExtractionError("The uploaded document could not be read.") from error

    normalized = text.strip()
    if not normalized:
        raise DocumentExtractionError("The uploaded document does not contain extractable text.")
    return normalized[:max_characters]
