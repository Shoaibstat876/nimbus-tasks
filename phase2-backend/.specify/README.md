# .specify (Nimbus Phase 2 Backend)

This folder is the **single source of truth** for how we plan, spec, and document work in Phase 2 Backend.

## Structure
- `memory/`      → long-term context + decisions + glossary
- `templates/`   → ready-to-use markdown templates (spec, ADR, checkpoints, prompts)
- `scripts/`     → quick helpers to bootstrap and generate new docs

## Non-Negotiable Workflow
1) Write/Update Spec (templates/spec-template.md)
2) Convert Spec → Plan → Tasks
3) Implement
4) Log evidence + checkpoint
5) Only then mark a gate as DONE

## Gates (Phase 2 Backend)
- Auth gate (JWT/OAuth2PasswordBearer) ✅
- CRUD gate (create/update/toggle/delete/list) ✅
- Ownership gate (user can only see own tasks) ✅
- Tests gate (pytest pass) ✅
- Evidence gate (logs + screenshots) ✅
