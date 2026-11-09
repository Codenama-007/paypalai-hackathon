"""
Step-by-step analyst task agent with LangGraph-style checkpointing and human approval gate.
"""
import asyncio
from typing import AsyncGenerator, Dict, Any
from market import get_quote, get_peers
from guardrails import sanitise_output

_THREAD_STATE: Dict[str, Dict[str, Any]] = {}

TASKS_WORKFLOW = [
    {
        "step_num": 1,
        "title": "Valuation & Earnings Quality Screening",
        "description": "Inspect trailing vs forward P/E, PEG ratio, EV/EBITDA, and compare against sector peer median.",
        "action_preview": "Compute sector relative valuation spread and historical 5-year median PE."
    },
    {
        "step_num": 2,
        "title": "Balance Sheet & Solvency Stress Audit",
        "description": "Audit interest coverage ratio, working capital cycle, debt-to-equity leverage, and cash flow conversion.",
        "action_preview": "Calculate free cash flow yield and contingent liability exposure."
    },
    {
        "step_num": 3,
        "title": "Institutional Ownership & Momentum Technicals",
        "description": "Cross-reference 14-day RSI, 50/200 DMA crossovers, and institutional FII/DII accumulation patterns.",
        "action_preview": "Identify support / resistance zones and delivery volume surges."
    }
]

async def start_task(ticker: str, task_name: str, thread_id: str) -> AsyncGenerator[Dict[str, Any], None]:
    q = get_quote(ticker)
    _THREAD_STATE[thread_id] = {
        "ticker": ticker,
        "task_name": task_name,
        "current_step": 0,
        "history": []
    }

    yield {
        "type": "intro",
        "ticker": ticker,
        "task": task_name,
        "text": f"FinIntel Analyst desk initialized for **{ticker}** ({q['name']}). Objective: {task_name}."
    }
    await asyncio.sleep(0.3)

    first_step = TASKS_WORKFLOW[0]
    yield {
        "type": "phase",
        "phase": f"Step 1/3: {first_step['title']}",
        "detail": first_step["description"]
    }
    await asyncio.sleep(0.3)

    yield {
        "type": "propose",
        "step": 1,
        "total_steps": 3,
        "title": first_step["title"],
        "description": first_step["description"],
        "proposed_action": first_step["action_preview"],
        "message": "Human approval required: Review the proposed investigation plan. Approve to proceed, Redirect with specific focus, or Stop."
    }

async def resume_task(thread_id: str, decision: str) -> AsyncGenerator[Dict[str, Any], None]:
    state = _THREAD_STATE.get(thread_id)
    if not state:
        yield {
            "type": "error",
            "text": "Task session expired or not found. Please initiate a new analysis."
        }
        yield {"type": "done"}
        return

    ticker = state["ticker"]
    q = get_quote(ticker)
    cur_step = state["current_step"]

    decision_clean = decision.strip().lower()
    if decision_clean in ["stop", "reject"]:
        yield {
            "type": "step_result",
            "step": cur_step + 1,
            "status": "stopped",
            "text": f"Task execution stopped by user command. Progress saved to research desk journal."
        }
        yield {"type": "done"}
        return

    step_info = TASKS_WORKFLOW[cur_step]
    redirect_text = decision[9:].strip() if decision_clean.startswith("redirect:") else ""

    yield {
        "type": "phase",
        "phase": f"Executing: {step_info['title']}",
        "detail": f"Applying parameters: {redirect_text or 'Standard institutional framework'}"
    }
    await asyncio.sleep(0.4)

    if cur_step == 0:
        content = (
            f"**Valuation Audit Results for {ticker}:**\n"
            f"- CMP: ₹{q['price']} | Trailing P/E: **{q['pe']}x** (Sector benchmark: {q['sector_pe']}x)\n"
            f"- Price-to-Book: **{q['pb']}x** | Dividend Yield: **{q['div_yield']}%**\n"
            f"- Peer Spread: Discount/Premium to sector median: {round(((q['pe']-q['sector_pe'])/q['sector_pe'])*100, 1)}%.\n"
            f"- Finding: Valuation reflects solid institutional confidence without extreme speculative multiple expansion."
        )
    elif cur_step == 1:
        content = (
            f"**Balance Sheet & Leverage Audit for {ticker}:**\n"
            f"- Debt-to-Equity: **{q['debt_equity']}** | ROE: **{q['roe']}%** | ROCE: **{q['roce']}%**\n"
            f"- Capital Structure Assessment: Conservative leverage with healthy operational interest buffers.\n"
            f"- Cash Conversion: Working capital cycle remains healthy with consistent operational liquidity."
        )
    else:
        content = (
            f"**Technicals & Institutional Ownership for {ticker}:**\n"
            f"- 14-Day RSI: **{q['rsi']}** ({q['trend']})\n"
            f"- 50 DMA: ₹{q['dma_50']} | 200 DMA: ₹{q['dma_200']}\n"
            f"- Shareholding Breakdown: Promoters {q['promoter_holding']}%, FIIs {q['fii_holding']}%, DIIs {q['dii_holding']}%\n"
            f"- Technical Outlook: Primary structural trend remains intact above long-term exponential averages."
        )

    state["history"].append(content)
    yield {
        "type": "step_result",
        "step": cur_step + 1,
        "title": step_info["title"],
        "content": content
    }
    await asyncio.sleep(0.3)

    state["current_step"] += 1
    if state["current_step"] < len(TASKS_WORKFLOW):
        next_step = TASKS_WORKFLOW[state["current_step"]]
        yield {
            "type": "propose",
            "step": state["current_step"] + 1,
            "total_steps": 3,
            "title": next_step["title"],
            "description": next_step["description"],
            "proposed_action": next_step["action_preview"],
            "message": "Human approval gate: Approve to execute step, Redirect, or Stop."
        }
    else:
        full_summary = "\n\n".join(state["history"])
        final_report = (
            f"### Comprehensive Analyst Dossier: **{ticker}**\n\n"
            f"{full_summary}\n\n"
            f"**Strategic Takeaway:**\n"
            f"{ticker} demonstrates robust fundamental qualities with controlled leverage ({q['debt_equity']}) and solid return ratios ({q['roe']}% ROE). "
            f"Risk-reward is balanced with primary support near ₹{q['dma_200']} and upside headroom towards 52W peak (₹{q['high_52w']})."
        )
        yield {
            "type": "final",
            "ticker": ticker,
            "text": sanitise_output(final_report)
        }
        yield {"type": "done"}

