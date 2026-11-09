"""
Server-Sent Events (SSE) streaming helpers.
Formats event dictionaries into SSE data packets: `data: {json}\n\n`.
"""
import json
from typing import Any, Dict


def sse_event(event_dict: Dict[str, Any]) -> str:
    """Format an event dictionary as an SSE line."""
    return f"data: {json.dumps(event_dict, default=str)}\n\n"


def sse_done() -> str:
    """Standard completion event."""
    return sse_event({"type": "done"})


def sse_error(message: str) -> str:
    """Standard error event."""
    return sse_event({"type": "error", "text": message})
