"""
Skill: delete_task

Purpose:
- Remove a task by id from the in-memory store

Rules:
- Pure logic only
- No input(), no print()
- In-memory behavior only (Phase-1)
"""

from typing import Tuple
from store import tasks, find_task


def delete_task(task_id: str) -> Tuple[bool, str]:
    """
    Delete a task from the in-memory store.

    Returns:
        (ok, message)

    Notes:
    - If ok is False, the task was not deleted.
    - task_id must be provided and must exist.
    """
    tid = (task_id or "").strip()

    if not tid:
        return False, "Task id is required."

    task = find_task(tid)
    if not task:
        return False, "Task not found."

    # Remove by identity (safe because task originates from the same list)
    tasks.remove(task)
    return True, "Task deleted."
