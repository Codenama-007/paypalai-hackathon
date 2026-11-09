"""
Market data layer fetching from yfinance with caching and seed fallback.
"""
import time
from typing import Dict, Any, Optional, List
import yfinance as yf
from seed_data import get_sample_quote, SAMPLE_NSE_DATA
from quant import compute_rsi, compute_volatility, compute_sharpe, compute_beta, compute_max_drawdown

_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL = 300  # 5 minutes


def get_market_quote(ticker: str) -> Dict[str, Any]:
    ticker_clean = ticker.strip().upper()
    now = time.time()

    # Check in-memory cache
    if ticker_clean in _CACHE:
        cached_entry = _CACHE[ticker_clean]
        if now - cached_entry["cached_at"] < CACHE_TTL:
            return cached_entry["data"]

    yf_symbol = f"{ticker_clean}.NS"
    try:
        t = yf.Ticker(yf_symbol)
        info = t.info
        hist = t.history(period="6mo")

        if hist.empty or "Close" not in hist:
            raise ValueError(f"No price history for {ticker_clean}")

        prices = hist["Close"].tolist()
        daily_returns = hist["Close"].pct_change().dropna().tolist()

        current_price = round(float(prices[-1]), 2)
        prev_close = round(float(prices[-2]), 2) if len(prices) > 1 else current_price
        change_pct = round(((current_price - prev_close) / prev_close) * 100.0, 2)

        rsi = compute_rsi(prices)
        vol = compute_volatility(daily_returns)
        sharpe = compute_sharpe(daily_returns)
        max_dd, _ = compute_max_drawdown(prices)

        data = {
            "name": info.get("longName", info.get("shortName", ticker_clean)),
            "ticker": ticker_clean,
            "sector": info.get("sector", "NSE Equity"),
            "price": current_price,
            "change_pct": change_pct,
            "market_cap_cr": round((info.get("marketCap", 0) / 1e7), 2),
            "pe": round(info.get("trailingPE", 0.0), 2) if info.get("trailingPE") else None,
            "pb": round(info.get("priceToBook", 0.0), 2) if info.get("priceToBook") else None,
            "roe": round((info.get("returnOnEquity", 0.0) * 100), 2) if info.get("returnOnEquity") else None,
            "roce": None,
            "debt_to_equity": round(info.get("debtToEquity", 0.0) / 100.0, 2) if info.get("debtToEquity") else None,
            "beta": round(info.get("beta", 1.0), 2) if info.get("beta") else 1.0,
            "sharpe": sharpe,
            "rsi": rsi,
            "volatility": vol,
            "max_drawdown": max_dd,
            "52w_high": round(info.get("fiftyTwoWeekHigh", 0.0), 2),
            "52w_low": round(info.get("fiftyTwoWeekLow", 0.0), 2),
            "history_prices": [round(p, 2) for p in prices[-30:]],
            "description": info.get("longBusinessSummary", ""),
            "competitors": SAMPLE_NSE_DATA.get(ticker_clean, {}).get("competitors", []),
            "source": "live"
        }
        _CACHE[ticker_clean] = {"data": data, "cached_at": now}
        return data

    except Exception:
        # Fallback gracefully to offline sample data
        sample = get_sample_quote(ticker_clean)
        if sample:
            sample_copy = dict(sample)
            sample_copy["history_prices"] = [sample["price"] * (1 + (i - 15) * 0.005) for i in range(30)]
            sample_copy["source"] = "sample"
            return sample_copy

        # Synthesize fallback for unseeded ticker
        return {
            "name": f"{ticker_clean} (NSE)",
            "ticker": ticker_clean,
            "sector": "Indian Equities",
            "price": 1000.0,
            "change_pct": 0.0,
            "market_cap_cr": 50000.0,
            "pe": 25.0,
            "pb": 3.0,
            "roe": 15.0,
            "roce": 18.0,
            "debt_to_equity": 0.5,
            "beta": 1.0,
            "sharpe": 1.1,
            "rsi": 50.0,
            "volatility": 0.20,
            "max_drawdown": 12.5,
            "52w_high": 1200.0,
            "52w_low": 800.0,
            "history_prices": [1000.0] * 30,
            "description": f"NSE listed equity {ticker_clean}",
            "competitors": [],
            "source": "sample"
        }
