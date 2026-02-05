# app/models.py

from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID, uuid4

from sqlalchemy import String, Text
from sqlmodel import SQLModel, Field, Relationship, Column, DateTime


# ============================================================
# DATABASE MODELS
# ============================================================

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Email must be unique + indexed (auth contract)
    email: str = Field(
        sa_column=Column(String(255), unique=True, index=True, nullable=False)
    )

    hashed_password: str = Field(nullable=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    # ORM convenience
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Owner-only law: every task must have an owner (NOT optional)
    user_id: int = Field(foreign_key="user.id", index=True, nullable=False)

    title: str = Field(max_length=80, index=True, nullable=False)
    is_completed: bool = Field(default=False, index=True, nullable=False)

    # ----------------------------
    # Phase V feature fields
    # (safe defaults; do not break existing tasks)
    # ----------------------------
    priority: str = Field(default="medium", max_length=16, nullable=False)
    tags_csv: str = Field(default="", max_length=1000, nullable=False)

    due_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    remind_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    reminded_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )

    recurrence: str = Field(default="none", max_length=16, nullable=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    user: Optional["User"] = Relationship(back_populates="tasks")


class Conversation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Owner-only law: every conversation must have an owner (NOT optional)
    user_id: int = Field(foreign_key="user.id", index=True, nullable=False)

    # Optional title for conversation context
    title: Optional[str] = Field(default=None, max_length=255, nullable=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class Message(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # FK to conversation
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True, nullable=False)

    # Owner-only law: every message must have an owner (NOT optional)
    user_id: int = Field(foreign_key="user.id", index=True, nullable=False)

    # Role: "user" or "assistant"
    role: str = Field(max_length=20, index=True, nullable=False)

    # Message content (can be large)
    content: str = Field(sa_column=Column(Text, nullable=False))

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


# ============================================================
# API SCHEMAS (Pydantic models)
# ============================================================

class TaskCreate(SQLModel):
    title: str


class TaskRead(SQLModel):
    id: int
    user_id: int
    title: str
    is_completed: bool

    # Phase V fields (read)
    priority: str
    tags_csv: str
    due_at: Optional[datetime]
    remind_at: Optional[datetime]
    reminded_at: Optional[datetime]
    recurrence: str

    created_at: datetime
    updated_at: datetime
