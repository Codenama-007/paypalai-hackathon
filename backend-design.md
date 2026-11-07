# Backend Design Spec: FinIntel Server

FastAPI + LangGraph + LangChain. One always-on Python process that serves REST and Server-Sent Events (SSE) to the Next.js client.
Build in this order: core (config, guardrails, rate limiting), data layer, auth, one agent at a time, then the report/orchestration engines.

## Goals
- Stream every agent run live to the client
- Pause for human approval using LangGraph `interrupt()`, never hand-rolled state
- Compute all numbers in Python; the LLM only interprets and narrates
- Screen every LLM output for compliance before it reaches the user
- Degrade gracefully: live data falls back to sample data, and the UI is told which one it got

## Folder layout
server/
  app_multi.py            FastAPI app: routes, middleware, SSE helper
  config.py               env loading and settings (optional split from app)
  guardrails.py           validation, prompt-injection screen, compliance pipeline
  rate_limiter.py         per-tier sliding-window limits (middleware)
  auth.py                 signup/login, PBKDF2 hashing, signed tokens, user store
  groq_pool.py            Groq key pool with per-key failover
  llm_cache.py            TTL cache for repeat-invariant LLM calls
  session_registry.py     bounded eviction of per-thread in-memory state
  graph_stream.py         bridges LangGraph sync stream into async SSE
  market.py  quant.py  screener.py  nse.py  companies.py  seed_data.py   (data layer)
  chat_agent.py  agent_task.py  agent_multi.py  war_room.py  portfolio.py  (agents)
  discover.py  brief.py  report.py  ecosystem.py  backtest.py  stress.py  verdict_log.py  docstore.py
  requirements.txt  .env.example  tests/

## Core rules
1. Endpoints are `async`; blocking work (yfinance, scraping, file IO) runs in `asyncio.to_thread`
2. Request validation happens first: `validate_ticker`, `validate_uuid`, `validate_text`, `validate_profile`
3. Bad input raises `HTTPException(422)` before any agent starts
4. Agents are LangGraph graphs with a checkpointer; the thread id is the UUID sent by the client
5. No arithmetic in prompts: compute metrics in Python, pass results to the LLM as text
6. Nothing user-facing leaves the server without `sanitise_output` and the disclaimer
7. Secrets only from environment variables; never log keys, tokens or passwords

## SSE contract
Helper: `sse(event) -> "data: " + json.dumps(event, default=str) + "\n\n"`
Response: `StreamingResponse(..., media_type="text/event-stream")` with headers
`Cache-Control: no-cache` and `X-Accel-Buffering: no`.

Every stream:
- emits zero or more events, each a JSON object with a `type` field
- catches exceptions and emits `{"type": "error", "text": "..."}` instead of crashing
- always ends with `{"type": "done"}`

Event types in use: `intro`, `phase`, `step_result`, `agent`, `specialist`, `debate`, `verdict`, `plan`,
`chart`, `holding`, `portfolio`, `shock`, `impact`, `narrative`, `progress`, `results`, `commentary`,
`markets`, `stock`, `brief`, `profile`, `map`, `peer`, `summary`, `result`, `warn`, `tool_call`,
`tool_result`, `answer`, `propose`, `approval_request`, `final`, `error`, `done`.

## Human-in-the-loop pattern
- Each interactive agent is one compiled `StateGraph` with a checkpointer (`MemorySaver`)
- The approval node calls `interrupt(payload)`; the graph pauses and checkpoints
- The start endpoint streams until the interrupt, emits `propose` or `approval_request`, then the stream ends
- The resume endpoint runs `graph.astream(Command(resume=decision), config={"configurable": {"thread_id": tid}})`
- Before resuming, check there is a pending interrupt; otherwise emit "Session expired. Run it again."
- Decisions are free text: `approve`, `reject`, `stop`, `redirect:<text>`, or feedback to revise
- Hard timeout per run (120 s); emit an error event on timeout
- Register every thread in `session_registry.touch(thread_id)` so old state is evicted

