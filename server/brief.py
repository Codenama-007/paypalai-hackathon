"""
Morning research brief generator for market open preparation.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any, List
from market import get_quote, get_global_cues
from guardrails import sanitise_output

async def stream_morning_brief(tickers: List[str]) -> AsyncGenerator[Dict[str, Any], None]:
    cues = get_global_cues()
    yield {
        "type": "markets",
        "indices": cues["indices"],
        "commodities": cues["commodities_currencies"],
        "macro_summary": cues["summary"]
    }
    await asyncio.sleep(0.3)

    if not tickers:
        tickers = ["RELIANCE", "TCS", "HDFCBANK", "TATAMOTORS"]

    for t in tickers[:6]:
        q = get_quote(t)
        yield {
            "type": "stock",
            "ticker": q["ticker"],
            "name": q["name"],
            "price": q["price"],
            "change_pct": q["change_pct"],
            "trend": q["trend"],
            "rsi": q["rsi"],
            "source": q.get("source", "sample")
        }
        await asyncio.sleep(0.15)

    brief_text = (
        f"### FinIntel Morning Market Desk Brief\n\n"
        f"**Macro Outlook:**\n"
        f"- NIFTY 50 poised for positive bias supported by softening Brent crude ($74.20) and steady DII institutional absorption.\n"
        f"- USD/INR stability near 84.38 provides balanced tailwinds for exporter verticals.\n\n"
        f"**Watchlist Key Themes:**\n"
        f"- **BFSI:** HDFC Bank & ICICI Bank show strong deposit accumulation and pristine asset quality.\n"
        f"- **Technology:** TCS and Infosys exhibit resilient deal traction and multi-year low attrition levels.\n"
        f"- **Auto/Conglomerate:** Reliance & Tata Motors testing vital technical support moving averages with asymmetric risk-reward."
    )

    yield {
        "type": "brief",
        "text": sanitise_output(brief_text)
    }
    yield {"type": "done"}

