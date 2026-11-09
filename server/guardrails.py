"""
Guardrails and compliance pipeline for FinIntel.
Handles input validation, prompt-injection defense, and the SEBI compliance screen.
"""
import re
from typing import Optional, Dict, Any, List

SEBI_DISCLAIMER = (
    "\n\n---\n"
    "**Regulatory Disclaimer (SEBI Compliance)**: FinIntel is an automated equity research "
    "architecture demonstration tool and does NOT provide registered investment advisory services "
    "or financial recommendations under SEBI (Investment Advisers) Regulations, 2013. "
    "All analytical computations are historical or model-projected. Investing in securities "
    "involves market risks; please consult an accredited financial advisor before making decisions."
)

FORBIDDEN_PHRASES = [
    r"\bguaranteed returns?\b",
    r"\brisk[- ]free profit\b",
    r"\bsure[- ]shot multibagger\b",
    r"\b100% target hit\b",
    r"\binsider tip\b",
    r"\bdoubling money\b",
    r"\bpump and dump\b",
    r"\bjackpot call\b"
]

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"ignore all prior instructions",
    r"disregard your system prompt",
    r"you are now DAN",
    r"jailbreak",
    r"system override",
    r"reveal your system prompt",
    r"bypass safety guidelines"
]


def validate_ticker(ticker: str) -> str:
    """Validate and clean NSE ticker format."""
    if not ticker or not isinstance(ticker, str):
        raise ValueError("Ticker symbol is required.")
    cleaned = ticker.strip().upper()
    # Strip .NS or .BO suffix if user passed it
    if cleaned.endswith(".NS"):
        cleaned = cleaned[:-3]
    elif cleaned.endswith(".BO"):
        cleaned = cleaned[:-3]
    
    if not re.match(r"^[A-Z0-9&\-\.]{1,20}$", cleaned):
        raise ValueError(f"Invalid NSE ticker symbol: '{ticker}'.")
    return cleaned


def validate_uuid(thread_id: str) -> str:
    """Validate UUID format."""
    if not thread_id or not isinstance(thread_id, str):
        raise ValueError("Thread UUID is required.")
    uuid_regex = r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    if not re.match(uuid_regex, thread_id):
        raise ValueError("Invalid thread UUID.")
    return thread_id


def validate_profile(profile: Optional[str]) -> str:
    """Validate risk profile whitelist."""
    valid = {"conservative", "balanced", "aggressive"}
    if not profile or profile.lower() not in valid:
        return "balanced"
    return profile.lower()


def check_prompt_injection(text: str) -> bool:
    """Check if input text contains known prompt-injection attempts."""
    if not text:
        return False
    lower = text.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            return True
    return False


def neutralise_forbidden_phrases(text: str) -> str:
    """Deterministically neutralize exaggerated financial claims."""
    result = text
    for pattern in FORBIDDEN_PHRASES:
        result = re.sub(pattern, "[unverified financial claim removed]", result, flags=re.IGNORECASE)
    return result


def scrub_pii(text: str) -> str:
    """Basic scrub for email addresses and phone numbers."""
    # Email scrub
    text = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[REDACTED_EMAIL]", text)
    # Phone scrub (10-12 digit Indian format)
    text = re.sub(r"\b(?:\+91|91)?[- ]?[6789]\d{9}\b", "[REDACTED_PHONE]", text)
    return text


def sanitise_output(text: str, append_disclaimer: bool = True) -> str:
    """
    Runs text through compliance pipeline:
    1. Forbidden-phrase neutralisation
    2. PII scrub
    3. Mandatory SEBI disclaimer append
    """
    if not text:
        return ""
    clean = neutralise_forbidden_phrases(text)
    clean = scrub_pii(clean)
    if append_disclaimer and SEBI_DISCLAIMER.strip() not in clean:
        clean = clean.rstrip() + SEBI_DISCLAIMER
    return clean
