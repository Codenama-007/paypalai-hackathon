"""
Screener and fundamental data utilities for Indian equities.
"""
from typing import Dict, Any, List
from market import get_market_quote


def get_financial_summary(ticker: str) -> Dict[str, Any]:
    quote = get_market_quote(ticker)
    return {
        "ticker": quote["ticker"],
        "name": quote["name"],
        "valuation": {
            "pe": quote.get("pe"),
            "pb": quote.get("pb"),
            "market_cap_cr": quote.get("market_cap_cr")
        },
        "ratios": {
            "roe": quote.get("roe"),
            "debt_to_equity": quote.get("debt_to_equity"),
            "rsi": quote.get("rsi"),
            "sharpe": quote.get("sharpe"),
            "beta": quote.get("beta")
        },
        "source": quote.get("source", "sample")
    }


def get_quarterly_results(ticker: str) -> List[Dict[str, Any]]:
    # Mock / standard quarterly trend for NSE companies
    quote = get_market_quote(ticker)
    base_revenue = quote.get("market_cap_cr", 10000) * 0.15
    return [
        {"quarter": "Q1 FY25", "revenue_cr": round(base_revenue * 0.94, 2), "net_profit_cr": round(base_revenue * 0.12, 2), "ebitda_margin_pct": 18.2},
        {"quarter": "Q2 FY25", "revenue_cr": round(base_revenue * 0.98, 2), "net_profit_cr": round(base_revenue * 0.13, 2), "ebitda_margin_pct": 18.9},
        {"quarter": "Q3 FY25", "revenue_cr": round(base_revenue * 1.02, 2), "net_profit_cr": round(base_revenue * 0.14, 2), "ebitda_margin_pct": 19.5},
        {"quarter": "Q4 FY25", "revenue_cr": round(base_revenue * 1.06, 2), "net_profit_cr": round(base_revenue * 0.15, 2), "ebitda_margin_pct": 20.1}
    ]


def get_shareholding_pattern(ticker: str) -> Dict[str, float]:
    return {
        "promoter_pct": 50.4,
        "fii_pct": 22.1,
        "dii_pct": 16.5,
        "public_pct": 11.0,
        "pledged_pct": 0.0
    }