## Endpoints
Agent streams (all GET, all need a `thread` UUID):
| Endpoint | Params | Notes |
|---|---|---|
| `/api/task/start` | ticker, task | step-by-step task agent; ends at `propose` |
| `/api/task/step` | decision | approve / stop / redirect:text |
| `/api/chat` | ticker, q, profile? | ReAct agent; ticker is required (422 if empty); injection check first |
| `/api/analyze` | ticker | multi-agent desk, ends at `approval_request` |
| `/api/resume` | decision | resumes the desk |
| `/api/war/start` | q, ticker? | planner, specialists, bull/bear, judge |
| `/api/war/resume` | decision | approve logs the call to the verdict log |
| `/api/portfolio/analyze` | profile? | parallel per-stock audit, ends at rebalance gate |
| `/api/portfolio/resume` | decision | |
| `/api/portfolio/stress` | scenario, market, crude, inr, rates, profile? | deterministic factor model, then narrative |
| `/api/discover` | q | NL query to validated filters to universe sweep |
| `/api/brief` | tickers (max 8) | markets, per-stock cues, brief text |
| `/api/ecosystem` | ticker | relationship map plus live-priced peers |
| `/api/report` | ticker | orchestrates every engine |
| `/api/backtest` | tickers, mode, amounts, window | all numbers computed in Python |

REST:
| Endpoint | Purpose |
|---|---|
| `POST /api/portfolio` | load holdings from a CSV file (max 1 MB) or pasted text |
| `POST /api/upload`, `DELETE /api/upload` | attach or clear a PDF/Word/text document (max 15 MB) |
| `GET /api/track-record`, `GET /api/ledger` | re-score logged verdicts; paper-trading ledger |
| `GET /api/symbols?q=` | ticker/company autocomplete (cacheable) |
| `POST /api/auth/signup`, `POST /api/auth/login` | returns `{token, email, profile, answers}` |
| `GET /api/me`, `PUT /api/me/profile` | Bearer token required |
| `GET /api/health` | `{ok, has_key, groq_keys, langsmith}` |

## Agents
- **Task agent** (`agent_task.py`): propose one tool call, gate, run it, repeat; `finish` produces the final report
- **Chat agent** (`chat_agent.py`): ReAct over about 31 tools (quote, fundamentals, valuation, technicals, news, ratings, results, balance sheet, cash flow, shareholding, quant metrics, competitors, ecosystem, document Q&A, desk analysis). Flow: tools, draft, self-review, compliance check, answer
- **Desk** (`agent_multi.py`): gather, researcher, risk check, synthesise, reflect, gate, finalise
- **War Room** (`war_room.py`): planner picks tickers and specialists (quant, fundamental, news, risk); they run in parallel; bull and bear argue; judge rules with a confidence score; gate; log the verdict
- **Portfolio** (`portfolio.py`): parse holdings, price in parallel, compute weights and concentration, risk officer, rebalance gate

Each agent module exports `start(...)` and `resume(...)` async generators that yield event dicts.

