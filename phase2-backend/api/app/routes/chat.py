# app/routes/chat.py

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session

from ..database import get_session
from ..models import User
from ..services import chat_repo, chat_agent
from .auth_routes import get_current_user


# ============================================================
# API SCHEMAS
# ============================================================

class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str


class ChatResponse(BaseModel):
    conversation_id: UUID
    response: str
    tool_calls: List[dict] = []


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat_endpoint(
    payload: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    """
    Chat endpoint with stateless, owner-only conversation persistence.

    Phase III Implementation:
    - Stateless: loads last N messages from DB on every request
    - Owner-only: enforces JWT-based user_id for all operations
    - Identity injection: injects auth user_id into tool calls (never trusts AI)
    - Tool calling: uses MCP tools for task management
    - Persistence: stores both user and assistant messages to DB

    Args:
        payload: ChatRequest with optional conversation_id and message
        session: Database session (injected)
        current_user: Authenticated user (injected via JWT)

    Returns:
        ChatResponse with conversation_id, assistant response, and tool call logs

    Raises:
        HTTPException 404: Conversation not found or not owned by user
        HTTPException 422: Validation error (handled by FastAPI)
    """
    conversation_id = payload.conversation_id

    # ============================================================
    # CONVERSATION HANDLING
    # ============================================================

    if conversation_id is None:
        # Create new conversation for this user
        conversation = chat_repo.create_conversation(
            session=session,
            user_id=current_user.id,
            title=None,  # Could be auto-generated from first message later
        )
        conversation_id = conversation.id

    else:
        # Verify conversation exists and belongs to current user
        conversation = chat_repo.get_conversation_for_user(
            session=session,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",  # Privacy-preserving message
            )

    # ============================================================
    # STORE USER MESSAGE
    # ============================================================

    user_message = chat_repo.add_message(
        session=session,
        conversation_id=conversation_id,
        user_id=current_user.id,
        role="user",
        content=payload.message,
    )

    if not user_message:
        # Should not happen since we verified conversation above
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store message",
        )

    # ============================================================
    # RUN AI AGENT (Stateless with Identity Injection)
    # ============================================================

    try:
        assistant_response, tool_call_logs = chat_agent.run_agent(
            session=session,
            conversation_id=conversation_id,
            user_id=current_user.id,  # Identity injection from JWT
            user_message=payload.message,
        )
    except Exception as e:
        # Log error and return graceful fallback
        assistant_response = f"I apologize, but I encountered an error: {str(e)}"
        tool_call_logs = []

    # ============================================================
    # STORE ASSISTANT RESPONSE IN DB
    # ============================================================

    assistant_message = chat_repo.add_message(
        session=session,
        conversation_id=conversation_id,
        user_id=current_user.id,
        role="assistant",
        content=assistant_response,
    )

    if not assistant_message:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store assistant response",
        )

    # ============================================================
    # RETURN RESPONSE
    # ============================================================

    return ChatResponse(
        conversation_id=conversation_id,
        response=assistant_response,
        tool_calls=tool_call_logs,
    )
