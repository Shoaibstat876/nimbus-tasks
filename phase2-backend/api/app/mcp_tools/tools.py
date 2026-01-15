# app/mcp_tools/tools.py

"""
MCP Tool implementations - Phase III
All tools are stateless and enforce owner-only access.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List

from sqlmodel import Session, select

from ..database import engine
from ..models import Task, User
from .schemas import (
    AddTaskInput,
    ListTasksInput,
    CompleteTaskInput,
    UpdateTaskInput,
    DeleteTaskInput,
    ToolResponse,
)


# ============================================================
# Helper Functions
# ============================================================

def _validate_user(session: Session, user_id: str) -> User:
    """
    Validate that user exists.
    Raises ValueError if user not found.
    """
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise ValueError(f"Invalid user_id format: {user_id}")

    user = session.get(User, user_id_int)
    if not user:
        raise ValueError(f"User not found: {user_id}")

    return user


def _get_owned_task(session: Session, task_id: int, user_id: int) -> Task:
    """
    Fetch a task owned by the user.
    Raises ValueError if task not found or not owned.
    """
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == user_id)
    ).first()

    if not task:
        raise ValueError(f"Task not found or access denied: {task_id}")

    return task


def _task_to_dict(task: Task) -> Dict[str, Any]:
    """Convert Task model to dictionary."""
    return {
        "id": task.id,
        "user_id": task.user_id,
        "title": task.title,
        "is_completed": task.is_completed,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }


def _validate_title(title: str) -> str:
    """
    Validate task title.
    Returns trimmed title or raises ValueError.
    """
    title = (title or "").strip()

    if not title:
        raise ValueError("Title is required")

    if len(title) > 80:
        raise ValueError("Title too long (max 80 characters)")

    return title


# ============================================================
# MCP Tool Implementations
# ============================================================

def add_task_tool(input_data: AddTaskInput) -> ToolResponse:
    """
    Add a new task for the authenticated user.

    Args:
        input_data: AddTaskInput with user_id and title

    Returns:
        ToolResponse with created task data
    """
    try:
        with Session(engine) as session:
            # Validate user exists
            user = _validate_user(session, input_data.user_id)

            # Validate title
            title = _validate_title(input_data.title)

            # Create task
            task = Task(
                title=title,
                user_id=user.id,
            )

            session.add(task)
            session.commit()
            session.refresh(task)

            return ToolResponse(
                ok=True,
                message="Task created successfully",
                data=_task_to_dict(task),
            )

    except ValueError as e:
        return ToolResponse(
            ok=False,
            message=str(e),
            data=None,
        )
    except Exception as e:
        return ToolResponse(
            ok=False,
            message=f"Internal error: {str(e)}",
            data=None,
        )


def list_tasks_tool(input_data: ListTasksInput) -> ToolResponse:
    """
    List tasks for the authenticated user, optionally filtered by status.

    Args:
        input_data: ListTasksInput with user_id and optional status filter

    Returns:
        ToolResponse with array of tasks
    """
    try:
        with Session(engine) as session:
            # Validate user exists
            user = _validate_user(session, input_data.user_id)

            # Build query
            query = select(Task).where(Task.user_id == user.id)

            # Apply status filter
            if input_data.status == "pending":
                query = query.where(Task.is_completed == False)
            elif input_data.status == "completed":
                query = query.where(Task.is_completed == True)
            # "all" or None - no filter

            # Order by newest first
            query = query.order_by(Task.created_at.desc())

            tasks = session.exec(query).all()

            return ToolResponse(
                ok=True,
                message=f"Found {len(tasks)} task(s)",
                data=[_task_to_dict(task) for task in tasks],
            )

    except ValueError as e:
        return ToolResponse(
            ok=False,
            message=str(e),
            data=None,
        )
    except Exception as e:
        return ToolResponse(
            ok=False,
            message=f"Internal error: {str(e)}",
            data=None,
        )


def complete_task_tool(input_data: CompleteTaskInput) -> ToolResponse:
    """
    Mark a task as completed (owner-only).

    Args:
        input_data: CompleteTaskInput with user_id and task_id

    Returns:
        ToolResponse with updated task data
    """
    try:
        with Session(engine) as session:
            # Validate user exists
            user = _validate_user(session, input_data.user_id)

            # Get owned task
            task = _get_owned_task(session, input_data.task_id, user.id)

            # Mark as completed
            task.is_completed = True
            task.updated_at = datetime.now(timezone.utc)

            session.add(task)
            session.commit()
            session.refresh(task)

            return ToolResponse(
                ok=True,
                message="Task marked as completed",
                data=_task_to_dict(task),
            )

    except ValueError as e:
        return ToolResponse(
            ok=False,
            message=str(e),
            data=None,
        )
    except Exception as e:
        return ToolResponse(
            ok=False,
            message=f"Internal error: {str(e)}",
            data=None,
        )


def update_task_tool(input_data: UpdateTaskInput) -> ToolResponse:
    """
    Update a task's title (owner-only).

    Args:
        input_data: UpdateTaskInput with user_id, task_id, and new title

    Returns:
        ToolResponse with updated task data
    """
    try:
        with Session(engine) as session:
            # Validate user exists
            user = _validate_user(session, input_data.user_id)

            # Get owned task
            task = _get_owned_task(session, input_data.task_id, user.id)

            # Validate and update title
            title = _validate_title(input_data.title)
            task.title = title
            task.updated_at = datetime.now(timezone.utc)

            session.add(task)
            session.commit()
            session.refresh(task)

            return ToolResponse(
                ok=True,
                message="Task updated successfully",
                data=_task_to_dict(task),
            )

    except ValueError as e:
        return ToolResponse(
            ok=False,
            message=str(e),
            data=None,
        )
    except Exception as e:
        return ToolResponse(
            ok=False,
            message=f"Internal error: {str(e)}",
            data=None,
        )


def delete_task_tool(input_data: DeleteTaskInput) -> ToolResponse:
    """
    Delete a task (owner-only). Requires confirmation.

    Args:
        input_data: DeleteTaskInput with user_id, task_id, and confirm flag

    Returns:
        ToolResponse with deleted task summary
    """
    try:
        with Session(engine) as session:
            # Validate user exists
            user = _validate_user(session, input_data.user_id)

            # Check confirmation
            if not input_data.confirm:
                return ToolResponse(
                    ok=False,
                    message="Deletion requires confirmation (confirm must be true)",
                    data=None,
                )

            # Get owned task
            task = _get_owned_task(session, input_data.task_id, user.id)

            # Capture task info before deletion
            task_info = {
                "id": task.id,
                "title": task.title,
                "was_completed": task.is_completed,
            }

            # Delete task
            session.delete(task)
            session.commit()

            return ToolResponse(
                ok=True,
                message="Task deleted successfully",
                data=task_info,
            )

    except ValueError as e:
        return ToolResponse(
            ok=False,
            message=str(e),
            data=None,
        )
    except Exception as e:
        return ToolResponse(
            ok=False,
            message=f"Internal error: {str(e)}",
            data=None,
        )
