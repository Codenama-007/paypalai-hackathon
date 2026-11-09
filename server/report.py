"""
Report Engine: Aggregates all engines to generate an institutional-grade equity research note.
"""
from typing import Dict, Any
from market import get_market_quote
from screener import get_financial_summary
from ecosystem import get_ecosystem_map
from guardrails import sanitise_output


def generate_research_report(ticker: str) -> Dict[str, Any]:
    quote = get_market_quote(ticker)
    fin = get_financial_summary(ticker)
    eco = get_ecosystem_map(ticker)

    report_markdown = f"""# Equity Research Memorandum: {quote['name']} (NSE: {quote['ticker']})

## 1. Executive Summary & Market Snapshot
- **Current Market Price**: ₹{quote['price']} ({quote['change_pct']}%)
- **Market Capitalization**: ₹{quote['market_cap_cr']} Cr
- **52-Week Range**: ₹{quote['52w_low']} - ₹{quote['52w_high']}
- **Sector**: {quote['sector']}
- **Data Source**: {quote['source'].capitalize()}

## 2. Valuation & Financial Quality Scorecard
- **Trailing P/E**: {quote.get('pe', 'N/A')}
- **Price to Book (P/B)**: {quote.get('pb', 'N/A')}
- **Return on Equity (ROE)**: {quote.get('roe', 'N/A')}%
- **Debt-to-Equity**: {quote.get('debt_to_equity', 'N/A')}

## 3. Quantitative Risk & Technical Indicators
- **RSI (14-period)**: {quote.get('rsi', 'N/A')}
- **Annualized Volatility**: {quote.get('volatility', 'N/A')}
- **Sharpe Ratio (7% benchmark)**: {quote.get('sharpe', 'N/A')}
- **Beta vs. NIFTY 50**: {quote.get('beta', 'N/A')}
- **Max Historical Drawdown**: {quote.get('max_drawdown', 'N/A')}%

## 4. Ecosystem & Competitive Positioning
- **Key Partners**: {", ".join(eco['partners'])}
- **Primary Customer Segments**: {", ".join(eco['customers'])}
- **Direct Competitors**: {", ".join([c['ticker'] for c in eco['competitors_live']])}

## 5. Synthesis & Institutional View
{quote['name']} demonstrates a resilient market presence within the {quote['sector']} sector. Key operational focus includes margin expansion and disciplined capital allocation.
"""
    clean_report = sanitise_output(report_markdown, append_disclaimer=True)

    return {
        "ticker": quote["ticker"],
        "name": quote["name"],
        "market_quote": quote,
        "financials": fin,
        "ecosystem": eco,
        "report_markdown": clean_report
    }
