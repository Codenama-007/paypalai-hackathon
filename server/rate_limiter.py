"""
Sliding-window in-memory rate limiter middleware for FastAPI.
Protects endpoints against brute force and server hammering.
"""
import time
from typing import Dict, List
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

WINDOW_SECONDS = 60
LIMIT_PER_MINUTE = 120  # generous default limit


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.requests: Dict[str, List[float]] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        if client_ip not in self.requests:
            self.requests[client_ip] = []

        # Filter out requests older than window
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < WINDOW_SECONDS]

        if len(self.requests[client_ip]) >= LIMIT_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please wait a minute."},
                headers={"Retry-After": "60"}
            )

        self.requests[client_ip].append(now)
        response = await call_next(request)
        return response
