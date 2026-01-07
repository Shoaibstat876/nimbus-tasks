from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship, Column, DateTime

# --- DATABASE MODELS ---

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    hashed_password: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True))
    )
    
    # Hybrid Addition: Link tasks to users for easy querying (user.tasks)
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign Key ensures data integrity between User and Task
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    
    title: str = Field(max_length=80, index=True, nullable=False)
    is_completed: bool = Field(default=False, index=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True))
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True), 
            onupdate=lambda: datetime.now(timezone.utc)
        )
    )

    user: Optional[User] = Relationship(back_populates="tasks")

# --- API SCHEMAS (Pydantic models) ---

class TaskCreate(SQLModel):
    title: str
    # is_completed is excluded here so tasks start as False

class TaskRead(SQLModel):
    id: int
    user_id: int
    title: str
    is_completed: bool
    created_at: datetime
    updated_at: datetime