"""
Skill: update_task

Purpose:
- Update a task title by id
- Update updated_at timestamp

Rules:
- Pure logic only
- No input(), no print()
- In-memory behavior only (Phase-1)
"""

from typing import Dict, Tuple, Any
from store import find_task, now_iso


def _normalize_title(title: str) -> str:
    """
    Normalize user-provided title by trimming whitespace.
    """
    return (title or "").strip()


def update_task(task_id: str, new_title: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Update the title of an existing task.

    Returns:
        (ok, message, task)

    Notes:
    - If ok is False, task will be an empty dict.
    - task_id must be provided and must exist.
    - new_title must be non-empty and <= 80 characters.
    """
    tid = (task_id or "").strip()

    if not tid:
        return False, "Task id is required.", {}

    clean = _normalize_title(new_title)

    if not clean:
        return False, "Title is required.", {}

    if len(clean) > 80:
        return False, "Title too long (max 80).", {}

    task = find_task(tid)
    if not task:
        return False, "Task not found.", {}

    task["title"] = clean
    task["updated_at"] = now_iso()

    return True, "Task updated.", task
