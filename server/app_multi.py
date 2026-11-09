"""
Main FastAPI server for FinIntel.
Serves REST and Server-Sent Events (SSE) to the Next.js client.
Connected to Neon PostgreSQL for user auth, verdict logs, and paper-trading ledger.
"""
import os
import uuid
import json
from typing import Optional, List
from fastapi import FastAPI, Request, Response, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Database and infrastructure
from database import init_db, test_connection, get_db, get_db_session, User
from auth import signup, login, get_current_user
from groq_pool import groq_pool
from graph_stream import sse_event, sse_done, sse_error
from session_registry import session_registry
from rate_limiter import RateLimiterMiddleware
from seed_data import search_sample_symbols

# Agents and Engines
from agent_task import start_task, step_task
from chat_agent import stream_chat
from war_room import start_war_room, resume_war_room
from portfolio import stream_portfolio_audit, resume_portfolio, parse_holdings_text
from discover import run_discover_screen
from brief import generate_morning_brief
from stress import run_portfolio_stress_test
from backtest import run_strategy_backtest
from ecosystem import get_ecosystem_map
from report import generate_research_report
from verdict_log import get_track_record, get_ledger
from docstore import extract_text_from_bytes, store_document, clear_document

load_dotenv()

app = FastAPI(
    title="FinIntel Equity Research Desk API",
    version="1.0.0",
    description="Agentic equity research desk for Indian (NSE) stocks with Neon PostgreSQL persistence."
)

# Initialize database
init_db()

# Rate limiting & CORS middleware
app.add_middleware(RateLimiterMiddleware)

origins = [
    os.getenv("CLIENT_ORIGIN", "http://localhost:3000"),
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    response = await call_next(request)
    response.headers["X-Request-ID"] = req_id
    return response


# -------------------------------------------------------------
# Health and System Endpoints
# -------------------------------------------------------------
@app.get("/api/health")
def health():
    db_status = test_connection()
    return {
        "ok": True,
        "has_key": groq_pool.has_keys,
        "groq_keys": groq_pool.key_count,
        "database": db_status.get("status", "error"),
        "database_info": db_status
    }


@app.get("/api/symbols")
def search_symbols(q: str = Query("", min_length=1)):
    return search_sample_symbols(q)


# -------------------------------------------------------------
# Authentication Endpoints (Neon PostgreSQL)
# -------------------------------------------------------------
class AuthRequest(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    profile: str
    answers: Optional[List[int]] = None


@app.post("/api/auth/signup")
def handle_signup(req: AuthRequest):
    return signup(req.email, req.password)


@app.post("/api/auth/login")
def handle_login(req: AuthRequest):
    return login(req.email, req.password)


@app.get("/api/me")
def handle_get_me(user=Depends(get_current_user)):
    return user


@app.put("/api/me/profile")
def handle_update_profile(req: ProfileUpdate, user=Depends(get_current_user)):
    db = get_db_session()
    try:
        db_user = db.query(User).filter(User.id == user["id"]).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        db_user.risk_profile = req.profile
        if req.answers is not None:
            db_user.risk_answers = json.dumps(req.answers)
        db.commit()
        return {"status": "updated", "profile": db_user.risk_profile}
    finally:
        db.close()


# -------------------------------------------------------------
# Task Agent Endpoints (SSE)
# -------------------------------------------------------------
@app.get("/api/task/start")
async def api_task_start(ticker: str, task: str, thread: str):
    async def event_generator():
        try:
            async for event in start_task(thread, ticker, task):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/task/step")
async def api_task_step(decision: str, thread: str):
    async def event_generator():
        try:
            async for event in step_task(thread, decision):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# -------------------------------------------------------------
# Chat Agent Endpoint (SSE)
# -------------------------------------------------------------
@app.get("/api/chat")
async def api_chat(ticker: str, q: str, thread: str, doc_id: Optional[str] = None, profile: str = "balanced"):
    if not ticker:
        raise HTTPException(status_code=422, detail="Ticker is required for chat analysis.")

    async def event_generator():
        try:
            async for event in stream_chat(ticker, q, thread, doc_id=doc_id, profile=profile):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# -------------------------------------------------------------
# Document Upload for Chat Q&A
# -------------------------------------------------------------
@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 15 MB limit.")
    try:
        text = extract_text_from_bytes(file.filename, content)
        doc_id = str(uuid.uuid4())
        store_document(doc_id, text)
        return {"doc_id": doc_id, "filename": file.filename, "chars": len(text)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/upload")
def api_clear_upload(doc_id: str):
    clear_document(doc_id)
    return {"status": "cleared", "doc_id": doc_id}


# -------------------------------------------------------------
# War Room Endpoints (SSE)
# -------------------------------------------------------------
@app.get("/api/war/start")
async def api_war_start(ticker: str, thread: str, topic: Optional[str] = None):
    async def event_generator():
        try:
            async for event in start_war_room(thread, ticker, topic):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/war/resume")
async def api_war_resume(decision: str, thread: str):
    async def event_generator():
        try:
            async for event in resume_war_room(thread, decision):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# -------------------------------------------------------------
# Portfolio & Stress Lab Endpoints
# -------------------------------------------------------------
@app.post("/api/portfolio")
async def api_portfolio_upload(text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    raw_text = ""
    if file:
        content = await file.read()
        raw_text = content.decode("utf-8", errors="ignore")
    elif text:
        raw_text = text
    else:
        raise HTTPException(status_code=400, detail="Provide either CSV file or text holdings.")

    holdings = parse_holdings_text(raw_text)
    return {"holdings": holdings, "count": len(holdings)}


@app.get("/api/portfolio/analyze")
async def api_portfolio_analyze(thread: str, holdings_json: str):
    try:
        holdings = json.loads(holdings_json)
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid holdings format.")

    async def event_generator():
        try:
            async for event in stream_portfolio_audit(thread, holdings):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/portfolio/resume")
async def api_portfolio_resume(decision: str, thread: str):
    async def event_generator():
        try:
            async for event in resume_portfolio(thread, decision):
                yield sse_event(event)
        except Exception as e:
            yield sse_error(str(e))
            yield sse_done()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/portfolio/stress")
def api_portfolio_stress(holdings_json: str, crude: float = 0.0, inr: float = 0.0, rates: float = 0.0):
    try:
        holdings = json.loads(holdings_json)
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid holdings JSON.")
    return run_portfolio_stress_test(holdings, crude_shock_pct=crude, inr_depreciation_pct=inr, rate_hike_bps=rates)


# -------------------------------------------------------------
# Analysis Engines (Discover, Brief, Ecosystem, Backtest, Report)
# -------------------------------------------------------------
@app.get("/api/discover")
def api_discover(q: str):
    return run_discover_screen(q)


@app.get("/api/brief")
def api_brief(tickers: Optional[str] = None, profile: str = "balanced"):
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()] if tickers else None
    return generate_morning_brief(tickers=ticker_list, profile=profile)


@app.get("/api/ecosystem")
def api_ecosystem(ticker: str):
    return get_ecosystem_map(ticker)


@app.get("/api/backtest")
def api_backtest(ticker: str, mode: str = "sip", amount: float = 10000.0, years: int = 3):
    return run_strategy_backtest(ticker, mode=mode, monthly_amount=amount, years=years)


@app.get("/api/report")
def api_report(ticker: str):
    return generate_research_report(ticker)


@app.get("/api/track-record")
def api_track_record():
    return get_track_record()


@app.get("/api/ledger")
def api_ledger():
    return get_ledger()
