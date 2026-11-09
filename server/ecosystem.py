"""
Ecosystem mapping and institutional research report engines.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any
from market import get_quote, get_peers
from seed_data import NSE_STOCKS
from guardrails import sanitise_output

async def stream_ecosystem(ticker: str) -> AsyncGenerator[Dict[str, Any], None]:
    ticker = ticker.upper()
    q = get_quote(ticker)
    seed = NSE_STOCKS.get(ticker, {})

    peers = get_peers(ticker)
    customers = seed.get("customers", ["Tier-1 Indian Enterprises", "Global MNC Clients"])
    suppliers = seed.get("suppliers", ["Domestic Raw Material Vendors", "Cloud Infrastructure Providers"])
    partners = seed.get("partners", ["Global Strategic Alliances", "Distribution Channel Partners"])

    yield {
        "type": "map",
        "ticker": ticker,
        "name": q["name"],
        "sector": q["sector"],
        "competitors": peers,
        "customers": customers,
        "suppliers": suppliers,
        "partners": partners
    }
    await asyncio.sleep(0.4)

    summary = (
        f"### Ecosystem & Competitive Moat: **{q['name']}**\n\n"
        f"- **Direct Competitors:** Faced against {', '.join([p['ticker'] for p in peers])}.\n"
        f"- **Valuation Spread:** {ticker} trades at {q['pe']}x P/E relative to peer median.\n"
        f"- **Bargaining Power:** Strong customer lock-in supported by marquee partners ({', '.join(partners[:2])})."
    )

    yield {
        "type": "summary",
        "text": sanitise_output(summary)
    }
    yield {"type": "done"}

async def stream_report(ticker: str) -> AsyncGenerator[Dict[str, Any], None]:
    ticker = ticker.upper()
    q = get_quote(ticker)
    peers = get_peers(ticker)

    yield {
        "type": "phase",
        "phase": "Synthesizing Institutional Dossier",
        "detail": f"Collating valuation, technicals, risk, and peer metrics for {ticker}..."
    }
    await asyncio.sleep(0.4)

    peer_str = ", ".join([f"{p['name']} (P/E {p['pe']}x)" for p in peers])
    report_md = (
        f"# Institutional Equity Research Note: **{q['name']} ({ticker})**\n\n"
        f"**Date:** Today | **CMP:** ₹{q['price']} ({'+' if q['change_pct']>=0 else ''}{q['change_pct']}%) | **Market Cap:** ₹{q['mcap_cr']:,} Cr\n\n"
        f"## 1. Executive Summary\n"
        f"{ticker} demonstrates resilient operational performance within the {q['sector']} domain. "
        f"A return on equity of **{q['roe']}%** paired with conservative balance sheet leverage (Debt/Equity: {q['debt_equity']}) "
        f"provides defensive stability amidst shifting macroeconomic conditions.\n\n"
        f"## 2. Key Valuation Multiples\n"
        f"| Metric | {ticker} | Sector Median | Variance |\n"
        f"|---|---|---|---|\n"
        f"| **P/E Ratio** | {q['pe']}x | {q['sector_pe']}x | {round(((q['pe']-q['sector_pe'])/q['sector_pe'])*100, 1)}% |\n"
        f"| **P/B Ratio** | {q['pb']}x | 4.2x | - |\n"
        f"| **Dividend Yield** | {q['div_yield']}% | 1.1% | +{round(q['div_yield']-1.1, 1)}% |\n\n"
        f"## 3. Quantitative Risk & Technical Profile\n"
        f"- **Beta vs NIFTY 50:** {q['beta']} (Systematic risk profile)\n"
        f"- **1Y Annualized Volatility:** {q['volatility_1y']}%\n"
        f"- **Sharpe Ratio:** {q['sharpe']}\n"
        f"- **Technical Trend:** {q['trend']} with 50 DMA at ₹{q['dma_50']} and 200 DMA at ₹{q['dma_200']}.\n\n"
        f"## 4. Competitive Positioning\n"
        f"Primary peers in review: {peer_str}.\n\n"
        f"## 5. Investment Verdict\n"
        f"**Rating: ACCUMULATE / HOLD** based on multi-year earnings visibility and disciplined capital allocation."
    )

    yield {
        "type": "result",
        "ticker": ticker,
        "text": sanitise_output(report_md),
        "source": q.get("source", "sample")
    }
    yield {"type": "done"}
