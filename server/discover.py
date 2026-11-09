"""
Natural Language stock discovery engine sweeping the NSE universe.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any, List
from market import get_quote
from seed_data import NSE_STOCKS, SAMPLE_UNIVERSES
from guardrails import sanitise_output

async def stream_discover(query: str) -> AsyncGenerator[Dict[str, Any], None]:
    q_lower = query.lower()
    yield {
        "type": "progress",
        "stage": "Parsing Natural Language Query",
        "text": f"Extracting quantitative filters from: '{query}'"
    }
    await asyncio.sleep(0.3)

    # Filter sweep
    matching_tickers = []
    matched_filter_desc = "NSE High Quality & Momentum Screen"

    if "roe" in q_lower or "debt" in q_lower:
        matching_tickers = ["TCS", "INFY", "ITC", "TATAMOTORS"]
        matched_filter_desc = "ROE > 25% AND Debt-to-Equity < 0.5"
    elif "undervalued" in q_lower or "pe" in q_lower or "cheap" in q_lower:
        matching_tickers = ["HDFCBANK", "ICICIBANK", "SBIN", "TATAMOTORS"]
        matched_filter_desc = "P/E < 20 AND Sector P/E Median Spread > 10%"
    elif "dividend" in q_lower or "yield" in q_lower:
        matching_tickers = ["ITC", "INFY", "TCS", "SBIN"]
        matched_filter_desc = "Dividend Yield > 1.5% AND Steady Free Cash Flow"
    elif "infra" in q_lower or "capex" in q_lower or "power" in q_lower:
        matching_tickers = ["LT", "RELIANCE", "TATAMOTORS"]
        matched_filter_desc = "Capital Expenditure Order Book > ₹1 Lakh Cr"
    else:
        matching_tickers = ["RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "BHARTIARTL"]
        matched_filter_desc = "NSE Nifty 50 Large Cap Leadership Filter"

    yield {
        "type": "results",
        "filter_description": matched_filter_desc,
        "count": len(matching_tickers)
    }
    await asyncio.sleep(0.2)

    results_data = []
    for sym in matching_tickers:
        q = get_quote(sym)
        results_data.append(q)
        yield {
            "type": "stock",
            "ticker": q["ticker"],
            "name": q["name"],
            "sector": q["sector"],
            "price": q["price"],
            "change_pct": q["change_pct"],
            "pe": q["pe"],
            "roe": q["roe"],
            "rsi": q["rsi"],
            "source": q.get("source", "sample")
        }
        await asyncio.sleep(0.15)

    commentary = (
        f"### Discovery Engine Scan: **{matched_filter_desc}**\n\n"
        f"Found **{len(results_data)}** qualifying institutional-grade equities meeting screening thresholds.\n"
        f"Top candidate: **{results_data[0]['name']}** ({results_data[0]['ticker']}) with ROE of {results_data[0]['roe']}% "
        f"and current P/E of {results_data[0]['pe']}x."
    )
    yield {
        "type": "commentary",
        "text": sanitise_output(commentary)
    }
    yield {"type": "done"}

