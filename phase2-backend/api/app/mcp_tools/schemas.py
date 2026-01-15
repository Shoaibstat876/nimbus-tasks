# app/mcp_tools/schemas.py

"""
Pydantic schemas for MCP tool inputs and outputs.
"""

from typing import Any, Literal, Optional
from pydantic import BaseModel, Field


# ============================================================
# Tool Input Schemas
# ============================================================

class AddTaskInput(BaseModel):
    """Input schema for add_task tool."""
    user_id: str = Field(..., description="User ID (owner)")
    title: str = Field(..., description="Task title")


class ListTasksInput(BaseModel):
    """Input schema for list_tasks tool."""
    user_id: str = Field(..., description="User ID (owner)")
    status: Optional[Literal["all", "pending", "completed"]] = Field(
        default="all",
        description="Filter by status: all, pending, or completed"
    )


class CompleteTaskInput(BaseModel):
    """Input schema for complete_task tool."""
    user_id: str = Field(..., description="User ID (owner)")
    task_id: int = Field(..., description="Task ID to complete")


class UpdateTaskInput(BaseModel):
    """Input schema for update_task tool."""
    user_id: str = Field(..., description="User ID (owner)")
    task_id: int = Field(..., description="Task ID to update")
    title: str = Field(..., description="New task title")


class DeleteTaskInput(BaseModel):
    """Input schema for delete_task tool."""
    user_id: str = Field(..., description="User ID (owner)")
    task_id: int = Field(..., description="Task ID to delete")
    confirm: bool = Field(..., description="Confirmation flag (must be true)")


# ============================================================
# Tool Output Schema
# ============================================================

class ToolResponse(BaseModel):
    """Standard response format for all MCP tools."""
    ok: bool = Field(..., description="Success status")
    message: str = Field(..., description="Human-readable message")
    data: Any = Field(default=None, description="Response data (tool-specific)")
