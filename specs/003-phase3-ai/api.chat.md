## 🚀 SUPER HYBRID (Phase III — Final Spec)

### Purpose
A single, authoritative contract that combines:
- Stateless agent execution
- DB-persisted conversational memory
- Owner-only access control (404 isolation)
- Token-derived identity (single source of truth)
- Optional tool-call logging

This spec is the **only source of truth** for Phase III chat behavior.

---

# 1) CHAT — Stateless Agent Loop

## Endpoint
POST /api/chat

> Identity is always derived from the JWT.  
> No user_id is accepted in the URL or request body.

---

## Authentication
- Requires `Authorization: Bearer <token>`
- Backend verifies JWT and derives `auth_user_id`
- Never trust any client-provided identity

---

## Request Body
- `conversation_id`: string (optional UUID)
  - If provided → continue an existing conversation
  - If omitted or null → backend creates a new conversation owned by `auth_user_id`
- `message`: string (required)
  - Must be trimmed and non-empty

### Example Request
```json
{
  "conversation_id": "0f9c3a2e-7b34-4d6b-9d3d-9f5e7f1b2a3c",
  "message": "delete task 12"
}



## Response Body
- conversation_id: string (UUID)
- response: string (assistant reply)
- tool_calls: array (tool call logs)

## Stateless Behavior
Each request must:
1) Load last N messages from DB using conversation_id
2) Append new user message
3) Run agent
4) Store user + assistant messages to DB
5) Return response
Server holds NO in-memory session between calls

# 2) GET CHAT HISTORY (Read-only)

## Endpoint
GET /api/chat/history/{conversation_id}

## Authentication
- Requires `Authorization: Bearer <token>`
- Backend verifies JWT and derives `auth_user_id`

## Authorization (Owner-only)
- The conversation must exist AND belong to `auth_user_id`
- Otherwise return **404 Not Found**

## Response Body
- `conversation_id`: string (UUID)
- `messages`: array ordered **oldest → newest**
  - `{ "role": "user" | "assistant", "content": "string", "created_at": "ISO8601" }`
