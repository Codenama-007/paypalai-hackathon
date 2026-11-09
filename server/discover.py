"""
Discover Engine: Converts plain-English stock prompts into structured quantitative screens
and sweeps across the curated NSE universe.
"""
import re
from typing import List, Dict, Any
from market import get_market_quote
from seed_data import SAMPLE_NSE_DATA


def run_discover_screen(query: str) -> Dict[str, Any]:
    q = query.lower()

    # Parse common financial query intents
    filters_applied = []
    candidates = list(SAMPLE_NSE_DATA.keys())
    matched_results = []

    pe_max = 30.0 if "low pe" in q or "cheap" in q or "value" in q else 100.0
    roe_min = 20.0 if "high roe" in q or "profitable" in q else 0.0
    debt_max = 0.5 if "debt-free" in q or "low debt" in q else 10.0

    if pe_max < 100.0:
        filters_applied.append(f"P/E <= {pe_max}")
    if roe_min > 0.0:
        filters_applied.append(f"ROE >= {roe_min}%")
    if debt_max < 10.0:
        filters_applied.append(f"Debt/Equity <= {debt_max}")

    for ticker in candidates:
        quote = get_market_quote(ticker)
        pe = quote.get("pe") or 999.0
        roe = quote.get("roe") or 0.0
        de = quote.get("debt_to_equity") or 0.0

        if pe <= pe_max and roe >= roe_min and de <= debt_max:
            matched_results.append(quote)

    if not matched_results:
        # Return fallback results if filters were too restrictive
        matched_results = [get_market_quote(t) for t in candidates[:3]]

    return {
        "query": query,
        "filters_parsed": filters_applied if filters_applied else ["NSE Broad Universe Sweep"],
        "total_matches": len(matched_results),
        "results": matched_results
    }
