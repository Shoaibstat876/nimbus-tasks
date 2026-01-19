# app/services/chat_agent.py

"""
Stateless AI Agent for Phase III Chat
- Uses OpenAI SDK tool calling with MCP tool integration
- Loads conversation history from DB (stateless)
- Implements identity injection for user_id
- No in-memory state between requests

Safe additive hybrid:
- Optional preferred_language ("en"|"ur") accepted by run_agent (defaults to English)
- Heuristic Urdu detection if preferred_language missing (handled in language_router_skill)
- Intent hint (add/list/complete/update/delete) used only as prompt steering (NO behavior change)
- Reusable Intelligence: skills/ modules used (language_router_skill + task_intent_skill)
"""

import json
import os
from typing import Any, Dict, List, Tuple, Optional
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

# Reusable Intelligence (skills)
from .skills.language_router_skill import resolve_language
from .skills.task_intent_skill import detect_intent


# ============================================================
# CONFIGURATION
# ============================================================

MAX_HISTORY_MESSAGES = 50

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is required in .env")

AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

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
# SAFE ADDITIVE PROMPT STEERING (uses reusable skills)
# ============================================================

def build_system_prompt(preferred_language: Optional[str], user_message: str) -> str:
    """
    Language-aware system prompt that does NOT change tool behavior.
    Only affects the language of assistant responses.
    """
    lang = resolve_language(preferred_language, user_message)
    intent = detect_intent(user_message)

    if lang == "ur":
        return (
            SYSTEM_PROMPT
            + "\n\nLANGUAGE MODE: Urdu\n"
            + "You MUST respond in Urdu. Tool names/arguments remain unchanged.\n"
            + f"Intent hint (optional): {intent}\n"
        )

    return (
        SYSTEM_PROMPT
        + "\n\nLANGUAGE MODE: English\n"
        + f"Intent hint (optional): {intent}\n"
    )


# ============================================================
# TOOL DEFINITIONS
# ============================================================

def get_tool_definitions() -> List[Dict[str, Any]]:
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Task title (max 80 characters)"},
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
                        "task_id": {"type": "integer", "description": "Task ID to complete"},
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
                        "task_id": {"type": "integer", "description": "Task ID to update"},
                        "title": {"type": "string", "description": "New task title (max 80 characters)"},
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
                        "task_id": {"type": "integer", "description": "Task ID to delete"},
                        "confirm": {"type": "boolean", "description": "Confirmation flag (must be true)"},
                    },
                    "required": ["task_id", "confirm"],
                },
            },
        },
    ]


# ============================================================
# TOOL EXECUTION (Identity Injection)
# ============================================================

def execute_tool(tool_name: str, tool_args: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    """
    CRITICAL: user_id is derived from JWT by backend, never from AI.
    """
    user_id_str = str(user_id)

    try:
        if tool_name == "add_task":
            input_data = AddTaskInput(user_id=user_id_str, title=tool_args.get("title", ""))
            result = add_task_tool(input_data)

        elif tool_name == "list_tasks":
            input_data = ListTasksInput(user_id=user_id_str, status=tool_args.get("status", "all"))
            result = list_tasks_tool(input_data)

        elif tool_name == "complete_task":
            input_data = CompleteTaskInput(user_id=user_id_str, task_id=tool_args.get("task_id"))
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
            return {"ok": False, "message": f"Unknown tool: {tool_name}", "data": None}

        return result.model_dump()

    except Exception as e:
        return {"ok": False, "message": f"Tool execution error: {str(e)}", "data": None}


# ============================================================
# CONVERSATION HISTORY
# ============================================================

def load_conversation_history(session: Session, conversation_id: UUID, user_id: int) -> List[Dict[str, str]]:
    messages = chat_repo.list_messages_for_conversation(
        session=session,
        conversation_id=conversation_id,
        user_id=user_id,
    )

    messages = messages[-MAX_HISTORY_MESSAGES:]

    return [{"role": msg.role, "content": msg.content} for msg in messages]


# ============================================================
# AGENT EXECUTION
# ============================================================

def run_agent(
    session: Session,
    conversation_id: UUID,
    user_id: int,
    user_message: str,
    preferred_language: Optional[str] = None,
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    preferred_language:
      Optional "en" | "ur" (safe additive). If missing, fallback uses skill heuristic.
    """
    history = load_conversation_history(session, conversation_id, user_id)

    system_prompt = build_system_prompt(preferred_language, user_message)

    messages = [
        {"role": "system", "content": system_prompt},
        *history,
        {"role": "user", "content": user_message},
    ]

    tools = get_tool_definitions()
    tool_call_logs: List[Dict[str, Any]] = []

    max_iterations = 5

    for _ in range(max_iterations):
        response = openai_client.chat.completions.create(
            model=AI_MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        assistant_message = response.choices[0].message

        if not assistant_message.tool_calls:
            return (assistant_message.content or ""), tool_call_logs

        messages.append(
            {
                "role": "assistant",
                "content": assistant_message.content,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {"name": tc.function.name, "arguments": tc.function.arguments},
                    }
                    for tc in assistant_message.tool_calls
                ],
            }
        )

        for tool_call in assistant_message.tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)

            tool_result = execute_tool(tool_name, tool_args, user_id)

            tool_call_logs.append({"tool": tool_name, "args": tool_args, "result": tool_result})

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(tool_result),
                }
            )

    return (
        "I apologize, but I encountered too many tool calls. Please try rephrasing your request.",
        tool_call_logs,
    )
