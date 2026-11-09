"""
Portfolio Agent: Holdings ingestion, parallel pricing, concentration risk audit, and rebalance approval gate.
"""
import json
from typing import AsyncGenerator, Dict, Any, List, Optional
from market import get_market_quote
from database import SessionLocal, Portfolio
from session_registry import session_registry

_PORTFOLIO_SESSIONS: Dict[str, Dict[str, Any]] = {}


def parse_holdings_text(text_content: str) -> List[Dict[str, Any]]:
    holdings = []
    lines = text_content.strip().split("\n")
    for line in lines:
        parts = [p.strip() for p in line.replace(",", " ").split() if p.strip()]
        if len(parts) >= 2:
            sym = parts[0].upper()
            try:
                shares = float(parts[1])
                quote = get_market_quote(sym)
                holdings.append({
                    "ticker": sym,
                    "shares": shares,
                    "price": quote["price"],
                    "value": round(shares * quote["price"], 2),
                    "sector": quote.get("sector", "Other")
                })
            except Exception:
                continue
    return holdings


async def stream_portfolio_audit(thread_id: str, holdings: List[Dict[str, Any]]) -> AsyncGenerator[Dict[str, Any], None]:
    session_registry.touch(thread_id)
    total_val = sum(h["value"] for h in holdings) or 1.0

    yield {"type": "phase", "phase": "Valuation", "text": f"Priced {len(holdings)} holdings in parallel. Total Portfolio Value: ₹{total_val:,.2f}"}

    # Weight computation
    weights = []
    for h in holdings:
        w = round((h["value"] / total_val) * 100.0, 2)
        weights.append({**h, "weight_pct": w})
        yield {"type": "holding", "ticker": h["ticker"], "value": h["value"], "weight_pct": w}

    # Check concentration
    concentrated = [h for h in weights if h["weight_pct"] > 35.0]
    if concentrated:
        high_risk_ticker = concentrated[0]["ticker"]
        _PORTFOLIO_SESSIONS[thread_id] = {
            "holdings": holdings,
            "action": f"Trim {high_risk_ticker} from {concentrated[0]['weight_pct']}% to 20% to mitigate concentration risk."
        }
        yield {
            "type": "approval_request",
            "action": f"Excessive single-stock concentration detected in {high_risk_ticker}. Approve proposed rebalance?",
            "proposal": _PORTFOLIO_SESSIONS[thread_id]["action"],
            "requires_action": True
        }
    else:
        yield {
            "type": "final",
            "text": "Portfolio concentration is balanced within healthy diversification boundaries."
        }

    yield {"type": "done"}


async def resume_portfolio(thread_id: str, decision: str) -> AsyncGenerator[Dict[str, Any], None]:
    session_registry.touch(thread_id)
    session = _PORTFOLIO_SESSIONS.get(thread_id)

    if not session:
        yield {"type": "error", "text": "Session expired. Please run portfolio audit again."}
        yield {"type": "done"}
        return

    if decision.strip().lower() in ["approve", "yes"]:
        yield {"type": "final", "text": f"Rebalance approved: {session['action']} logged."}
    else:
        yield {"type": "final", "text": "Rebalance recommendation dismissed."}

    if thread_id in _PORTFOLIO_SESSIONS:
        del _PORTFOLIO_SESSIONS[thread_id]
    yield {"type": "done"}
