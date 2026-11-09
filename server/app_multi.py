"""
FastAPI application for FinIntel Server.
Serves REST and Server-Sent Events (SSE) to the Next.js client.
"""
import os
import json
import time
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Header, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from guardrails import validate_ticker, validate_uuid, validate_text, validate_profile
from market import get_quote, search_symbols, get_global_cues
from groq_pool import groq_pool
from chat_agent import run_chat
from agent_task import start_task, resume_task
from war_room import start_war_room, resume_war_room
from portfolio import get_current_portfolio, set_current_portfolio, parse_holdings_csv, analyze_portfolio_stream, resume_portfolio_stream
from stress import stream_stress_test
from discover import stream_discover
from brief import stream_morning_brief
from ecosystem import stream_ecosystem, stream_report
from quant import compute_backtest, compute_portfolio_metrics
from verdict_log import get_track_record, get_ledger
import auth

app = FastAPI(title="FinIntel Backend Desk", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sse(event: dict) -> str:
    return f"data: {json.dumps(event, default=str)}\n\n"

# In-memory document storage for Q&A
_DOC_STORE = {"filename": None, "content": ""}

@app.get("/api/health")
async def health_check():
    return {
        "ok": True,
        "has_key": groq_pool.has_keys(),
        "groq_keys": groq_pool.get_key_count(),
        "langsmith": os.environ.get("LANGCHAIN_TRACING_V2") == "true",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

@app.get("/api/symbols")
async def symbols_autocomplete(q: str = ""):
    return search_symbols(q)

@app.get("/api/quote/{ticker}")
async def quote_endpoint(ticker: str):
    valid_sym = validate_ticker(ticker)
    return get_quote(valid_sym)

@app.get("/api/chat")
async def chat_endpoint(ticker: str, q: str, thread: str = "", profile: str = "balanced"):
    try:
        sym = validate_ticker(ticker)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    tid = validate_uuid(thread)
    prof = validate_profile(profile)

    async def event_generator():
        try:
            async for evt in run_chat(sym, q, tid, prof):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": f"Agent error: {str(e)}"})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/task/start")
async def task_start_endpoint(ticker: str, task: str = "Full Valuation Review", thread: str = ""):
    try:
        sym = validate_ticker(ticker)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in start_task(sym, task, tid):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/task/step")
async def task_step_endpoint(decision: str, thread: str):
    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in resume_task(tid, decision):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/war/start")
async def war_room_start_endpoint(q: str = "", ticker: str = "RELIANCE", thread: str = ""):
    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in start_war_room(q, ticker, tid):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/war/resume")
async def war_room_resume_endpoint(decision: str, thread: str):
    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in resume_war_room(tid, decision):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/portfolio/analyze")
async def portfolio_analyze_endpoint(profile: str = "balanced", thread: str = ""):
    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in analyze_portfolio_stream(profile, tid):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/portfolio/resume")
async def portfolio_resume_endpoint(decision: str, thread: str):
    tid = validate_uuid(thread)

    async def event_generator():
        try:
            async for evt in resume_portfolio_stream(tid, decision):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/portfolio/stress")
async def portfolio_stress_endpoint(scenario: str = "Crude Surge & Global Inflation", market: float = -10.0, crude: float = 15.0, inr: float = -3.0, rates: float = 50.0, profile: str = "balanced"):
    async def event_generator():
        try:
            async for evt in stream_stress_test(scenario, market, crude, inr, rates, profile):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/discover")
async def discover_endpoint(q: str = "high roe low debt"):
    async def event_generator():
        try:
            async for evt in stream_discover(q):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/brief")
async def brief_endpoint(tickers: str = "RELIANCE,TCS,HDFCBANK,TATAMOTORS"):
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]

    async def event_generator():
        try:
            async for evt in stream_morning_brief(ticker_list):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/ecosystem")
async def ecosystem_endpoint(ticker: str):
    sym = validate_ticker(ticker)

    async def event_generator():
        try:
            async for evt in stream_ecosystem(sym):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/report")
async def report_endpoint(ticker: str):
    sym = validate_ticker(ticker)

    async def event_generator():
        try:
            async for evt in stream_report(sym):
                yield sse(evt)
        except Exception as e:
            yield sse({"type": "error", "text": str(e)})
            yield sse({"type": "done"})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@app.get("/api/backtest")
async def backtest_endpoint(tickers: str = "TCS,RELIANCE", mode: str = "sip", amount: float = 10000.0, years: int = 5):
    t_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    return compute_backtest(t_list, mode=mode, monthly_amount=amount, lumpsum_amount=amount, years=years)

@app.get("/api/track-record")
async def track_record_endpoint():
    return get_track_record()

@app.get("/api/ledger")
async def ledger_endpoint():
    return get_ledger()

class HoldingsPayload(BaseModel):
    holdings: Optional[List[dict]] = None
    csv_text: Optional[str] = None

@app.post("/api/portfolio")
async def update_portfolio_endpoint(payload: HoldingsPayload):
    if payload.csv_text:
        parsed = parse_holdings_csv(payload.csv_text)
        return set_current_portfolio(parsed)
    elif payload.holdings:
        return set_current_portfolio(payload.holdings)
    return compute_portfolio_metrics(get_current_portfolio())

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    content = (await file.read()).decode("utf-8", errors="ignore")
    _DOC_STORE["filename"] = file.filename
    _DOC_STORE["content"] = content
    return {"ok": True, "filename": file.filename, "bytes": len(content)}

@app.delete("/api/upload")
async def clear_document():
    _DOC_STORE["filename"] = None
    _DOC_STORE["content"] = ""
    return {"ok": True}

# Auth endpoints
class AuthRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/signup")
async def auth_signup(body: AuthRequest):
    try:
        return auth.signup(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def auth_login(body: AuthRequest):
    try:
        return auth.login(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/api/me")
async def auth_me(authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "").strip() if authorization else ""
    user = auth.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user

class ProfileUpdate(BaseModel):
    profile: str
    answers: list

@app.put("/api/me/profile")
async def auth_update_profile(body: ProfileUpdate, authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "").strip() if authorization else ""
    user = auth.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return auth.update_user_profile(user["email"], body.profile, body.answers)

