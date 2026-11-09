"""
Input validation, prompt injection screen, and regulatory compliance pipeline.
"""
import re
import uuid

FORBIDDEN_PHRASES = [
    (r"(?i)\bguaranteed\s+(returns?|profits?)\b", "projected historical performance"),
    (r"(?i)\b100%\s+risk[\s-]free\b", "lower observed volatility"),
    (r"(?i)\bsure[\s-]shot\s+(buy|multibagger)\b", "potential candidate for research"),
    (r"(?i)\binsider\s+(tip|leak|info)\b", "market intelligence"),
    (r"(?i)\bget\s+rich\s+quick\b", "long-term capital compounder"),
    (r"(?i)\bblindly\s+buy\b", "consider evaluating"),
]

PROMPT_INJECTION_PATTERNS = [
    r"(?i)ignore\s+(all\s+)?(previous|prior|above)\s+instructions",
    r"(?i)system\s+prompt",
    r"(?i)developer\s+mode",
    r"(?i)jailbreak",
    r"(?i)override\s+compliance",
    r"(?i)reveal\s+(api\s+)?keys?",
]

SEBI_DISCLAIMER = (
    "\n\n---\n"
    "**Regulatory Disclaimer (SEBI Compliance)**: FinIntel is an automated equity research desk for educational and quantitative analysis purposes. "
    "This output does not constitute investment advice, research analyst recommendation, or solicitation under SEBI (Research Analysts) Regulations, 2014. "
    "Equity markets carry capital risk. Verify all data independently and consult a SEBI-registered investment advisor before committing capital."
)

def validate_ticker(ticker: str) -> str:
    if not ticker or not isinstance(ticker, str):
        raise ValueError("Ticker symbol is required.")
    cleaned = ticker.strip().upper()
    cleaned = re.sub(r"\.(NS|BO)$", "", cleaned)
    if not re.match(r"^[A-Z0-9&]{1,20}$", cleaned):
        raise ValueError(f"Invalid ticker symbol: '{ticker}'. Must be 1-20 alphanumeric characters.")
    return cleaned

def validate_uuid(thread_id: str) -> str:
    if not thread_id:
        return str(uuid.uuid4())
    try:
        val = uuid.UUID(str(thread_id))
        return str(val)
    except Exception:
        raise ValueError("Invalid thread UUID format.")

def validate_text(text: str, max_len: int = 5000) -> str:
    if not text:
        return ""
    if len(text) > max_len:
        raise ValueError(f"Input text exceeds maximum allowed length of {max_len} characters.")
    return text.strip()

def validate_profile(profile: str) -> str:
    allowed = ["conservative", "balanced", "aggressive"]
    p = (profile or "balanced").strip().lower()
    return p if p in allowed else "balanced"

def check_prompt_injection(text: str) -> bool:
    if not text:
        return False
    for pat in PROMPT_INJECTION_PATTERNS:
        if re.search(pat, text):
            return True
    return False

def sanitise_output(text: str) -> str:
    if not text:
        return SEBI_DISCLAIMER
    output = text
    for pattern, replacement in FORBIDDEN_PHRASES:
        output = re.sub(pattern, replacement, output)
    # Scrub potential email leaks
    output = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[REDACTED-EMAIL]", output)
    # Scrub phone numbers
    output = re.sub(r"\b(?:\+91[- ]?)?[6-9]\d{9}\b", "[REDACTED-PHONE]", output)
    if "Regulatory Disclaimer" not in output:
        output += SEBI_DISCLAIMER
    return output

