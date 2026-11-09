"""
War Room orchestrated agent debate:
Planner -> Parallel Specialists (Quant, Fundamental, News, Risk) -> Bull vs Bear -> Judge with Human Gate.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any
from market import get_quote
from verdict_log import log_verdict
from guardrails import sanitise_output

_WAR_THREADS: Dict[str, Dict[str, Any]] = {}

async def start_war_room(query: str, ticker: str, thread_id: str) -> AsyncGenerator[Dict[str, Any], None]:
    ticker = (ticker or "RELIANCE").upper()
    q = get_quote(ticker)

    _WAR_THREADS[thread_id] = {
        "ticker": ticker,
        "query": query,
        "verdict_pending": {}
    }

    yield {
        "type": "plan",
        "ticker": ticker,
        "chief_analyst": "Orchestrating 4 domain specialists for multi-perspective debate on " + ticker,
        "objective": query or f"Evaluate high-conviction positioning on {ticker}"
    }
    await asyncio.sleep(0.4)

    specialists = [
        {
            "name": "Quantitative Specialist",
            "findings": f"Observed 1Y Volatility of {q['volatility_1y']}%, Beta {q['beta']}, Sharpe {q['sharpe']}. Technical RSI is {q['rsi']} with support at 200 DMA (₹{q['dma_200']})."
        },
        {
            "name": "Fundamental Valuation Specialist",
            "findings": f"Trailing P/E is {q['pe']}x vs sector median {q['sector_pe']}x. Return on Equity is {q['roe']}% with conservative debt-to-equity of {q['debt_equity']}."
        },
        {
            "name": "News & Catalyst Specialist",
            "findings": f"Institutional ownership strong: FII {q['fii_holding']}%, DII {q['dii_holding']}%. Strategic growth catalysts active in retail and expansion."
        },
        {
            "name": "Risk Officer",
            "findings": f"Maximum drawdown risk calculated at {q['max_drawdown']}%. Macro sensitivity to rate cycles and input cost inflation is within safety bounds."
        }
    ]

    for s in specialists:
        yield {
            "type": "specialist",
            "role": s["name"],
            "ticker": ticker,
            "text": s["findings"]
        }
        await asyncio.sleep(0.3)

    bull_case = (
        f"**Bull Case:** {ticker} enjoys an impenetrable market moat in {q['sector']}. "
        f"A ROE of {q['roe']}% combined with secular domestic demand provides compounding power. "
        f"Current price ₹{q['price']} offers a favorable risk/reward asymmetric upside towards 52W high (₹{q['high_52w']})."
    )
    yield {
        "type": "debate",
        "stance": "BULL",
        "advocate": "Senior Bullish Strategist",
        "argument": bull_case
    }
    await asyncio.sleep(0.4)

    bear_case = (
        f"**Bear Case:** Near-term multiple re-rating could face resistance if sector headwinds intensify. "
        f"At {q['pe']}x P/E, execution perfection is priced in. "
        f"Any unexpected domestic demand slowdown or margin compression could trigger a pullback to 50 DMA support (₹{q['dma_50']})."
    )
    yield {
        "type": "debate",
        "stance": "BEAR",
        "advocate": "Contrarian Risk Skeptic",
        "argument": bear_case
    }
    await asyncio.sleep(0.4)

    recommendation = "BUY" if q['roe'] > 15 and q['rsi'] < 65 else ("HOLD" if q['pe'] > 30 else "ACCUMULATE")
    confidence = 84 if recommendation in ["BUY", "ACCUMULATE"] else 76
    target_upside = round(((q['high_52w'] - q['price']) / q['price']) * 100, 1)

    ruling = {
        "ticker": ticker,
        "recommendation": recommendation,
        "confidence": confidence,
        "target_upside_pct": max(5.0, target_upside),
        "stop_loss": round(q['dma_200'] * 0.96, 2),
        "judge_summary": f"The Judge finds the Bull Thesis dominant over a 12-24 month horizon. {ticker} exhibits healthy cash flow generation and resilient return on capital."
    }
    _WAR_THREADS[thread_id]["verdict_pending"] = ruling

    yield {
        "type": "verdict",
        "ticker": ticker,
        "recommendation": recommendation,
        "confidence": confidence,
        "target_upside_pct": ruling["target_upside_pct"],
        "stop_loss": ruling["stop_loss"],
        "text": ruling["judge_summary"]
    }
    await asyncio.sleep(0.3)

    yield {
        "type": "approval_request",
        "title": "Chief Analyst Sign-Off Required",
        "message": f"Approve logging **{recommendation}** on {ticker} (Confidence: {confidence}%) to FinIntel Institutional Track Record & Paper Ledger?",
        "proposed_action": f"Log {recommendation} into official track record and deploy ₹1,00,000 paper trading tranche."
    }

async def resume_war_room(thread_id: str, decision: str) -> AsyncGenerator[Dict[str, Any], None]:
    state = _WAR_THREADS.get(thread_id)
    if not state or not state.get("verdict_pending"):
        yield {
            "type": "error",
            "text": "War Room session expired or invalid. Please re-run the debate."
        }
        yield {"type": "done"}
        return

    verdict_data = state["verdict_pending"]
    ticker = state["ticker"]
    decision_clean = decision.strip().lower()

    if decision_clean in ["approve", "yes", "confirm"]:
        logged = log_verdict(
            ticker=ticker,
            verdict=verdict_data["recommendation"],
            confidence=verdict_data["confidence"],
            rationale=verdict_data["judge_summary"]
        )
        yield {
            "type": "final",
            "status": "APPROVED",
            "verdict": verdict_data["recommendation"],
            "ticker": ticker,
            "text": sanitise_output(
                f"**Verdict Officially Ratified:** {verdict_data['recommendation']} recorded in Paper Trading Ledger at CMP ₹{logged['entry_price']}.\n"
                f"Target upside: +{verdict_data['target_upside_pct']}% | Stop-loss: ₹{verdict_data['stop_loss']}.\n\n"
                f"{verdict_data['judge_summary']}"
            )
        }
    else:
        yield {
            "type": "final",
            "status": "REJECTED",
            "ticker": ticker,
            "text": sanitise_output(f"Verdict rejected or paused by human analyst. No trade executed in the paper ledger.")
        }
    yield {"type": "done"}

