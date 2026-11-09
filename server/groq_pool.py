"""
Groq LLM pool manager with multi-key failover and resilient fallback synthesis.
"""
import os
import requests
from typing import Optional, List, Dict, Any

class GroqPool:
    def __init__(self):
        raw_keys = os.environ.get("GROQ_API_KEY", "")
        self.keys = [k.strip() for k in raw_keys.split(",") if k.strip()]
        self.current_idx = 0

    def has_keys(self) -> bool:
        return len(self.keys) > 0

    def get_key_count(self) -> int:
        return len(self.keys)

    def complete(self, messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1500) -> Optional[str]:
        if not self.keys:
            return None

        attempts = 0
        while attempts < len(self.keys):
            key = self.keys[self.current_idx]
            try:
                resp = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens
                    },
                    timeout=20
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
                elif resp.status_code in [429, 401]:
                    self.current_idx = (self.current_idx + 1) % len(self.keys)
                    attempts += 1
                else:
                    attempts += 1
            except Exception:
                self.current_idx = (self.current_idx + 1) % len(self.keys)
                attempts += 1

        return None

groq_pool = GroqPool()

