"""
Main entry point for starting the FinIntel FastAPI Backend Server.
"""
import os
import json
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db, test_connection, get_db_session, User
from auth import signup, login, get_current_user
from schemas import UserCreate, UserLogin, UserResponse, Token, RiskProfileUpdate, HealthResponse

load_dotenv()

app = FastAPI(
    title="FinIntel Equity Research API",
    version="1.0.0",
    description="Backend API connected to Neon PostgreSQL."
)

# Initialize database tables on startup
init_db()

# CORS configuration
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


@app.get("/api/health", response_model=HealthResponse)
def health():
    db_status = test_connection()
    return {
        "ok": True,
        "database": db_status.get("status", "error"),
        "database_info": db_status
    }


@app.post("/api/auth/signup", response_model=Token)
def handle_signup(req: UserCreate):
    return signup(req.email, req.password)


@app.post("/api/auth/login", response_model=Token)
def handle_login(req: UserLogin):
    return login(req.email, req.password)


@app.get("/api/me")
def handle_get_me(user=Depends(get_current_user)):
    return user


@app.put("/api/me/profile")
def handle_update_profile(req: RiskProfileUpdate, user=Depends(get_current_user)):
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
