"""
Pydantic schemas for request validation and response serialization.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


# -------------------------------------------------------------
# User & Auth Schemas
# -------------------------------------------------------------
class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Minimum 8 characters")


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    risk_profile: str
    risk_answers: List[Any] = []
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    token: str
    email: str
    profile: str
    answers: List[Any] = []


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None


class RiskProfileUpdate(BaseModel):
    profile: str = Field(..., pattern="^(conservative|balanced|aggressive)$")
    answers: Optional[List[int]] = None


# -------------------------------------------------------------
# Verdict Schemas
# -------------------------------------------------------------
class VerdictBase(BaseModel):
    ticker: str
    verdict: str = Field(..., pattern="^(BUY|SELL|HOLD)$")
    confidence: float
    rationale: Optional[str] = None
    price_at_verdict: float


class VerdictCreate(VerdictBase):
    user_id: Optional[str] = None


class VerdictResponse(VerdictBase):
    id: str
    user_id: Optional[str] = None
    current_price: Optional[float] = None
    alpha: Optional[float] = None
    status: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Portfolio Schemas
# -------------------------------------------------------------
class HoldingItem(BaseModel):
    ticker: str
    shares: float
    price: float
    value: float
    sector: Optional[str] = "Other"


class PortfolioBase(BaseModel):
    name: str = "Primary Portfolio"
    holdings: List[HoldingItem] = []
    total_value: float = 0.0


class PortfolioCreate(PortfolioBase):
    user_id: str


class PortfolioResponse(PortfolioBase):
    id: str
    user_id: str
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Ledger Schemas
# -------------------------------------------------------------
class LedgerBase(BaseModel):
    ticker: str
    action: str = Field(..., pattern="^(BUY|SELL)$")
    shares: float
    entry_price: float
    allocated_capital: float = 100000.0


class LedgerResponse(LedgerBase):
    id: str
    user_id: str
    mark_to_market: Optional[float] = None
    alpha_vs_nifty: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# System & Health Schemas
# -------------------------------------------------------------
class HealthResponse(BaseModel):
    ok: bool
    database: str
    database_info: Dict[str, Any]
