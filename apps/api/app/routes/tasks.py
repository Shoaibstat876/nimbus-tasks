from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Task, TaskCreate, TaskRead, User
from .auth_routes import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


# -----------------------
# Helpers (clean + reuse)
# -----------------------
def _get_owned_task_or_404(
    *,
    session: Session,
    task_id: int,
    current_user: User,
) -> Task:
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        # Privacy-preserving 404 (never reveal other users' tasks)
        raise HTTPException(status_code=404, detail="Task not found")

    return task


def _validate_title_or_400(raw_title: str | None) -> str:
    title = (raw_title or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    if len(title) > 80:
        raise HTTPException(status_code=400, detail="Title too long (max 80)")
    return title


def _touch_updated_at(task: Task) -> None:
    # If your model uses default_factory for created_at/updated_at on creation,
    # we only manually update on mutations.
    task.updated_at = datetime.utcnow()


# -----------------------
# Endpoints
# -----------------------
@router.get("", response_model=List[TaskRead])
def list_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    offset: int = 0,
    limit: int = Query(default=100, le=100),
):
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
    title = _validate_title_or_400(payload.title)

    new_task = Task(
        title=title,
        user_id=current_user.id,
        # created_at / updated_at should come from model default_factory if you set it
    )

    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    task = _get_owned_task_or_404(session=session, task_id=task_id, current_user=current_user)

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
    task = _get_owned_task_or_404(session=session, task_id=task_id, current_user=current_user)

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
    task = _get_owned_task_or_404(session=session, task_id=task_id, current_user=current_user)

    session.delete(task)
    session.commit()
    # 204 should return no body
    return None
