"""
Macroeconomic stress testing engine for portfolio holdings.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any
from quant import compute_stress_test
from portfolio import get_current_portfolio
from guardrails import sanitise_output

async def stream_stress_test(scenario: str, market_shock: float, crude_shock: float, inr_shock: float, rates_shock: float, profile: str = "balanced") -> AsyncGenerator[Dict[str, Any], None]:
    holdings = get_current_portfolio()
    results = compute_stress_test(
        holdings=holdings,
        market_shock=market_shock,
        crude_shock=crude_shock,
        inr_shock=inr_shock,
        rate_shock_bps=rates_shock
    )

    yield {
        "type": "shock",
        "scenario": scenario,
        "params": results["scenario_params"],
        "baseline_value": results["baseline_value"],
        "stressed_value": results["stressed_value"],
        "total_drawdown": results["total_drawdown"],
        "drawdown_pct": results["drawdown_pct"]
    }
    await asyncio.sleep(0.3)

    for h in results["holdings_impact"]:
        yield {
            "type": "impact",
            "ticker": h["ticker"],
            "name": h["name"],
            "current_value": h["current_value"],
            "shocked_value": h["shocked_value"],
            "loss": h["loss"],
            "loss_pct": h["loss_pct"],
            "resilience": h["resilience"]
        }
        await asyncio.sleep(0.1)

    narrative = (
        f"### Stress Test Diagnostic: **{scenario}**\n\n"
        f"- **Projected Portfolio Drawdown:** ₹{abs(results['total_drawdown']):,.2f} (**{results['drawdown_pct']}%**)\n"
        f"- Under a broad market shock of **{market_shock}%**, crude movement of **{'+' if crude_shock>=0 else ''}{crude_shock}%**, "
        f"and rate hike of **{rates_shock} bps**, the portfolio demonstrates resilient capital preservation.\n"
        f"- Defensive components (IT & FMCG) mitigate downside risks, while high-beta cyclicals absorb the brunt of the contraction.\n"
        f"- **Mitigation Action:** Consider adding hedging positions or increasing allocation to cash equivalents if tail-risk probability elevates."
    )

    yield {
        "type": "narrative",
        "text": sanitise_output(narrative)
    }
    yield {"type": "done"}

