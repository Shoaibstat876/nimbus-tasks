"""
Skill: add_task

Purpose:
- Validate task title
- Create a new task entity
- Append it to the in-memory store

Rules:
- Pure logic only
- No input(), no print()
- In-memory behavior only (Phase-1)
"""

from typing import Dict, Tuple, Any
from store import tasks, generate_id, now_iso



def _normalize_title(title: str) -> str:
    """
    Normalize user-provided title by trimming whitespace.
    """
    return (title or "").strip()


def add_task(title: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Add a new task to the in-memory store.

    Returns:
        (ok, message, task)

    Notes:
    - If ok is False, task will be an empty dict.
    - Title must be non-empty and <= 80 characters.
    """
    clean = _normalize_title(title)

    if not clean:
        return False, "Title is required.", {}

    if len(clean) > 80:
        return False, "Title too long (max 80).", {}

    task: Dict[str, Any] = {
        "id": generate_id(),
        "title": clean,
        "is_completed": False,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }

    tasks.append(task)
    return True, "Task added.", task
