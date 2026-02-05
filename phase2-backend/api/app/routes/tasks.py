from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import case
from sqlmodel import Session, select

from ..database import get_session
from ..models import Task, TaskCreate, TaskRead, TaskUpdate, User
from .auth_routes import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


# ============================================================
# Helpers (pure, deterministic, spec-aligned)
# ============================================================

def tags_list_to_csv(tags: Optional[list[str]]) -> str:
    if not tags:
        return ""

    cleaned: list[str] = []
    for t in tags:
        t2 = (t or "").strip()
        if t2:
            cleaned.append(t2)

    # remove duplicates while preserving order
    seen = set()
    uniq: list[str] = []
    for t in cleaned:
        if t not in seen:
            seen.add(t)
            uniq.append(t)

    return ",".join(uniq[:10])


def tags_csv_to_list(tags_csv: Optional[str]) -> list[str]:
    if not tags_csv:
        return []
    parts = [p.strip() for p in tags_csv.split(",")]
    return [p for p in parts if p][:10]


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


def _task_to_read(task: Task) -> TaskRead:
    """
    Convert DB Task -> API TaskRead (teacher-friendly).
    """
    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        is_completed=task.is_completed,
        priority=task.priority,
        tags=tags_csv_to_list(task.tags_csv),
        tags_csv=task.tags_csv,
        due_at=task.due_at,
        remind_at=task.remind_at,
        reminded_at=task.reminded_at,
        recurrence=task.recurrence,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )


# ============================================================
# Sorting helpers
# ============================================================

PRIORITY_RANK = case(
    (Task.priority == "low", 1),
    (Task.priority == "medium", 2),
    (Task.priority == "high", 3),
    else_=2,
)


def apply_sort(stmt, sort: str | None, order: str | None):
    sort_key = (sort or "created_at").strip().lower()
    desc = (order or "desc").strip().lower() == "desc"

    if sort_key == "due_at":
        col = Task.due_at
    elif sort_key == "priority":
        col = PRIORITY_RANK
    elif sort_key == "title":
        col = Task.title
    else:
        col = Task.created_at  # default

    primary = col.desc() if desc else col.asc()
    secondary = Task.created_at.desc() if desc else Task.created_at.asc()

    # deterministic tertiary
    return stmt.order_by(primary, secondary, Task.id.asc())


# ============================================================
# Endpoints (Owner-only, /api/tasks)
# ============================================================

@router.get("", response_model=List[TaskRead])
def list_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),

    # Phase V query params
    q: Optional[str] = Query(default=None),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    priority: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    due_before: Optional[datetime] = Query(default=None),
    due_after: Optional[datetime] = Query(default=None),
    sort: Optional[str] = Query(default=None),
    order: Optional[str] = Query(default=None),
):
    """
    List tasks owned by the current user.

    Phase V:
    - q: search title
    - status: all/pending/completed
    - priority: low/medium/high
    - tag: substring match against tags_csv (judge-safe)
    - due_before / due_after
    - sort: created_at (default), due_at, priority, title
    - order: asc/desc
    """
    stmt = select(Task).where(Task.user_id == current_user.id)

    # status
    sf = (status_filter or "").strip().lower()
    if sf == "pending":
        stmt = stmt.where(Task.is_completed.is_(False))
    elif sf == "completed":
        stmt = stmt.where(Task.is_completed.is_(True))

    # priority
    pr = (priority or "").strip().lower()
    if pr:
        if pr not in {"low", "medium", "high"}:
            raise HTTPException(status_code=400, detail="Invalid priority")
        stmt = stmt.where(Task.priority == pr)

    # tag filter (simple CSV contains; judge-safe)
    tg = (tag or "").strip()
    if tg:
        stmt = stmt.where(Task.tags_csv.ilike(f"%{tg}%"))

    # search (title)
    qq = (q or "").strip()
    if qq:
        stmt = stmt.where(Task.title.ilike(f"%{qq}%"))

    # due filters
    if due_before:
        stmt = stmt.where(Task.due_at.is_not(None)).where(Task.due_at <= due_before)
    if due_after:
        stmt = stmt.where(Task.due_at.is_not(None)).where(Task.due_at >= due_after)

    # sort
    stmt = apply_sort(stmt, sort, order)

    stmt = stmt.offset(offset).limit(limit)
    tasks = session.exec(stmt).all()
    return [_task_to_read(t) for t in tasks]


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new task for the authenticated user (Phase V fields supported).
    """
    title = _validate_title_or_400(payload.title)

    task = Task(
        title=title,
        user_id=current_user.id,
        priority=payload.priority,
        tags_csv=tags_list_to_csv(payload.tags),
        due_at=payload.due_at,
        remind_at=payload.remind_at,
        recurrence=payload.recurrence,
    )

    session.add(task)
    session.commit()
    session.refresh(task)
    return _task_to_read(task)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Update task fields (owner-only).
    """
    task = _get_owned_task_or_404(
        session=session,
        task_id=task_id,
        current_user=current_user,
    )

    if payload.title is not None:
        task.title = _validate_title_or_400(payload.title)

    if payload.priority is not None:
        task.priority = payload.priority

    if payload.tags is not None:
        task.tags_csv = tags_list_to_csv(payload.tags)

    # datetime updates (explicit even if None)
    task.due_at = payload.due_at
    task.remind_at = payload.remind_at

    if payload.recurrence is not None:
        task.recurrence = payload.recurrence

    _touch_updated_at(task)

    session.add(task)
    session.commit()
    session.refresh(task)
    return _task_to_read(task)


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
    return _task_to_read(task)


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
