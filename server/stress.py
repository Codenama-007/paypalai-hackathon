"""
Stress Lab: Simulates macroeconomic shock scenarios on user holdings using deterministic factor sensitivities.
"""
from typing import List, Dict, Any


def run_portfolio_stress_test(
    holdings: List[Dict[str, Any]],
    crude_shock_pct: float = 0.0,
    inr_depreciation_pct: float = 0.0,
    rate_hike_bps: float = 0.0
) -> Dict[str, Any]:
    total_val = sum(h.get("shares", 0) * h.get("price", 0) for h in holdings) or 100000.0

    impacted_holdings = []
    total_shock_pnl = 0.0

    for h in holdings:
        ticker = h.get("ticker", "UNKNOWN").upper()
        shares = float(h.get("shares", 10))
        price = float(h.get("price", 1000))
        value = shares * price

        # Sector sensitivities
        # Energy/Oil sensitive to crude, IT benefits from weak INR, Banks sensitive to repo rates
        sector_factor = 0.0
        if "TCS" in ticker or "INFY" in ticker:
            sector_factor += (inr_depreciation_pct * 0.4) - (rate_hike_bps * 0.005)
        elif "HDFC" in ticker or "ICICI" in ticker or "SBIN" in ticker:
            sector_factor -= (rate_hike_bps * 0.015)
        elif "TATAMOTORS" in ticker or "MARUTI" in ticker:
            sector_factor -= (crude_shock_pct * 0.25) + (rate_hike_bps * 0.01)
        elif "RELIANCE" in ticker:
            sector_factor += (crude_shock_pct * 0.15)
        else:
            sector_factor -= (rate_hike_bps * 0.008)

        shocked_pnl = round(value * (sector_factor / 100.0), 2)
        total_shock_pnl += shocked_pnl

        impacted_holdings.append({
            "ticker": ticker,
            "original_value": value,
            "shocked_value": round(value + shocked_pnl, 2),
            "estimated_pnl": shocked_pnl,
            "impact_pct": round(sector_factor, 2)
        })

    total_impact_pct = round((total_shock_pnl / total_val) * 100.0, 2) if total_val > 0 else 0.0

    return {
        "scenario_params": {
            "crude_shock_pct": crude_shock_pct,
            "inr_depreciation_pct": inr_depreciation_pct,
            "rate_hike_bps": rate_hike_bps
        },
        "total_portfolio_value": total_val,
        "estimated_pnl": round(total_shock_pnl, 2),
        "total_impact_pct": total_impact_pct,
        "positions": impacted_holdings
    }
