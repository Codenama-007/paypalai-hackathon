# Project: FinIntel

Agentic equity research desk for Indian (NSE) stocks. Specialised LLM agents work on live market data, pause for human approval, and pass every output through a compliance pipeline.

## Tech stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Python 3.11, FastAPI, Uvicorn
- Agents: LangGraph (StateGraph + checkpointing), LangChain (langchain-core, langchain-groq)
- LLM: Groq (multi-key failover via `groq_pool.py`)
- Data: yfinance, Screener.in scrape, NSE; `seed_data.py` is the offline fallback

## Commands
- `cd backend && uvicorn app_multi:app --reload --port 8000` - Start API
- `cd backend && pip install -r requirements.txt` - Install backend deps
- `cd frontend && npm run dev` - Start Next.js (port 3000)
- `cd frontend && npm run build` - Production build
- `cd frontend && npm run lint` - ESLint check
- `cd frontend && npx shadcn@latest add <component>` - Add a UI component
- `curl localhost:8000/api/health` - Backend health check

## Environment
- `backend/.env`: `GROQ_API_KEY` (comma-separate for failover), `AUTH_SECRET`
- Optional: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `LANGCHAIN_TRACING_V2`
- `frontend/.env.local`: `NEXT_PUBLIC_API_BASE=http://localhost:8000`
- Never commit `.env` files or API keys

## Architecture
- `backend/app_multi.py`: all REST and SSE endpoints, rate-limited and guarded
- Agent modules: `chat_agent.py` (ReAct, 31 tools), `agent_task.py`, `agent_multi.py`, `war_room.py`, `portfolio.py`
- Engines: `discover.py`, `brief.py`, `report.py`, `ecosystem.py`, `backtest.py`, `stress.py`
- `guardrails.py`: input validation, prompt-injection screen, compliance pipeline
- `market.py`, `quant.py`, `screener.py`, `nse.py`: data and metrics layer
- Frontend: one route or component per tab, with shared SSE hooks in `frontend/lib/`

## Streaming and human-in-the-loop
- Every agent endpoint streams Server-Sent Events as `data: {json}\n\n`, with a `type` field
- A stream always ends with `{"type": "done"}`
- Approval gates use LangGraph `interrupt()`, so the stream ends at `propose` or `approval_request`
- Resume with the SAME `thread` UUID on the matching resume endpoint (`Command(resume=...)`)
- Every request needs a UUID `thread`, and the frontend generates it with `crypto.randomUUID()`
- Never hand-roll pending-request dicts; use LangGraph checkpointing

## Conventions
- Python: type hints, async endpoints, `pydantic` for request bodies
- TypeScript: strict mode, named exports, no `any`
- Use shadcn primitives and Tailwind utilities, with no custom CSS files
- Components are server components unless they need state or SSE (`"use client"`)
- Use `fetch` with a stream reader for SSE; close the stream on `done`
- Validate with `guardrails.validate_ticker` and `validate_uuid` before running any agent
- Backend errors use `HTTPException` (422 for bad input); stream errors emit `{"type": "error"}`

## Rules (important)
- All arithmetic (volatility, Sharpe, beta, XIRR, stress shocks) is computed in Python; the LLM only narrates
- Every LLM answer must go through the compliance pipeline and end with the SEBI-style disclaimer
- Never present sample data as live; always surface the `source` field in the UI
- Do not give buy/sell advice outside the approval-gated flows
- Keep the Groq key server-side; the browser never calls Groq directly
- Chat requires a ticker; the backend returns 422 without one

## Testing
- Backend: `pytest` for engines and guardrails (mock yfinance and Groq)
- Frontend: smoke-test each tab against mocked SSE streams
- Test approval flows end to end: start, pause, resume, final