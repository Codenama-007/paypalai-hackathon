"""
Authentication service connecting to Neon PostgreSQL.
Uses PBKDF2-HMAC-SHA256 with per-user salt and HMAC-SHA256 signed session tokens.
"""
import os
import hmac
import hashlib
import base64
import json
import uuid
import datetime
from typing import Optional, Dict, Any, Tuple
from fastapi import HTTPException, Header
from dotenv import load_dotenv
from database import get_db_session, User

load_dotenv()

AUTH_SECRET = os.getenv("AUTH_SECRET", "default_finintel_secret_key_change_in_prod")


def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    if not salt:
        salt = base64.b64encode(os.urandom(16)).decode("utf-8")
    pwd_bytes = password.encode("utf-8")
    salt_bytes = salt.encode("utf-8")
    key = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, 100000)
    hash_str = base64.b64encode(key).decode("utf-8")
    return hash_str, salt


def verify_password(password: str, hash_str: str, salt: str) -> bool:
    expected_hash, _ = hash_password(password, salt)
    return hmac.compare_digest(expected_hash, hash_str)


def generate_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": (datetime.datetime.utcnow() + datetime.timedelta(days=7)).isoformat()
    }
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8")
    sig = hmac.new(AUTH_SECRET.encode("utf-8"), encoded_payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{encoded_payload}.{sig}"


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        encoded_payload, sig = parts
        expected_sig = hmac.new(AUTH_SECRET.encode("utf-8"), encoded_payload.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected_sig, sig):
            return None
        data = json.loads(base64.urlsafe_b64decode(encoded_payload.encode("utf-8")).decode("utf-8"))
        exp = datetime.datetime.fromisoformat(data["exp"])
        if datetime.datetime.utcnow() > exp:
            return None
        return data
    except Exception:
        return None


def signup(email: str, password: str) -> Dict[str, Any]:
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if not password or len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    db = get_db_session()
    try:
        existing = db.query(User).filter(User.email == email.strip().lower()).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email is already registered.")

        pwd_hash, salt = hash_password(password)
        user_id = str(uuid.uuid4())
        new_user = User(
            id=user_id,
            email=email.strip().lower(),
            password_hash=pwd_hash,
            salt=salt,
            risk_profile="balanced",
            risk_answers="[]"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = generate_token(new_user.id, new_user.email)
        return {
            "token": token,
            "email": new_user.email,
            "profile": new_user.risk_profile,
            "answers": json.loads(new_user.risk_answers)
        }
    finally:
        db.close()


def login(email: str, password: str) -> Dict[str, Any]:
    db = get_db_session()
    try:
        user = db.query(User).filter(User.email == email.strip().lower()).first()
        if not user:
            # Timing safety: still run hash to mitigate timing attacks
            hash_password(password, "dummysalt12345678")
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        if not verify_password(password, user.password_hash, user.salt):
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        token = generate_token(user.id, user.email)
        return {
            "token": token,
            "email": user.email,
            "profile": user.risk_profile,
            "answers": json.loads(user.risk_answers)
        }
    finally:
        db.close()


def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token.")
    token = authorization.split(" ")[1]
    claims = verify_token(token)
    if not claims:
        raise HTTPException(status_code=401, detail="Session expired or invalid token.")

    db = get_db_session()
    try:
        user = db.query(User).filter(User.id == claims["sub"]).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found.")
        return {
            "id": user.id,
            "email": user.email,
            "profile": user.risk_profile,
            "answers": json.loads(user.risk_answers)
        }
    finally:
        db.close()
