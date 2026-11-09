"""
Document storage and text extraction service for chat Q&A.
Supports PDF, DOCX, and TXT files up to 15 MB.
"""
import io
from typing import Dict, Any, Optional
from pypdf import PdfReader
from docx import Document

_UPLOADED_DOCUMENTS: Dict[str, str] = {}


def extract_text_from_bytes(filename: str, content: bytes) -> str:
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext == "pdf":
        reader = PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    elif ext in ["docx", "doc"]:
        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text]
        return "\n".join(paragraphs).strip()
    elif ext in ["txt", "md", "csv"]:
        return content.decode("utf-8", errors="ignore").strip()
    else:
        raise ValueError(f"Unsupported file format: .{ext}")


def store_document(doc_id: str, text_content: str):
    _UPLOADED_DOCUMENTS[doc_id] = text_content


def get_document(doc_id: str) -> Optional[str]:
    return _UPLOADED_DOCUMENTS.get(doc_id)


def clear_document(doc_id: str):
    if doc_id in _UPLOADED_DOCUMENTS:
        del _UPLOADED_DOCUMENTS[doc_id]
