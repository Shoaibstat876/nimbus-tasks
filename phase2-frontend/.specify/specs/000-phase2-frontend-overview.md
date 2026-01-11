# 000 — Phase 2 Frontend Overview

## Goal
Provide a Next.js UI for Nimbus Tasks that supports login and owner-only task CRUD.

## In Scope
- Login page + token storage
- Tasks page: list/create/update/toggle/delete
- Loading/error/empty states
- Input validation for task titles
- Evidence artifacts

## Out of Scope (Phase 3+)
- RAG / chat / agents / MCP
- Kubernetes
- Admin dashboards / multi-tenant browsing

## Definition of Done
- User can login and see tasks for their account
- CRUD works end-to-end against live backend
- UI shows proper states (loading/error/empty)
- Evidence saved under `evidence/`
