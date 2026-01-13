# Phase III Plan — Nimbus AI Todo Chatbot

## Objective
Add an AI-powered chatbot interface that manages tasks via natural language using:
- OpenAI ChatKit (frontend UI)
- OpenAI Agents SDK (agent runner)
- Official MCP SDK (tool server)
- Neon Postgres (task + chat memory persistence)
- FastAPI stateless endpoint

## Constraints
- Must be stateless per request
- Chat memory must be persisted in DB (Conversation + Message)
- Agent cannot directly access DB; only MCP tools can mutate data
- Must preserve Phase II auth + owner-only isolation
- No Docker/K8s/Kafka/Dapr/bonus features

## Success Criteria
- User can add/list/complete/update/delete tasks via chat
- Server restart does not lose chat context
- Browser refresh restores chat history
- Destructive actions require confirmation
- Owner-only enforced for tasks and chat history
