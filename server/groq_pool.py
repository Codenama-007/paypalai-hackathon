"""
Groq API key pool with automatic round-robin and rate-limit failover.
"""
import os
from typing import List, Optional
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()


class GroqPool:
    def __init__(self):
        raw_keys = os.getenv("GROQ_API_KEY", "")
        self.keys: List[str] = [k.strip() for k in raw_keys.split(",") if k.strip()]
        self.current_idx = 0

    @property
    def has_keys(self) -> bool:
        return len(self.keys) > 0

    @property
    def key_count(self) -> int:
        return len(self.keys)

    def get_current_key(self) -> Optional[str]:
        if not self.keys:
            return None
        return self.keys[self.current_idx]

    def rotate_key(self) -> Optional[str]:
        if not self.keys:
            return None
        self.current_idx = (self.current_idx + 1) % len(self.keys)
        return self.keys[self.current_idx]

    def get_chat_model(self, model_name: str = "llama-3.3-70b-versatile", temperature: float = 0.2) -> Optional[ChatGroq]:
        key = self.get_current_key()
        if not key:
            return None
        return ChatGroq(
            api_key=key,
            model_name=model_name,
            temperature=temperature
        )


groq_pool = GroqPool()
