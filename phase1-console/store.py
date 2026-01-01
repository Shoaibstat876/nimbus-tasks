"""
In-memory store for tasks.

Purpose:
- Hold shared in-memory state (process lifetime only)
- Provide tiny helper utilities for skills

Rules:
- No input(), no print()
- No file I/O, no database
- In-memory only (Phase-1)
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
import uuid

# ---------- In-memory state ----------

tasks: List[Dict[str, Any]] = []

# ---------- helpers ----------


def now_iso() -> str:
    """
    Return a UTC timestamp in ISO 8601 string format.
    """
    return datetime.utcnow().isoformat()


def generate_id() -> str:
    """
    Generate a unique id for a task.
    """
    return uuid.uuid4().hex


def find_task(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Find and return a task dict by id, or None if not found.
    """
    for task in tasks:
        if task.get("id") == task_id:
            return task
    return None