## Guardrails (`guardrails.py`)
- `validate_ticker`: 1-20 chars, uppercase letters, digits and `&`; strips `.NS` and `.BO`
- `validate_uuid`, `validate_text(max_len)`, `validate_file_extension`, `validate_profile` (whitelist: conservative, balanced, aggressive)
- `check_prompt_injection(text)`: block and return a refusal instead of calling the LLM
- Output pipeline `sanitise_output`:
  1. neutralise forbidden phrases (deterministic)
  2. semantic LLM compliance screen
  3. grounded rewrite (keep facts, never invent; delete what can't be fixed)
  4. PII scrub
  5. `append_disclaimer`
- Fallback to deterministic neutralisation if the LLM is unavailable

## Data layer
- `market.py`: yfinance quote, fundamentals, financials; cached with market-hours-aware TTL (short while open, long after close)
- `screener.py`: Screener.in consolidated ratios, quarterly, annual, shareholding
- `nse.py`: sector P/E, 52-week range (best effort)
- `quant.py`: volatility, Sharpe, beta vs NIFTY, RSI, SMA, drawdown from real prices
- `seed_data.py`: offline sample data for common tickers
- Every payload carries `source: "live" | "sample"`; the client must show it
- Never present sample data as live

## LLM access
- `groq_pool.py`: `GROQ_API_KEY` is comma-separated; rotate to the next key on rate-limit or auth errors
- Use `langchain-groq` chat models inside LangGraph nodes
- `llm_cache.py`: TTL cache for calls whose output does not depend on the user (compliance screen, ecosystem map, beta)
- Optional LangSmith tracing via `LANGCHAIN_TRACING_V2`

## Auth
- Passwords hashed with PBKDF2 (per-user salt); always run the hash compare, even for unknown emails (timing safety)
- Tokens are signed with `AUTH_SECRET`; `user_from_header` accepts `Authorization: Bearer <token>`
- Store users in Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set, else a local `users.json`
- Email validated by regex; password minimum 8 characters
- Signup errors return 400; login errors return 401 with one generic message
- The Next.js route handlers keep the token in an httpOnly cookie and add the Bearer header when proxying

## Middleware and cross-cutting
- Rate limiting (applied before CORS): global limit plus per-tier limits (agent runs, uploads, auth); deliberately light, to stop hammering only; trust the last proxy hop for client IP
- CORS: allow only the client origin(s) from an env var in production (not `*`)
- Request ID middleware: pass through `X-Request-ID` or generate one; return it on every response
- Cache headers on static-ish endpoints (`/api/symbols`)

## Verdict log and track record
- Every approved BUY/SELL/HOLD from the War Room, desk or report is appended to `verdict_log`
- `track_record()` re-prices each call: BUY needs more than +2%, SELL less than -2%, HOLD within ±5%; calls under 2 days old are not scored
- `ledger()`: each BUY/SELL is a virtual ₹1,00,000 position, marked to market, with alpha vs NIFTY; HOLD is not traded

## Configuration (`server/.env`)
GROQ_API_KEY=gsk_xxx[,gsk_yyy]
AUTH_SECRET=<long random string>
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=            # optional
SUPABASE_SERVICE_KEY=    # optional, service-role key only
LANGCHAIN_TRACING_V2=false

## Error handling
- Bad input: `HTTPException(422, detail="...")` with a human-readable message
- Auth: 400 (signup), 401 (login or token)
- Rate limit: 429 with `Retry-After`
- Inside streams: never raise; emit `{"type":"error","text":...}` then `done`
- Never return stack traces or key material to the client

## Constraints
- Run a single process: checkpoints and session state are in memory
- Bounded memory: evict idle threads through `session_registry`
- Upload limits: 15 MB documents, 1 MB holdings CSV
- Allowed upload types: pdf, docx, txt, md, csv

## Testing
- Unit: guardrails (validators, injection cases, forbidden phrases), quant maths, backtest XIRR/CAGR, stress shocks, holdings parser
- Mock yfinance, Screener, NSE and Groq; no network in tests
- Flow tests with `httpx` or `TestClient`: start, pause at gate, resume with the same thread, final, done
- Contract test: every stream ends with `done`, and errors become `error` events
- Auth tests: duplicate email, short password, wrong password, expired token

## Acceptance criteria
- [ ] `GET /api/health` reports key count and status
- [ ] Each agent streams events and ends with `done`
- [ ] Approval gates pause and resume correctly with the same thread UUID
- [ ] Resuming an unknown or evicted thread returns a clear "session expired" event
- [ ] No LLM text reaches the client without the compliance pipeline and disclaimer
- [ ] Invalid tickers, UUIDs and oversized files are rejected with 422/400
- [ ] Sample data is always labelled `source: "sample"`
- [ ] Keys, tokens and passwords never appear in logs or responses
- [ ] Runs with sample data when Yahoo, Screener or NSE are unreachable