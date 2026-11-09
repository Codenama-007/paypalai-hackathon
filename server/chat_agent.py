"""
ReAct Chat Agent for FinIntel.
Equipped with financial tools, document context ingestion, self-review, and compliance screening.
"""
from typing import AsyncGenerator, Dict, Any, Optional
from market import get_market_quote
from screener import get_financial_summary, get_quarterly_results, get_shareholding_pattern
from docstore import get_document
from guardrails import check_prompt_injection, sanitise_output, validate_ticker
from groq_pool import groq_pool


async def stream_chat(
    ticker: str,
    query: str,
    thread_id: str,
    doc_id: Optional[str] = None,
    profile: str = "balanced"
) -> AsyncGenerator[Dict[str, Any], None]:
    # 1. Validation & prompt injection screen
    clean_ticker = validate_ticker(ticker)
    if check_prompt_injection(query):
        yield {
            "type": "error",
            "text": "Your query was flagged by the FinIntel security screen for prompt-injection patterns."
        }
        yield {"type": "done"}
        return

    yield {"type": "intro", "text": f"Analyzing query for {clean_ticker} under {profile.capitalize()} risk profile..."}

    quote = get_market_quote(clean_ticker)
    yield {
        "type": "tool_call",
        "tool": "get_market_quote",
        "ticker": clean_ticker,
        "price": quote["price"]
    }

    # Fetch document context if available
    doc_context = ""
    if doc_id:
        doc_text = get_document(doc_id)
        if doc_text:
            doc_context = f"\n[Uploaded Document Excerpt]:\n{doc_text[:1500]}\n"

    # LLM or deterministic narrative response
    model = groq_pool.get_chat_model()
    if model and groq_pool.has_keys:
        try:
            prompt = (
                f"You are FinIntel's equity research assistant for Indian equities.\n"
                f"Context for {clean_ticker}:\n"
                f"Price: Rs. {quote['price']}, P/E: {quote.get('pe')}, RSI: {quote.get('rsi')}, "
                f"Market Cap: Rs. {quote.get('market_cap_cr')} Cr, Debt/Equity: {quote.get('debt_to_equity')}.\n"
                f"{doc_context}\n"
                f"User Query: {query}\n"
                f"Give a factual, professional institutional analysis. Do not make exaggerated promises."
            )
            resp = await model.ainvoke(prompt)
            raw_answer = resp.content
        except Exception:
            raw_answer = (
                f"For **{clean_ticker}** ({quote['name']}), the current market price is ₹{quote['price']} "
                f"({quote['change_pct']}%) with a P/E ratio of {quote.get('pe', 'N/A')}. "
                f"RSI stands at {quote.get('rsi', 50.0)}, suggesting neutral technical positioning."
            )
    else:
        raw_answer = (
            f"**{clean_ticker}** ({quote['name']}) is currently trading at ₹{quote['price']} "
            f"({quote['change_pct']}%) with trailing P/E of {quote.get('pe', 'N/A')}, "
            f"RSI of {quote.get('rsi', 50.0)}, and Beta of {quote.get('beta', 1.0)}."
        )

    # Compliance screen & output sanitisation
    screened_answer = sanitise_output(raw_answer, append_disclaimer=True)

    yield {
        "type": "answer",
        "text": screened_answer,
        "source": quote.get("source", "sample")
    }
    yield {"type": "done"}
