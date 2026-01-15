# app/services/chat_agent.py

"""
Stateless AI Agent for Phase III Chat
- Uses OpenAI Agents SDK with MCP tool integration
- Loads conversation history from DB (stateless)
- Implements identity injection for user_id
- No in-memory state between requests
"""

import json
import os
from typing import Any, Dict, List, Tuple
from uuid import UUID

from openai import OpenAI
from sqlmodel import Session

from . import chat_repo
from ..mcp_tools.tools import (
    add_task_tool,
    list_tasks_tool,
    complete_task_tool,
    update_task_tool,
    delete_task_tool,
)
from ..mcp_tools.schemas import (
    AddTaskInput,
    ListTasksInput,
    CompleteTaskInput,
    UpdateTaskInput,
    DeleteTaskInput,
)


# ============================================================
# CONFIGURATION
# ============================================================

# Maximum conversation history to load (prevent context overflow)
MAX_HISTORY_MESSAGES = 50

# AI Model configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is required in .env")

AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

# Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# System prompt for the agent
SYSTEM_PROMPT = """You are a helpful task management assistant. You can help users:
- Create tasks (add_task)
- List tasks with status filters (list_tasks)
- Mark tasks as completed (complete_task)
- Update task titles (update_task)
- Delete tasks (delete_task)

IMPORTANT GUARDRAILS:
1. For destructive operations (delete, update), always confirm with the user first
2. If a request is ambiguous (e.g., "delete my task"), ask which task they mean
3. List tasks first if you need to identify a specific task
4. Never assume task IDs - always verify with the user

When the user asks to delete or update a task:
1. List their tasks if needed
2. Ask "Which task do you want to [delete/update]?"
3. After user confirms, proceed with the operation

Be concise and helpful."""


# ============================================================
# TOOL DEFINITIONS (for OpenAI function calling)
# ============================================================

def get_tool_definitions() -> List[Dict[str, Any]]:
    """
    Return tool definitions in OpenAI function calling format.
    """
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Task title (max 80 characters)",
                        },
                    },
                    "required": ["title"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "List tasks with optional status filter",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter by status (default: all)",
                        },
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "complete_task",
                "description": "Mark a task as completed",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "Task ID to complete",
                        },
                    },
                    "required": ["task_id"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update a task's title",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "Task ID to update",
                        },
                        "title": {
                            "type": "string",
                            "description": "New task title (max 80 characters)",
                        },
                    },
                    "required": ["task_id", "title"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Delete a task (requires user confirmation first)",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "Task ID to delete",
                        },
                        "confirm": {
                            "type": "boolean",
                            "description": "Confirmation flag (must be true)",
                        },
                    },
                    "required": ["task_id", "confirm"],
                },
            },
        },
    ]


# ============================================================
# TOOL EXECUTION (with Identity Injection)
# ============================================================

def execute_tool(
    tool_name: str,
    tool_args: Dict[str, Any],
    user_id: int,
) -> Dict[str, Any]:
    """
    Execute a tool with identity injection.

    CRITICAL: user_id is derived from JWT by the backend, never from AI.

    Args:
        tool_name: Name of the tool to execute
        tool_args: Arguments provided by the AI
        user_id: Authenticated user ID (injected by backend)

    Returns:
        Tool execution result as dict
    """
    # Inject user_id into all tool calls
    user_id_str = str(user_id)

    try:
        if tool_name == "add_task":
            input_data = AddTaskInput(
                user_id=user_id_str,
                title=tool_args.get("title", ""),
            )
            result = add_task_tool(input_data)

        elif tool_name == "list_tasks":
            input_data = ListTasksInput(
                user_id=user_id_str,
                status=tool_args.get("status", "all"),
            )
            result = list_tasks_tool(input_data)

        elif tool_name == "complete_task":
            input_data = CompleteTaskInput(
                user_id=user_id_str,
                task_id=tool_args.get("task_id"),
            )
            result = complete_task_tool(input_data)

        elif tool_name == "update_task":
            input_data = UpdateTaskInput(
                user_id=user_id_str,
                task_id=tool_args.get("task_id"),
                title=tool_args.get("title", ""),
            )
            result = update_task_tool(input_data)

        elif tool_name == "delete_task":
            input_data = DeleteTaskInput(
                user_id=user_id_str,
                task_id=tool_args.get("task_id"),
                confirm=tool_args.get("confirm", False),
            )
            result = delete_task_tool(input_data)

        else:
            return {
                "ok": False,
                "message": f"Unknown tool: {tool_name}",
                "data": None,
            }

        return result.model_dump()

    except Exception as e:
        return {
            "ok": False,
            "message": f"Tool execution error: {str(e)}",
            "data": None,
        }


# ============================================================
# CONVERSATION HISTORY LOADING
# ============================================================

def load_conversation_history(
    session: Session,
    conversation_id: UUID,
    user_id: int,
) -> List[Dict[str, str]]:
    """
    Load conversation history from DB (stateless).

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Owner user ID

    Returns:
        List of message dicts in OpenAI format [{"role": "user/assistant", "content": "..."}]
    """
    messages = chat_repo.list_messages_for_conversation(
        session=session,
        conversation_id=conversation_id,
        user_id=user_id,
    )

    # Take last N messages to avoid context overflow
    messages = messages[-MAX_HISTORY_MESSAGES:]

    # Convert to OpenAI format
    return [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]


# ============================================================
# AGENT EXECUTION
# ============================================================

def run_agent(
    session: Session,
    conversation_id: UUID,
    user_id: int,
    user_message: str,
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Run the stateless AI agent using OpenAI Agents SDK.

    Workflow:
    1. Load conversation history from DB
    2. Append new user message
    3. Call OpenAI with tools
    4. Execute tools if requested (with identity injection)
    5. Return final response

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Authenticated user ID (from JWT)
        user_message: User's message

    Returns:
        Tuple of (assistant_response, tool_call_logs)
    """
    # Load conversation history
    history = load_conversation_history(session, conversation_id, user_id)

    # Build messages for AI
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": user_message},
    ]

    # Get tool definitions
    tools = get_tool_definitions()

    # Tool call logs for debugging/transparency
    tool_call_logs: List[Dict[str, Any]] = []

    # Multi-turn tool calling loop (max 5 iterations to prevent infinite loops)
    max_iterations = 5

    for iteration in range(max_iterations):
        # Call OpenAI API
        response = openai_client.chat.completions.create(
            model=AI_MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        assistant_message = response.choices[0].message

        # Check if AI wants to call tools
        if not assistant_message.tool_calls:
            # No tool calls - return final response
            final_content = assistant_message.content or ""
            return final_content, tool_call_logs

        # AI wants to call tools
        # Add assistant message to history
        messages.append({
            "role": "assistant",
            "content": assistant_message.content,
            "tool_calls": [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments,
                    },
                }
                for tc in assistant_message.tool_calls
            ],
        })

        # Execute each tool call
        for tool_call in assistant_message.tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)

            # Execute tool with identity injection
            tool_result = execute_tool(tool_name, tool_args, user_id)

            # Log tool call for transparency
            tool_call_logs.append({
                "tool": tool_name,
                "args": tool_args,
                "result": tool_result,
            })

            # Add tool result to messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(tool_result),
            })

    # If we hit max iterations, return a message
    return "I apologize, but I encountered too many tool calls. Please try rephrasing your request.", tool_call_logs
