"""
Portfolio management desk: CSV/text ingestion, risk audit, and rebalance approval gate.
"""
import io
import csv
import asyncio
from typing import List, Dict, Any, AsyncGenerator
from quant import compute_portfolio_metrics
from guardrails import sanitise_output

DEFAULT_HOLDINGS = [
    {"ticker": "RELIANCE", "shares": 50, "buy_price": 2620.0},
    {"ticker": "TCS", "shares": 30, "buy_price": 3850.0},
    {"ticker": "HDFCBANK", "shares": 100, "buy_price": 1620.0},
    {"ticker": "TATAMOTORS", "shares": 150, "buy_price": 780.0},
    {"ticker": "ITC", "shares": 200, "buy_price": 440.0}
]

_ACTIVE_PORTFOLIO: List[Dict[str, Any]] = list(DEFAULT_HOLDINGS)
_PORTFOLIO_THREADS: Dict[str, Dict[str, Any]] = {}

def get_current_portfolio() -> List[Dict[str, Any]]:
    return _ACTIVE_PORTFOLIO

def set_current_portfolio(holdings: List[Dict[str, Any]]) -> Dict[str, Any]:
    global _ACTIVE_PORTFOLIO
    _ACTIVE_PORTFOLIO = holdings
    return compute_portfolio_metrics(_ACTIVE_PORTFOLIO)

def parse_holdings_csv(content: str) -> List[Dict[str, Any]]:
    holdings = []
    reader = csv.reader(io.StringIO(content.strip()))
    for row in reader:
        if not row or len(row) < 2:
            continue
        ticker = row[0].strip().upper()
        if ticker in ["TICKER", "SYMBOL", "STOCK"]:
            continue
        try:
            shares = float(row[1].strip())
            buy_price = float(row[2].strip()) if len(row) > 2 else 0.0
            holdings.append({"ticker": ticker, "shares": shares, "buy_price": buy_price})
        except ValueError:
            continue
    return holdings

async def analyze_portfolio_stream(profile: str, thread_id: str) -> AsyncGenerator[Dict[str, Any], None]:
    metrics = compute_portfolio_metrics(_ACTIVE_PORTFOLIO)
    _PORTFOLIO_THREADS[thread_id] = {
        "metrics": metrics,
        "profile": profile
    }

    yield {
        "type": "portfolio",
        "total_value": metrics["total_value"],
        "total_cost": metrics["total_cost"],
        "total_pnl": metrics["total_pnl"],
        "total_pnl_pct": metrics["total_pnl_pct"],
        "portfolio_beta": metrics["portfolio_beta"],
        "portfolio_pe": metrics["portfolio_pe"],
        "risk_score": metrics["risk_score"],
        "holdings": metrics["holdings"],
        "sector_breakdown": metrics["sector_breakdown"]
    }
    await asyncio.sleep(0.4)

    yield {
        "type": "phase",
        "phase": "Risk & Concentration Audit",
        "detail": f"Auditing {len(metrics['holdings'])} holdings against {profile.upper()} risk parameters..."
    }
    await asyncio.sleep(0.3)

    rebalance_plan = (
        f"**Risk Officer Assessment ({profile.capitalize()} Mandate):**\n"
        f"- Portfolio Beta is **{metrics['portfolio_beta']}** (Target: {'<0.85' if profile=='conservative' else ('<1.10' if profile=='balanced' else '<1.35')}).\n"
        f"- Risk Score: **{metrics['risk_score']} / 10**.\n"
        f"- Recommendation: Rebalance allocation by trimming overweight high-beta cyclicals and consolidating into quality large-cap defensive dividend anchors."
    )

    yield {
        "type": "narrative",
        "text": rebalance_plan
    }
    await asyncio.sleep(0.3)

    yield {
        "type": "approval_request",
        "title": "Portfolio Rebalancing Plan Approval",
        "proposed_action": "Execute recommended portfolio trim and reinvest in higher dividend defensives.",
        "message": "Approve proposed rebalance order schedule?"
    }

async def resume_portfolio_stream(thread_id: str, decision: str) -> AsyncGenerator[Dict[str, Any], None]:
    state = _PORTFOLIO_THREADS.get(thread_id)
    if not state:
        yield {"type": "error", "text": "Portfolio session expired."}
        yield {"type": "done"}
        return

    if decision.strip().lower() in ["approve", "yes", "confirm"]:
        yield {
            "type": "final",
            "status": "APPROVED",
            "text": sanitise_output("Portfolio rebalancing orders successfully ratified and sent to execution engine.")
        }
    else:
        yield {
            "type": "final",
            "status": "REJECTED",
            "text": sanitise_output("Rebalancing plan dismissed by user. Current portfolio asset weights maintained.")
        }
    yield {"type": "done"}

