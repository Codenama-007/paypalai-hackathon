"""
Verdict logging and virtual performance ledger for approved recommendations.
"""
import time
from typing import List, Dict, Any
from market import get_quote

_VERDICTS: List[Dict[str, Any]] = [
    {
        "id": "v-1",
        "ticker": "TCS",
        "verdict": "BUY",
        "entry_price": 3890.00,
        "current_price": 4148.50,
        "return_pct": 6.65,
        "confidence": 88,
        "timestamp": "2026-10-15T10:30:00",
        "rationale": "Strong BFSI deal wins, low debt, premium ROE compounder.",
        "scored": True,
        "outcome": "WIN"
    },
    {
        "id": "v-2",
        "ticker": "TATAMOTORS",
        "verdict": "HOLD",
        "entry_price": 850.00,
        "current_price": 828.50,
        "return_pct": -2.53,
        "confidence": 72,
        "timestamp": "2026-10-22T14:15:00",
        "rationale": "Near-term domestic PV discounting vs long-term JLR demerger upside.",
        "scored": True,
        "outcome": "NEUTRAL"
    }
]

def log_verdict(ticker: str, verdict: str, confidence: int, rationale: str) -> Dict[str, Any]:
    q = get_quote(ticker)
    entry = {
        "id": f"v-{len(_VERDICTS) + 1}",
        "ticker": ticker.upper(),
        "verdict": verdict.upper(),
        "entry_price": q.get("price", 1000.0),
        "current_price": q.get("price", 1000.0),
        "return_pct": 0.0,
        "confidence": confidence,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "rationale": rationale,
        "scored": False,
        "outcome": "PENDING"
    }
    _VERDICTS.insert(0, entry)
    return entry

def get_track_record() -> Dict[str, Any]:
    updated = []
    wins = 0
    total_scored = 0

    for v in _VERDICTS:
        q = get_quote(v["ticker"])
        cmp = q.get("price", v["entry_price"])
        ret = ((cmp - v["entry_price"]) / v["entry_price"]) * 100
        
        outcome = "PENDING"
        if v["verdict"] == "BUY":
            outcome = "WIN" if ret >= 2.0 else ("LOSS" if ret <= -2.0 else "NEUTRAL")
        elif v["verdict"] == "SELL":
            outcome = "WIN" if ret <= -2.0 else ("LOSS" if ret >= 2.0 else "NEUTRAL")
        else:
            outcome = "WIN" if abs(ret) <= 5.0 else "NEUTRAL"

        item = dict(v)
        item["current_price"] = cmp
        item["return_pct"] = round(ret, 2)
        item["outcome"] = outcome
        updated.append(item)
        
        if outcome == "WIN":
            wins += 1
        total_scored += 1

    win_rate = round((wins / total_scored * 100), 1) if total_scored > 0 else 100.0
    return {
        "win_rate_pct": win_rate,
        "total_verdicts": len(updated),
        "active_verdicts": updated
    }

def get_ledger() -> Dict[str, Any]:
    positions = []
    total_invested = 0.0
    total_current_val = 0.0

    for v in _VERDICTS:
        if v["verdict"] in ["BUY", "SELL"]:
            nominal = 100000.0
            q = get_quote(v["ticker"])
            cmp = q.get("price", v["entry_price"])
            ret = ((cmp - v["entry_price"]) / v["entry_price"]) * 100
            if v["verdict"] == "SELL":
                ret = -ret
            
            val = nominal * (1 + ret / 100)
            total_invested += nominal
            total_current_val += val
            
            positions.append({
                "ticker": v["ticker"],
                "action": v["verdict"],
                "entry_price": v["entry_price"],
                "current_price": cmp,
                "invested": nominal,
                "current_value": round(val, 2),
                "pnl": round(val - nominal, 2),
                "pnl_pct": round(ret, 2)
            })

    total_pnl = total_current_val - total_invested
    pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0
    nifty_benchmark_return = 4.2

    return {
        "total_invested": total_invested,
        "portfolio_value": round(total_current_val, 2),
        "total_pnl": round(total_pnl, 2),
        "pnl_pct": round(pnl_pct, 2),
        "alpha_vs_nifty_pct": round(pnl_pct - nifty_benchmark_return, 2),
        "positions": positions
    }

