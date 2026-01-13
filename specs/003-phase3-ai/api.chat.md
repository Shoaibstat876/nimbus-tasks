
## Endpoint
POST /api/{user_id}/chat

## Authentication
- Requires Authorization: Bearer <token>
- Backend verifies token and derives auth_user_id
- auth_user_id must match {user_id} in the URL OR system enforces auth_user_id only

## Request Body
- conversation_id: string (optional UUID) — existing conversation
- message: string (required)

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
