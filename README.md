# FinIntel

**An agentic equity research desk for Indian (NSE) stocks.** Specialised LLM agents work on live market data, pause for human approval before acting, and pass every answer through a compliance pipeline.

> **Not investment advice.** Every generated answer carries a mandatory disclaimer. This project demonstrates agentic architecture; it is not a trading tool.



---

## Table of contents
- [Problem statement](#problem-statement)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Pages and routes](#pages-and-routes)
- [API reference](#api-reference)
- [How the agents work](#how-the-agents-work)
- [Compliance and safety](#compliance-and-safety)
- [Development workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Credits and license](#credits-and-license)

---

## Problem statement

Retail investors in Indian equities must stitch together scattered data, news and analysis by hand. FinIntel is an agentic AI desk where specialised LLM agents research NSE stocks on live data, with human approval at each decision and compliance guardrails on every answer.

## Features

| Tab | What it does |
|---|---|
| **Analyst** | Pick a stock and a task. The agent proposes one step at a time; you Approve, Redirect or Stop. |
| **Chat** | A ReAct agent with 31 tools. It answers instantly, self-reviews its draft, and screens every reply. Supports PDF/Word Q&A. |
| **Brief** | A morning brief from your watchlist, global cues (US, Asia, USD/INR, Brent, Gold) and Indian indices. |
| **Discover** | Plain-English stock screens, parsed into validated filters and swept over a curated NSE universe. |
| **Portfolio** | Paste holdings or upload a broker CSV. Parallel per-stock audit, rebalance approval gate, stress test, paper-trading ledger. |
| **War Room** | A Chief Analyst plans, specialists run in parallel, a Bull and a Bear argue, and a Judge rules with your sign-off. |
| **Ecosystem** | Competitors, customers, suppliers and partners, with competitors priced live. |
| **Report** | One click runs every engine and produces a single research note. |
| **Backtest** | Lumpsum vs SIP vs NIFTY 50, with dividends, brokerage, step-up SIPs, XIRR, CAGR and drawdown. |

Also included: email/password accounts, a five-question **risk profile** that every agent judges its answers against, and a track record that re-scores every approved verdict.

## Tech stack

**Client** (`client/`)
- Next.js (App Router), TypeScript
- Tailwind CSS, shadcn/ui
- react-hook-form + zod for forms
- recharts for charts

**Server** (`server/`)
- Python 3.11+, FastAPI, Uvicorn
- LangGraph (checkpointed `StateGraph`, `interrupt()` approval gates)
- LangChain (`langchain-core`, `langchain-groq`)
- Groq LLMs with multi-key failover
- yfinance, Screener.in and NSE data, with offline sample-data fallback
- Optional Supabase for persistent accounts

## Architecture

```
            Next.js client (App Router, shadcn, Tailwind)
                          │  fetch + Server-Sent Events
                          ▼
              FastAPI  (rate-limited, guarded)
  ┌──────────┬──────────┬──────────┬──────────┬──────────┐
 chat       task       war_room   portfolio  discover / brief /
 (ReAct)    agent      (graph)    (graph)    report / backtest /
            (graph)                          ecosystem / stress
  └──────────┴──────────┴──────────┴──────────┴──────────┘
                          │
        market.py · quant.py · screener.py · nse.py
        (cached, with sample-data fallback)
                          │
        guardrails · groq_pool · llm_cache · session_registry · auth
```

Key ideas:
- **Streaming:** every agent endpoint streams events as `data: {json}\n\n` and ends with `{"type":"done"}`.
- **Human-in-the-loop:** gates use LangGraph's native `interrupt()`. The graph checkpoints and the stream ends at a `propose` or `approval_request` event. The client resumes with the same `thread` UUID on the matching resume endpoint.
- **Deterministic maths:** volatility, Sharpe, beta, RSI, drawdown, stress shocks and backtest CAGR/XIRR are all computed in Python. The LLM only interprets and narrates.
- **Honest data labelling:** live vs sample data is always labelled; sample data is never silently presented as live.

## Project structure

```
.
├── client/                  # Next.js app
│   ├── app/
│   │   ├── (marketing)/     # landing page
│   │   ├── (auth)/          # login, register
│   │   ├── (app)/app/       # main agent workspace
│   │   └── api/auth/        # route handlers that proxy auth to FastAPI
│   ├── components/
│   │   ├── ui/              # shadcn primitives
│   │   ├── agents/          # one component per tab
│   │   └── shared/          # ApprovalGate, Timeline, PriceChart, TickerSearch
│   ├── lib/                 # api.ts, auth.ts, useEventStream.ts
│   └── middleware.ts        # protects /app
├── server/                  # FastAPI + agents
│   ├── app_multi.py         # endpoints
│   ├── chat_agent.py        # ReAct chat, 31 tools
│   ├── agent_task.py        # step-by-step task agent
│   ├── agent_multi.py       # multi-agent desk
│   ├── war_room.py          # orchestrated debate
│   ├── portfolio.py  stress.py  discover.py  brief.py
│   ├── report.py  ecosystem.py  backtest.py  verdict_log.py
│   ├── market.py  quant.py  screener.py  nse.py
│   ├── guardrails.py  groq_pool.py  llm_cache.py
│   ├── session_registry.py  auth.py  rate_limiter.py
│   └── requirements.txt
├── AGENTS.md                # rules for AI coding agents
├── client/PAGES.md          # page specs
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites
- Node.js 20+
- Python 3.11+
- A [Groq API key](https://console.groq.com) (free tier works)

### 1. Clone
```bash
git clone <your-repo-url>
cd <your-repo>
```

### 2. Server
```bash
cd server
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then add your keys
uvicorn app_multi:app --reload --port 8000
```
Check it: <http://localhost:8000/api/health> should return `{"ok": true, ...}`.

### 3. Client
```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```
Open <http://localhost:3000>.

## Environment variables

**`server/.env`**

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq key(s). Comma-separate several for automatic failover. |
| `AUTH_SECRET` | Yes | Long random string. Keeps sign-ins valid across restarts. |
| `SUPABASE_URL` | No | Persist accounts across redeploys. |
| `SUPABASE_SERVICE_KEY` | No | Service-role key (never the anon key). Falls back to a local `users.json`. |
| `LANGCHAIN_TRACING_V2` | No | Set `true` for LangSmith tracing. |

**`client/.env.local`**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE` | FastAPI URL, e.g. `http://localhost:8000` |

Never commit `.env` files. Commit only `.env.example` files with placeholder values.

## Pages and routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Sign in | Public only |
| `/register` | Create account | Public only |
| `/app` | Agent workspace (all tabs plus chat panel) | Signed-in only |

Auth tokens live in an httpOnly cookie set by Next.js route handlers, never in localStorage. See `client/PAGES.md` for the full page specs.

## API reference

All agent endpoints are `GET` and stream SSE. Every request needs a UUID `thread`.

| Endpoint | Purpose |
|---|---|
| `GET /api/task/start`, `/api/task/step` | Analyst task agent (start, then approve/redirect/stop) |
| `GET /api/chat` | ReAct chat (a `ticker` is required) |
| `POST /api/upload`, `DELETE /api/upload` | Attach or clear a document for chat Q&A |
| `GET /api/analyze`, `/api/resume` | Multi-agent desk with approval gate |
| `GET /api/war/start`, `/api/war/resume` | War Room |
| `POST /api/portfolio` | Load holdings (CSV file or pasted text) |
| `GET /api/portfolio/analyze`, `/resume`, `/stress` | Audit, rebalance gate, stress test |
| `GET /api/discover` | Natural-language screener |
| `GET /api/brief` | Morning brief |
| `GET /api/ecosystem` | Company ecosystem map |
| `GET /api/report` | Full research report |
| `GET /api/backtest` | Lumpsum / SIP backtest |
| `GET /api/track-record`, `/api/ledger` | Verdict scoring and paper-trading ledger |
| `GET /api/symbols?q=` | Ticker/company autocomplete |
| `POST /api/auth/signup`, `/api/auth/login` | Accounts |
| `GET /api/me`, `PUT /api/me/profile` | Current user and risk profile |
| `GET /api/health` | Health check |

### Event stream format
```
data: {"type": "propose", "tool": "valuation", "summary": "..."}

data: {"type": "done"}
```
Common event types: `intro`, `step_result`, `chart`, `propose`, `approval_request`, `final`, `error`, `done`.

### Approval flow
1. Client starts a run with a new `thread` UUID.
2. The stream ends at `propose` or `approval_request`.
3. The user chooses Approve, Reject, or sends feedback.
4. Client calls the resume endpoint with the **same** `thread` and a `decision`.
5. The checkpointed graph resumes and streams the rest.

## How the agents work

- **Task agent** proposes one step at a time and waits for your decision.
- **Chat agent** is a ReAct loop over 31 tools. It self-reviews its draft, then runs the compliance pipeline.
- **Desk** runs researcher, risk check, synthesis and reflection, then pauses at a gate before finalising.
- **War Room**: Chief Analyst plans, specialists (quant, fundamental, news, risk) run in parallel, Bull and Bear argue, and a Judge rules.
- **Portfolio auditor** analyses holdings in parallel, flags portfolio-level risk, and proposes a rebalance behind a gate.

## Compliance and safety

Every LLM output goes through this pipeline:
1. Forbidden-phrase neutralisation
2. Semantic LLM screen
3. Grounded rewrite (never invents facts; deletes what it can't fix)
4. PII scrub
5. Mandatory SEBI-style disclaimer

Also in place: input validation, a prompt-injection screen, rate limiting, request IDs, and bounded per-thread session eviction. The Groq key stays server-side; the browser never calls Groq directly.

## Development workflow

- Build one page or feature at a time; commit after each working step.
- Keep the API contract stable between `client/` and `server/`.
- Add shadcn components with `npx shadcn@latest add <component>`.
- Run `npm run lint` and `npm run build` before pushing.
- If you use an AI coding agent, point it at `AGENTS.md` and `client/PAGES.md`.

## Testing

```bash
# server
cd server && pytest                 # mock yfinance and Groq

# client
cd client && npm run lint && npm run build
```

Minimum end-to-end checks:
- Register, then land on `/app`
- Run an agent, see it stream, pause at the gate, resume, and finish
- Signed-out visit to `/app` redirects to `/login`
- Chat is disabled until a ticker is chosen

## Deployment

| Piece | Suggested host | Notes |
|---|---|---|
| `client/` | Vercel | Set root directory to `client`; add `NEXT_PUBLIC_API_BASE` before the first build (it's baked in at build time). |
| `server/` | Render, Railway or Fly.io | Needs one always-on Python process (in-memory approval state and SSE). Set the env vars above. |

Notes:
- Free tiers may sleep when idle, so the first request can take 30-60 seconds.
- Run a single backend instance: approval state is held in memory and checkpoints are per-process.
- Set `AUTH_SECRET` in production, or sign-ins reset on every restart.
- Use Supabase for accounts in production; the local `users.json` is wiped on redeploy.

## Troubleshooting

| Problem | Fix |
|---|---|
| Stream drops immediately | Check the backend is running and `NEXT_PUBLIC_API_BASE` is correct. |
| Chat returns 422 | A ticker must be selected first. |
| "Sample data" badge everywhere | Live feeds (Yahoo, Screener, NSE) are unreachable; check your network. |
| Agents error with a connection message | Check `GROQ_API_KEY` is set and valid (`/api/health` shows `has_key`). |
| "Session expired" on resume | The server restarted or evicted the thread; start the run again. |
| CORS errors | Allow your client origin in the FastAPI CORS config. |
| Signed out after every restart | Set a fixed `AUTH_SECRET`. |

## Roadmap

- [ ] Landing, login and registration pages
- [ ] Main workspace shell with tabs and chat panel
- [ ] Shared SSE hook and approval gate component
- [ ] All eight agent tabs
- [ ] Risk profile dialog
- [ ] Tests and CI
- [ ] Production deployment

## Credits and license

- Agent backend and original concept: [vj0246/FinIntel](https://github.com/vj0246/FinIntel). Check that repo's licence terms before redistributing, since it didn't show a licence file when I looked.
- Data from Yahoo Finance (via yfinance), Screener.in and NSE India, subject to their terms of use.

Choose a licence for your own code (MIT is common) and add a `LICENSE` file.
