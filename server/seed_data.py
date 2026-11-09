"""
Curated offline sample data for Indian (NSE) equities.
Guarantees graceful degradation when external scrapers or live APIs are blocked/unreachable.
"""
from typing import Dict, Any, Optional

SAMPLE_NSE_DATA: Dict[str, Dict[str, Any]] = {
    "RELIANCE": {
        "name": "Reliance Industries Limited",
        "ticker": "RELIANCE",
        "sector": "Energy & Conglomerate",
        "price": 2985.40,
        "change_pct": 1.25,
        "market_cap_cr": 2020450.0,
        "pe": 28.4,
        "pb": 2.65,
        "roe": 9.8,
        "roce": 10.2,
        "debt_to_equity": 0.42,
        "beta": 1.08,
        "sharpe": 1.15,
        "rsi": 56.4,
        "52w_high": 3217.90,
        "52w_low": 2221.05,
        "description": "India's largest private sector enterprise with businesses in energy, petrochemicals, retail and telecommunications (Jio).",
        "competitors": ["TCS", "ONGC", "BHARTIARTL", "IOC"],
        "source": "sample"
    },
    "TCS": {
        "name": "Tata Consultancy Services Limited",
        "ticker": "TCS",
        "sector": "Information Technology",
        "price": 4120.80,
        "change_pct": -0.65,
        "market_cap_cr": 1490200.0,
        "pe": 31.8,
        "pb": 14.2,
        "roe": 48.5,
        "roce": 59.2,
        "debt_to_equity": 0.0,
        "beta": 0.72,
        "sharpe": 1.45,
        "rsi": 48.2,
        "52w_high": 4585.00,
        "52w_low": 3311.00,
        "description": "Leading global IT services, consulting, and business solutions organisation.",
        "competitors": ["INFY", "WIPRO", "HCLTECH", "TECHM"],
        "source": "sample"
    },
    "INFY": {
        "name": "Infosys Limited",
        "ticker": "INFY",
        "sector": "Information Technology",
        "price": 1845.50,
        "change_pct": 0.85,
        "market_cap_cr": 765400.0,
        "pe": 29.1,
        "pb": 8.7,
        "roe": 31.5,
        "roce": 39.8,
        "debt_to_equity": 0.0,
        "beta": 0.88,
        "sharpe": 1.22,
        "rsi": 54.0,
        "52w_high": 1990.00,
        "52w_low": 1358.35,
        "description": "Next-generation digital services and consulting leader in India.",
        "competitors": ["TCS", "HCLTECH", "WIPRO", "LTIM"],
        "source": "sample"
    },
    "HDFCBANK": {
        "name": "HDFC Bank Limited",
        "ticker": "HDFCBANK",
        "sector": "Financial Services / Banking",
        "price": 1680.20,
        "change_pct": 0.45,
        "market_cap_cr": 1280000.0,
        "pe": 19.4,
        "pb": 2.8,
        "roe": 15.6,
        "roce": 16.8,
        "debt_to_equity": 6.8,
        "beta": 1.05,
        "sharpe": 0.95,
        "rsi": 52.8,
        "52w_high": 1794.00,
        "52w_low": 1363.55,
        "description": "India's largest private sector bank following its historic merger with HDFC Ltd.",
        "competitors": ["ICICIBANK", "KOTAKBANK", "AXISBANK", "SBIN"],
        "source": "sample"
    },
    "TATAMOTORS": {
        "name": "Tata Motors Limited",
        "ticker": "TATAMOTORS",
        "sector": "Automobile",
        "price": 995.60,
        "change_pct": 2.10,
        "market_cap_cr": 365000.0,
        "pe": 11.2,
        "pb": 3.8,
        "roe": 34.2,
        "roce": 21.5,
        "debt_to_equity": 0.85,
        "beta": 1.42,
        "sharpe": 1.68,
        "rsi": 62.1,
        "52w_high": 1179.05,
        "52w_low": 650.00,
        "description": "Automotive leader encompassing commercial vehicles, passenger cars, EVs and luxury subsidiary Jaguar Land Rover.",
        "competitors": ["MARUTI", "M&M", "BAJAJ-AUTO", "EICHERMOT"],
        "source": "sample"
    }
}


def get_sample_quote(ticker: str) -> Optional[Dict[str, Any]]:
    return SAMPLE_NSE_DATA.get(ticker.upper())


def search_sample_symbols(q: str):
    q = q.upper()
    results = []
    for sym, data in SAMPLE_NSE_DATA.items():
        if q in sym or q.lower() in data["name"].lower():
            results.append({
                "ticker": sym,
                "name": data["name"],
                "sector": data["sector"],
                "price": data["price"]
            })
    return results
