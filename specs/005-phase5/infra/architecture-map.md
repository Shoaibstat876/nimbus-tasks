# Phase V Architecture Map (Teacher-Exact)

## Core Services (Minimum viable)
1) **frontend** (Next.js)
2) **backend** (FastAPI + Auth + Task APIs + Chat/MCP tools)
3) **worker** (FastAPI or Python service)
   - consumes Kafka events
   - handles recurring + reminder processing

## External Dependencies
- Neon PostgreSQL (external DB)
- Kafka broker (Recommended: Redpanda Cloud serverless)

## Dapr Sidecars
Dapr runs as a sidecar for:
- backend pod
- worker pod
(optional: frontend pod if you want service invocation through Dapr)

## Dapr Building Blocks Used
1) Pub/Sub (Kafka)
- backend publishes task-events
- worker subscribes and processes

2) State
- minimal: store last-run marker for reminder scan OR idempotency keys

3) Bindings (cron)
- triggers reminder scan every N minutes

4) Secrets
- Kafka credentials
- Neon DB URL (optional)
- any API keys

5) Service Invocation
- at least one demonstrated path:
  - backend invokes worker method via Dapr
  OR
  - worker invokes backend method via Dapr

## Topics (Minimum)
- task-events
- reminders

## Event Flow
- Create/Update/Complete/Delete task → backend publishes to task-events
- Due date reminder scan (cron) → publish reminders event
- Worker consumes events:
  - recurring: on task.completed with recurrence -> create next occurrence
  - reminders: send/log notification action

## Proof expectations
- logs showing publish + consume
- kubectl showing dapr installed
- components applied
- cloud ingress reachable
