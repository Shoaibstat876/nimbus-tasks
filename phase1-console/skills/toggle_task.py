"""
Skill: toggle_task

Purpose:
- Flip is_completed for a task by id
- Update updated_at timestamp

Rules:
- Pure logic only
- No input(), no print()
- In-memory behavior only (Phase-1)
"""

from typing import Dict, Tuple, Any
from store import find_task, now_iso


def toggle_task(task_id: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Toggle completion state for a task.

    Returns:
        (ok, message, task)

    Notes:
    - If ok is False, task will be an empty dict.
    - task_id must be provided and must exist.
    """
    tid = (task_id or "").strip()

    if not tid:
        return False, "Task id is required.", {}

    task = find_task(tid)
    if not task:
        return False, "Task not found.", {}

    task["is_completed"] = not bool(task.get("is_completed"))
    task["updated_at"] = now_iso()

    status = "completed" if task["is_completed"] else "active"
    return True, f"Task marked {status}.", task
