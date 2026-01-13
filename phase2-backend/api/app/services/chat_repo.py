# app/services/chat_repo.py

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from sqlmodel import Session, select

from ..models import Conversation, Message


# ============================================================
# CONVERSATION CRUD
# ============================================================

def create_conversation(
    session: Session,
    user_id: int,
    title: Optional[str] = None,
) -> Conversation:
    """
    Create a new conversation for the given user.

    Args:
        session: Database session
        user_id: Owner user ID
        title: Optional conversation title

    Returns:
        Created Conversation instance
    """
    conversation = Conversation(
        user_id=user_id,
        title=title,
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversation_for_user(
    session: Session,
    conversation_id: UUID,
    user_id: int,
) -> Optional[Conversation]:
    """
    Get a conversation by ID, enforcing owner-only access.

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Owner user ID (for isolation)

    Returns:
        Conversation instance if found and owned by user, else None
    """
    statement = (
        select(Conversation)
        .where(Conversation.id == conversation_id)
        .where(Conversation.user_id == user_id)  # Owner-only enforcement
    )
    return session.exec(statement).first()


def update_conversation_timestamp(
    session: Session,
    conversation_id: UUID,
    user_id: int,
) -> None:
    """
    Update the updated_at timestamp for a conversation.

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Owner user ID (for isolation)
    """
    conversation = get_conversation_for_user(session, conversation_id, user_id)
    if conversation:
        conversation.updated_at = datetime.now(timezone.utc)
        session.add(conversation)
        session.commit()


# ============================================================
# MESSAGE CRUD
# ============================================================

def list_messages_for_conversation(
    session: Session,
    conversation_id: UUID,
    user_id: int,
) -> List[Message]:
    """
    List all messages for a conversation, enforcing owner-only access.
    Messages are returned in chronological order (oldest first).

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Owner user ID (for isolation)

    Returns:
        List of Message instances ordered by created_at
    """
    # First verify the conversation exists and belongs to user
    conversation = get_conversation_for_user(session, conversation_id, user_id)
    if not conversation:
        return []

    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .where(Message.user_id == user_id)  # Owner-only enforcement
        .order_by(Message.created_at.asc())
    )
    return list(session.exec(statement).all())


def add_message(
    session: Session,
    conversation_id: UUID,
    user_id: int,
    role: str,
    content: str,
) -> Optional[Message]:
    """
    Add a message to a conversation, enforcing owner-only access.

    Args:
        session: Database session
        conversation_id: Conversation UUID
        user_id: Owner user ID (for isolation)
        role: Message role ("user" or "assistant")
        content: Message content text

    Returns:
        Created Message instance if successful, else None
    """
    # Verify the conversation exists and belongs to user
    conversation = get_conversation_for_user(session, conversation_id, user_id)
    if not conversation:
        return None

    message = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role=role,
        content=content,
    )
    session.add(message)
    session.commit()
    session.refresh(message)

    # Update conversation timestamp
    update_conversation_timestamp(session, conversation_id, user_id)

    return message
