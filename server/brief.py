"""
Brief Engine: Generates morning market overview aggregating global cues and user watchlist.
"""
from typing import List, Dict, Any, Optional
from market import get_market_quote
from guardrails import sanitise_output


def generate_morning_brief(tickers: Optional[List[str]] = None, profile: str = "balanced") -> Dict[str, Any]:
    global_cues = {
        "gift_nifty": {"value": 24285.50, "change_pct": 0.42, "sentiment": "Positive"},
        "us_markets": {"sp500": 5890.20, "nasdaq": 18920.40, "change_pct": 0.55, "trend": "Bullish"},
        "asian_markets": {"nikkei": 39380.00, "hang_seng": 20450.00, "sentiment": "Mixed"},
        "commodities": {
            "brent_crude_usd": 74.20,
            "gold_inr_10g": 78500.0,
            "usd_inr": 84.42
        }
    }

    watchlist_tickers = tickers[:8] if tickers else ["RELIANCE", "TCS", "HDFCBANK", "TATAMOTORS"]
    stocks_summary = [get_market_quote(t) for t in watchlist_tickers]

    narrative = (
        f"### Morning Desk Intelligence (Risk Profile: {profile.capitalize()})\n\n"
        f"**Macro Backdrop**: Domestic indices indicate a positive opening backed by a firm GIFT Nifty "
        f"(+0.42%) and steady US cues. Brent crude remains anchored at $74.20/bbl, providing breathing room "
        f"for domestic margins, while USD/INR trades near 84.42.\n\n"
        f"**Watchlist Outlook**:\n"
        + "".join([f"- **{s['ticker']}** (₹{s['price']}): RSI is at {s.get('rsi', 50)} with beta of {s.get('beta', 1.0)}. "
                   f"Recent trajectory shows {s.get('change_pct', 0.0)}% change.\n" for s in stocks_summary])
        + "\n**Key Actionable Focus**: Monitor crude movements and FII institutional flow trends around morning open."
    )

    return {
        "global_cues": global_cues,
        "stocks": stocks_summary,
        "brief_markdown": sanitise_output(narrative, append_disclaimer=True)
    }
