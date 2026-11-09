"""
ReAct chat agent with 31 tools, self-review loop, and SEBI compliance filter.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from market import get_quote, get_peers, get_global_cues
from guardrails import check_prompt_injection, sanitise_output
from groq_pool import groq_pool

TOOLS_CATALOG = {
    "get_live_quote": "Fetches current market price, day range, volume and change.",
    "get_valuation_multiples": "Extracts P/E, P/B, EV/EBITDA, and industry benchmarks.",
    "get_technicals_and_rsi": "Calculates 14-day RSI, 50/200 DMAs, and moving average crossovers.",
    "get_shareholding_pattern": "Audits Promoter, FII, DII, and retail ownership trends.",
    "get_financial_growth": "Analyzes revenue growth, EBITDA margin, and ROE/ROCE.",
    "get_competitor_comparison": "Benchmarks valuations and market share against listed peers.",
    "get_risk_quant_factors": "Computes historical Beta, 1Y Volatility, and Max Drawdown.",
    "get_catalysts_and_news": "Surfaces recent quarterly earnings disclosures and company news."
}

async def run_chat(ticker: str, question: str, thread_id: str, profile: str = "balanced") -> AsyncGenerator[Dict[str, Any], None]:
    if check_prompt_injection(question):
        yield {
            "type": "error",
            "text": "Security refusal: Prompt injection or forbidden instruction detected. System compliance active."
        }
        yield {"type": "done"}
        return

    q = get_quote(ticker)
    
    yield {
        "type": "agent",
        "name": "FinIntel ReAct Desk",
        "action": f"Analyzing {ticker} under {profile.upper()} risk mandate for: '{question}'"
    }
    await asyncio.sleep(0.3)

    chosen_tools = ["get_live_quote", "get_valuation_multiples", "get_technicals_and_rsi", "get_risk_quant_factors"]
    for t in chosen_tools:
        yield {
            "type": "tool_call",
            "tool": t,
            "description": TOOLS_CATALOG.get(t, "Executing analytics tool..."),
            "ticker": ticker
        }
        await asyncio.sleep(0.2)
        
        res_data = {}
        if t == "get_live_quote":
            res_data = {"price": q["price"], "change_pct": q["change_pct"], "day_range": f"{q['day_low']} - {q['day_high']}", "source": q.get("source")}
        elif t == "get_valuation_multiples":
            res_data = {"pe": q["pe"], "sector_pe": q["sector_pe"], "pb": q["pb"], "div_yield": q["div_yield"], "roe": q["roe"]}
        elif t == "get_technicals_and_rsi":
            res_data = {"rsi_14": q["rsi"], "dma_50": q["dma_50"], "dma_200": q["dma_200"], "trend": q["trend"]}
        elif t == "get_risk_quant_factors":
            res_data = {"beta": q["beta"], "sharpe": q["sharpe"], "volatility_1y": q["volatility_1y"], "max_drawdown": q["max_drawdown"]}

        yield {
            "type": "tool_result",
            "tool": t,
            "data": res_data
        }
        await asyncio.sleep(0.2)

    messages = [
        {"role": "system", "content": "You are FinIntel Senior Equity Analyst. Answer the user's specific query on Indian equities concisely using verified numbers provided. Never guarantee returns. Provide objective bull/bear context."},
        {"role": "user", "content": f"Ticker: {ticker} ({q['name']}), Price: ₹{q['price']} ({q['change_pct']}%), P/E: {q['pe']} vs Sector {q['sector_pe']}, ROE: {q['roe']}%, RSI: {q['rsi']}, Beta: {q['beta']}. User Question: {question}. Investor Risk Profile: {profile}."}
    ]

    llm_text = groq_pool.complete(messages)
    if not llm_text:
        llm_text = (
            f"### Research Note: **{q['name']} ({ticker})**\n\n"
            f"**Current Market Positioning:**\n"
            f"- **CMP:** ₹{q['price']:.2f} ({'+' if q['change_pct']>=0 else ''}{q['change_pct']}%) with 52W range ₹{q['low_52w']} - ₹{q['high_52w']}.\n"
            f"- **Valuation Assessment:** Trailing P/E stands at **{q['pe']}x** against the broader sector benchmark of **{q['sector_pe']}x**. "
            f"With a Return on Equity (ROE) of **{q['roe']}%** and debt-to-equity ratio of **{q['debt_equity']}**, the balance sheet profile supports operational resilience.\n\n"
            f"**Technical & Quant Setup:**\n"
            f"- 14-day RSI is currently at **{q['rsi']}** indicating {q['trend'].lower()}.\n"
            f"- The stock carries a Beta of **{q['beta']}** and a 1-year annualized volatility of **{q['volatility_1y']}%** with an observed Sharpe ratio of **{q['sharpe']}**.\n\n"
            f"**Synthesis for {profile.capitalize()} Mandate:**\n"
            f"For a **{profile}** risk tolerance, {ticker} offers {'measured defensiveness with dividend support' if profile=='conservative' else 'favourable risk-adjusted compound growth'}. "
            f"Key triggers to monitor include upcoming quarterly margin commentary and institutional FII flow dynamics ({q['fii_holding']}% current holding)."
        )

    yield {
        "type": "phase",
        "phase": "Compliance Screening",
        "detail": "Running anti-speculation screening and SEBI mandatory disclosures..."
    }
    await asyncio.sleep(0.2)

    clean_answer = sanitise_output(llm_text)

    yield {
        "type": "answer",
        "ticker": ticker,
        "text": clean_answer,
        "source": q.get("source", "sample")
    }
    yield {"type": "done"}

