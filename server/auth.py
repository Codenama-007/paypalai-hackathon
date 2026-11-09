"""
Authentication and user risk profile store.
"""
import os
import json
import hashlib
import secrets
from typing import Dict, Any, Optional

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
AUTH_SECRET = os.environ.get("AUTH_SECRET", "finintel-secure-secret-key-2026")

def _load_users() -> Dict[str, Any]:
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def _save_users(users: Dict[str, Any]):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    return hashed, salt

def signup(email: str, password: str) -> Dict[str, Any]:
    email = email.strip().lower()
    if not email or "@" not in email:
        raise ValueError("Valid email is required.")
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    users = _load_users()
    if email in users:
        raise ValueError("Email already registered.")

    hashed, salt = hash_password(password)
    token = secrets.token_urlsafe(32)
    users[email] = {
        "email": email,
        "hash": hashed,
        "salt": salt,
        "token": token,
        "profile": "balanced",
        "answers": [2, 2, 2, 2, 2]
    }
    _save_users(users)
    return {
        "token": token,
        "email": email,
        "profile": "balanced",
        "answers": [2, 2, 2, 2, 2]
    }

def login(email: str, password: str) -> Dict[str, Any]:
    email = email.strip().lower()
    users = _load_users()
    user = users.get(email)
    
    # Constant-time-like check
    salt = user["salt"] if user else secrets.token_hex(16)
    hashed, _ = hash_password(password, salt)

    if not user or user["hash"] != hashed:
        raise ValueError("Invalid email or password.")

    token = secrets.token_urlsafe(32)
    user["token"] = token
    users[email] = user
    _save_users(users)
    return {
        "token": token,
        "email": email,
        "profile": user.get("profile", "balanced"),
        "answers": user.get("answers", [2, 2, 2, 2, 2])
    }

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    users = _load_users()
    for email, u in users.items():
        if u.get("token") == token:
            return {"email": email, "profile": u.get("profile", "balanced"), "answers": u.get("answers", [])}
    return None

def update_user_profile(email: str, profile: str, answers: list) -> Dict[str, Any]:
    users = _load_users()
    if email in users:
        users[email]["profile"] = profile
        users[email]["answers"] = answers
        _save_users(users)
        return {"email": email, "profile": profile, "answers": answers}
    raise ValueError("User not found.")

