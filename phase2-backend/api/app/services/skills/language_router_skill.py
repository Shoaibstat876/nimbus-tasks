"""
language_router_skill.py

Reusable Intelligence Skill:
Resolve response language for the chatbot in a deterministic way.

Rules:
- If preferred is "en" or "ur" (case-insensitive) => use it.
- Else if message contains Urdu/Arabic script characters => "ur"
- Else => "en"
"""

from __future__ import annotations

from typing import Optional


def _is_valid_lang(value: Optional[str]) -> bool:
    if value is None:
        return False
    v = value.strip().lower()
    return v in {"en", "ur"}


def _looks_like_urdu(text: str) -> bool:
    """
    Detect Urdu (Arabic script) characters.
    This is intentionally simple and deterministic.
    Urdu commonly uses Arabic script Unicode ranges.
    """
    for ch in text:
        code = ord(ch)
        # Arabic block + Arabic Supplement + Arabic Extended-A
        if (0x0600 <= code <= 0x06FF) or (0x0750 <= code <= 0x077F) or (0x08A0 <= code <= 0x08FF):
            return True
    return False


def resolve_language(preferred: Optional[str], message: str) -> str:
    """
    Decide output language.
    Returns: "en" or "ur"
    """
    if _is_valid_lang(preferred):
        return preferred.strip().lower()

    msg = (message or "").strip()
    if msg and _looks_like_urdu(msg):
        return "ur"

    return "en"
