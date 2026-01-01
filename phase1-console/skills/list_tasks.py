"""
Skill: list_tasks

Purpose:
- Return tasks from the in-memory store (optionally filtered)

Rules:
- Pure logic only
- No input(), no print()
- In-memory behavior only (Phase-1)
"""

from typing import Dict, List, Tuple, Any
from store import tasks


def list_tasks(filter_by: str = "all") -> Tuple[bool, str, List[Dict[str, Any]]]:
    """
    List tasks from the in-memory store.

    Args:
        filter_by: "all" | "active" | "completed"

    Returns:
        (ok, message, items)

    Notes:
    - If filter_by is invalid, ok is False and items is [].
    - Returned list is a shallow copy (safe for display).
    """
    mode = (filter_by or "all").strip().lower()

    if mode not in ("all", "active", "completed"):
        return False, "Invalid filter. Use: all | active | completed.", []

    if mode == "all":
        return True, "OK", list(tasks)

    if mode == "active":
        items = [t for t in tasks if not bool(t.get("is_completed"))]
        return True, "OK", items

    # mode == "completed"
    items = [t for t in tasks if bool(t.get("is_completed"))]
    return True, "OK", items
