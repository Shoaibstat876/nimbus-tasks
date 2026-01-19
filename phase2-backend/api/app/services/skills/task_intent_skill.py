"""
task_intent_skill.py

Reusable Intelligence Skill:
Detect a coarse task-management intent from a user message.

This is NOT a replacement for the agent.
It is only a lightweight, deterministic hint that can be used to steer prompting.

Returns one of:
- "add" | "list" | "update" | "complete" | "delete" | "unknown"
"""

from __future__ import annotations

import re


_INTENTS = [
    ("delete", re.compile(r"\b(delete|remove|cancel|drop)\b", re.IGNORECASE)),
    ("complete", re.compile(r"\b(complete|done|finished|mark\s+done|mark\s+complete)\b", re.IGNORECASE)),
    ("update", re.compile(r"\b(update|change|rename|edit|modify)\b", re.IGNORECASE)),
    ("list", re.compile(r"\b(list|show|see|view|what\s+are|what's)\b", re.IGNORECASE)),
    ("add", re.compile(r"\b(add|create|remember|new|make)\b", re.IGNORECASE)),
]

# Urdu keyword hints (very small set; safe + optional)
_UR_HINTS = {
    "add": ["شامل", "بناؤ", "بناو", "یاد", "نیا"],
    "list": ["دکھاؤ", "دکھاو", "فہرست", "لسٹ", "سب"],
    "update": ["بدلو", "تبدیل", "اپڈیٹ"],
    "complete": ["مکمل", "ہوگیا", "ہو گئی", "ہوگئے", "ہو گئے", "done"],
    "delete": ["حذف", "ڈیلیٹ", "مٹاؤ", "مٹاو", "ہٹا", "ہٹاؤ", "ہٹاو"],
}


def detect_intent(message: str) -> str:
    msg = (message or "").strip()
    if not msg:
        return "unknown"

    # First pass: English regex
    for name, pattern in _INTENTS:
        if pattern.search(msg):
            return name

    # Second pass: tiny Urdu keyword hinting
    for intent, words in _UR_HINTS.items():
        for w in words:
            if w in msg:
                return intent

    return "unknown"
