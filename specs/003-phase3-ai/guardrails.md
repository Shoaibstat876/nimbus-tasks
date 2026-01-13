# Guardrails — Phase III (L4.1 Reliability)

## Identity Injection
- Agent cannot be trusted with identity
- Backend injects auth_user_id into tool calls

## Ambiguity Protocol
If request is ambiguous, agent must ask clarifying question:
- "delete my task" -> list tasks -> ask which ID -> confirm -> delete
- "complete it" -> ask which task -> then complete

## Destructive Confirmation
Update/Delete must never happen silently.
Agent must:
1) Identify exact target
2) Ask "Confirm?" (Yes/No)
3) Only then call tool with confirm=true
