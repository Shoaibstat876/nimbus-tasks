# app/routes/chat_history.py

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session

from ..database import get_session
from ..models import User
from ..services import chat_repo
from .auth_routes import get_current_user


# ============================================================
# API SCHEMAS
# ============================================================

class MessageRead(BaseModel):
    role: str
    content: str
    created_at: str


class ChatHistoryResponse(BaseModel):
    conversation_id: UUID
    messages: List[MessageRead]


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/history/{conversation_id}", response_model=ChatHistoryResponse, status_code=status.HTTP_200_OK)
def get_chat_history(
    conversation_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ChatHistoryResponse:
    """
    Get chat history for a specific conversation.

    Phase III Implementation:
    - Read-only: no database mutations
    - Owner-only: returns 404 if conversation doesn't exist or doesn't belong to user
    - JWT-based: derives user identity from Authorization header
    - Ordered: returns messages oldest -> newest

    Args:
        conversation_id: UUID of the conversation
        session: Database session (injected)
        current_user: Authenticated user (injected via JWT)

    Returns:
        ChatHistoryResponse with conversation_id and ordered messages

    Raises:
        HTTPException 404: Conversation not found or not owned by user
    """
    # ============================================================
    # OWNER-ONLY VERIFICATION
    # ============================================================

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
    # LOAD MESSAGES (Ordered oldest -> newest)
    # ============================================================

    messages = chat_repo.list_messages_for_conversation(
        session=session,
        conversation_id=conversation_id,
        user_id=current_user.id,
    )

    # ============================================================
    # FORMAT RESPONSE
    # ============================================================

    message_reads = [
        MessageRead(
            role=msg.role,
            content=msg.content,
          created_at=(msg.created_at.isoformat() if msg.created_at else ""),

        )
        for msg in messages
    ]

    return ChatHistoryResponse(
        conversation_id=conversation_id,
        messages=message_reads,
    )
