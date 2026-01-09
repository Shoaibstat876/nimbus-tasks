from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Task, TaskCreate, TaskRead, User
from .auth_routes import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


# ============================================================
# Helpers (pure, deterministic, spec-aligned)
# ============================================================

def _get_owned_task_or_404(
    *,
    session: Session,
    task_id: int,
    current_user: User,
) -> Task:
    """
    Fetch a task owned by the current user.
    Privacy-preserving: returns 404 if not found or not owned.
    """
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


def _validate_title_or_400(raw_title: str | None) -> str:
    """
    Validation rules (Spec / Decision 003):
    - title required
    - trimmed
    - max length 80
    """
    title = (raw_title or "").strip()

    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required",
        )

    if len(title) > 80:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title too long (max 80)",
        )

    return title


def _touch_updated_at(task: Task) -> None:
    """
    Update mutation timestamp.
    created_at is assumed to be handled by model defaults.
    """
    task.updated_at = datetime.utcnow()


# ============================================================
# Endpoints (Owner-only, /api/tasks)
# ============================================================

@router.get("", response_model=List[TaskRead])
def list_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
):
    """
    List tasks owned by the current user.
    Ordered by newest first.
    """
    statement = (
        select(Task)
        .where(Task.user_id == current_user.id)
        .order_by(Task.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    return session.exec(statement).all()


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new task for the authenticated user.
    """
    title = _validate_title_or_400(payload.title)

    task = Task(
        title=title,
        user_id=current_user.id,
    )

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Update task title (owner-only).
    """
    task = _get_owned_task_or_404(
        session=session,
        task_id=task_id,
        current_user=current_user,
    )

    task.title = _validate_title_or_400(payload.title)
    _touch_updated_at(task)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/{task_id}/toggle", response_model=TaskRead)
def toggle_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle task completion status (owner-only).
    """
    task = _get_owned_task_or_404(
        session=session,
        task_id=task_id,
        current_user=current_user,
    )

    task.is_completed = not task.is_completed
    _touch_updated_at(task)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a task owned by the current user.
    """
    task = _get_owned_task_or_404(
        session=session,
        task_id=task_id,
        current_user=current_user,
    )

    session.delete(task)
    session.commit()
    return None
