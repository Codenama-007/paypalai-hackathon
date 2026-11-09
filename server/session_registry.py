"""
In-memory session registry with bounded LRU/TTL thread eviction.
"""
import time
from typing import Dict, Any, Optional

MAX_ACTIVE_SESSIONS = 500
SESSION_TTL_SECONDS = 3600  # 1 hour


class SessionRegistry:
    def __init__(self):
        self.sessions: Dict[str, float] = {}

    def touch(self, thread_id: str):
        self.sessions[thread_id] = time.time()
        self._cleanup()

    def exists(self, thread_id: str) -> bool:
        last = self.sessions.get(thread_id)
        if not last:
            return False
        if time.time() - last > SESSION_TTL_SECONDS:
            del self.sessions[thread_id]
            return False
        return True

    def _cleanup(self):
        now = time.time()
        # Evict expired
        expired = [tid for tid, last in self.sessions.items() if now - last > SESSION_TTL_SECONDS]
        for tid in expired:
            del self.sessions[tid]

        # Evict oldest if exceeding cap
        if len(self.sessions) > MAX_ACTIVE_SESSIONS:
            sorted_tids = sorted(self.sessions.items(), key=lambda x: x[1])
            excess = len(self.sessions) - MAX_ACTIVE_SESSIONS
            for tid, _ in sorted_tids[:excess]:
                del self.sessions[tid]


session_registry = SessionRegistry()
