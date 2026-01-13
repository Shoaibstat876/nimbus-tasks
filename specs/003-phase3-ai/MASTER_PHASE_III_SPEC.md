# Nimbus — Phase 3 Master Spec (Single Source of Truth)

Goal: AI Todo Chatbot using ChatKit + OpenAI Agents SDK + Official MCP SDK.

Non-negotiables:
- Stateless per request
- DB-persisted memory (Neon)
- Owner-only isolation for tasks + chat data
- Confirmation before destructive actions
- No Docker/K8s/Helm/Minikube
- No Kafka/Dapr
- No RAM-only memory or local JSON memory

References:
- plan.md
- db.chat-models.md
- api.chat.md
- api.mcp-tools.md
- guardrails.md
- tasks.md
- phase3-gate-checklist.md
- demo-script-90s.md
