# app/mcp_tools/server.py

"""
MCP Server - Phase III
Registers all task management tools using the official MCP SDK.
"""

import asyncio
import json
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from .schemas import (
    AddTaskInput,
    ListTasksInput,
    CompleteTaskInput,
    UpdateTaskInput,
    DeleteTaskInput,
)
from .tools import (
    add_task_tool,
    list_tasks_tool,
    complete_task_tool,
    update_task_tool,
    delete_task_tool,
)


# ============================================================
# MCP Server Setup
# ============================================================

mcp_server = Server("nimbus-tasks")


# ============================================================
# Tool Definitions
# ============================================================

@mcp_server.list_tools()
async def list_tools() -> list[Tool]:
    """
    List all available MCP tools.
    """
    return [
        Tool(
            name="add_task",
            description="Create a new task for a user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID (owner of the task)",
                    },
                    "title": {
                        "type": "string",
                        "description": "Task title (required, max 80 characters)",
                    },
                },
                "required": ["user_id", "title"],
            },
        ),
        Tool(
            name="list_tasks",
            description="List tasks for a user, optionally filtered by status",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID (owner of the tasks)",
                    },
                    "status": {
                        "type": "string",
                        "enum": ["all", "pending", "completed"],
                        "description": "Filter by status (default: all)",
                    },
                },
                "required": ["user_id"],
            },
        ),
        Tool(
            name="complete_task",
            description="Mark a task as completed",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID (owner of the task)",
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to complete",
                    },
                },
                "required": ["user_id", "task_id"],
            },
        ),
        Tool(
            name="update_task",
            description="Update a task's title",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID (owner of the task)",
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to update",
                    },
                    "title": {
                        "type": "string",
                        "description": "New task title (required, max 80 characters)",
                    },
                },
                "required": ["user_id", "task_id", "title"],
            },
        ),
        Tool(
            name="delete_task",
            description="Delete a task (requires confirmation)",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID (owner of the task)",
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to delete",
                    },
                    "confirm": {
                        "type": "boolean",
                        "description": "Confirmation flag (must be true)",
                    },
                },
                "required": ["user_id", "task_id", "confirm"],
            },
        ),
    ]


@mcp_server.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """
    Execute a tool by name with given arguments.
    """
    try:
        # Route to appropriate tool
        if name == "add_task":
            input_data = AddTaskInput(**arguments)
            result = add_task_tool(input_data)

        elif name == "list_tasks":
            input_data = ListTasksInput(**arguments)
            result = list_tasks_tool(input_data)

        elif name == "complete_task":
            input_data = CompleteTaskInput(**arguments)
            result = complete_task_tool(input_data)

        elif name == "update_task":
            input_data = UpdateTaskInput(**arguments)
            result = update_task_tool(input_data)

        elif name == "delete_task":
            input_data = DeleteTaskInput(**arguments)
            result = delete_task_tool(input_data)

        else:
            return [
                TextContent(
                    type="text",
                    text=json.dumps({
                        "ok": False,
                        "message": f"Unknown tool: {name}",
                        "data": None,
                    }),
                )
            ]

        # Return result as TextContent
        return [
            TextContent(
                type="text",
                text=json.dumps(result.model_dump()),
            )
        ]

    except Exception as e:
        # Handle validation errors and other exceptions
        return [
            TextContent(
                type="text",
                text=json.dumps({
                    "ok": False,
                    "message": f"Error executing tool: {str(e)}",
                    "data": None,
                }),
            )
        ]


# ============================================================
# Main Entry Point
# ============================================================

async def main():
    """
    Run the MCP server using stdio transport.
    """
    async with stdio_server() as (read_stream, write_stream):
        await mcp_server.run(
            read_stream,
            write_stream,
            mcp_server.create_initialization_options(),
        )


if __name__ == "__main__":
    asyncio.run(main())
