"""
Verdict logger and paper-trading ledger connected to Neon PostgreSQL.
"""
import uuid
import datetime
from typing import List, Dict, Any, Optional
from database import get_db_session, VerdictLog, LedgerPosition
from market import get_market_quote


def log_verdict(ticker: str, verdict: str, confidence: float, rationale: str, user_id: Optional[str] = None) -> Dict[str, Any]:
    quote = get_market_quote(ticker)
    price = quote.get("price", 0.0)

    db = get_db_session()
    try:
        verdict_id = str(uuid.uuid4())
        entry = VerdictLog(
            id=verdict_id,
            user_id=user_id,
            ticker=ticker.upper(),
            verdict=verdict.upper(),
            confidence=round(confidence, 2),
            rationale=rationale,
            price_at_verdict=price,
            current_price=price,
            alpha=0.0,
            status="pending"
        )
        db.add(entry)

        # If action is BUY or SELL, execute paper-trading ledger position
        if verdict.upper() in ["BUY", "SELL"]:
            capital = 100000.0  # ₹1,00,000 standard virtual allocation
            shares = round(capital / price, 2) if price > 0 else 0
            pos_id = str(uuid.uuid4())
            pos = LedgerPosition(
                id=pos_id,
                user_id=user_id or "demo-user",
                ticker=ticker.upper(),
                action=verdict.upper(),
                shares=shares,
                entry_price=price,
                allocated_capital=capital,
                mark_to_market=capital,
                alpha_vs_nifty=0.0
            )
            db.add(pos)

        db.commit()
        return {
            "id": verdict_id,
            "ticker": ticker.upper(),
            "verdict": verdict.upper(),
            "price": price,
            "logged_at": datetime.datetime.utcnow().isoformat()
        }
    finally:
        db.close()


def get_track_record(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    db = get_db_session()
    try:
        query = db.query(VerdictLog)
        if user_id:
            query = query.filter(VerdictLog.user_id == user_id)
        entries = query.order_by(VerdictLog.created_at.desc()).limit(50).all()

        results = []
        for e in entries:
            live = get_market_quote(e.ticker)
            curr_price = live.get("price", e.price_at_verdict)
            return_pct = round(((curr_price - e.price_at_verdict) / e.price_at_verdict) * 100, 2) if e.price_at_verdict > 0 else 0.0

            results.append({
                "id": e.id,
                "ticker": e.ticker,
                "verdict": e.verdict,
                "confidence": e.confidence,
                "entry_price": e.price_at_verdict,
                "current_price": curr_price,
                "return_pct": return_pct,
                "status": e.status,
                "created_at": e.created_at.isoformat() if e.created_at else None
            })
        return results
    finally:
        db.close()


def get_ledger(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    db = get_db_session()
    try:
        query = db.query(LedgerPosition)
        if user_id:
            query = query.filter(LedgerPosition.user_id == user_id)
        positions = query.order_by(LedgerPosition.created_at.desc()).all()

        out = []
        for p in positions:
            quote = get_market_quote(p.ticker)
            curr = quote.get("price", p.entry_price)
            mtm = round(p.shares * curr, 2)
            pnl = round(mtm - p.allocated_capital, 2)
            pnl_pct = round((pnl / p.allocated_capital) * 100, 2) if p.allocated_capital > 0 else 0.0

            out.append({
                "id": p.id,
                "ticker": p.ticker,
                "action": p.action,
                "shares": p.shares,
                "entry_price": p.entry_price,
                "current_price": curr,
                "allocated_capital": p.allocated_capital,
                "mark_to_market": mtm,
                "pnl": pnl,
                "pnl_pct": pnl_pct,
                "created_at": p.created_at.isoformat() if p.created_at else None
            })
        return out
    finally:
        db.close()
