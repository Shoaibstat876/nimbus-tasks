9.2 specs/003-phase3-ai/db.chat-models.md (PASTE THIS)
# DB Spec — Phase III Chat Memory Models

## Tables

### Conversation
- id: UUID (PK)
- user_id: string (owner isolation)
- created_at: datetime
- updated_at: datetime

### Message
- id: UUID (PK)
- conversation_id: UUID (FK -> Conversation.id)
- user_id: string (owner isolation)
- role: "user" | "assistant"
- content: text
- created_at: datetime

## Rules
- Messages are always stored in DB (no RAM memory as source of truth)
- Only the authenticated user can access their conversations/messages
- Deleting tasks is allowed; deleting conversations is NOT required in Phase III

## Persistence Proof
- Restart backend → conversation continues using DB history
- Refresh UI → history can be reloaded by conversation_id
