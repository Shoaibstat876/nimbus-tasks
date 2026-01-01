# Tasks: Phase-1 In-Memory Python Console Todo

**Phase**: Hackathon 2 — Phase 1  
**Spec**: spec.md  
**Scope**: Python console app (in-memory only)

---

## Setup & Structure

- [x] Create project folder `hackathon2_phase1_python/`
- [x] Add `__init__.py` at project root
- [x] Create `app.py`
- [x] Create `store.py`
- [x] Create `skills/` directory
- [x] Add `__init__.py` inside `skills/`
- [x] Create `spec.md`
- [x] Create `README.md`

---

## Core User Story (P1): Add & View Tasks

- [x] Implement in-memory task list in `store.py`
- [x] Implement `add_task` skill in `skills/add_task.py`
- [x] Implement `list_tasks` skill in `skills/list_tasks.py`
- [x] Wire `add` and `list` commands in `app.py`
- [x] Validate empty or invalid input
- [x] Display tasks with id, title, and status

---

## User Story (P2): Toggle Task Completion

- [x] Implement `toggle_task` skill in `skills/toggle_task.py`
- [x] Update task completion status in memory
- [x] Wire `toggle <id>` command in `app.py`
- [x] Support `list active` and `list completed`

---

## User Story (P3): Update & Delete Tasks

- [x] Implement `update_task` skill in `skills/update_task.py`
- [x] Implement `delete_task` skill in `skills/delete_task.py`
- [x] Wire `update <id> <new title>` command in `app.py`
- [x] Wire `delete <id>` command in `app.py`
- [x] Handle “task not found” errors

---

## CLI & UX

- [x] Implement `help` command
- [x] Implement `exit` command
- [x] Ensure friendly error messages for invalid commands
- [x] Ensure tasks reset on app restart (in-memory confirmed)

---

## Verification

- [x] App runs with `python -m hackathon2_phase1_python.app`
- [x] All commands work end-to-end in terminal
- [x] No files created at runtime
- [x] No database or external dependencies used

---

## Final Status

- [x] Phase-1 COMPLETE
- [x] Ready for submission
