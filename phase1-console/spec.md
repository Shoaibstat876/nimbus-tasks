# Hackathon 2 — Phase 1 Spec
**Title:** In-Memory Python Console App  
**Stack:** Python + Claude Code + Spec-Kit Plus  
**Storage:** In-memory only (no DB, no files required)  

## 1) Goal
Build a small Python console todo app that supports:
- Add task
- List tasks
- Update task title
- Delete task
- Toggle complete
- Basic filtering (optional: all/active/completed)

This phase proves:
- Spec-first discipline
- Reusable “skills” functions
- Clean console flow + validation

## 2) Non-Goals
- No web UI
- No database
- No authentication
- No AI chatbot
- No networking
- No complex frameworks

## 3) Data Model
### Task
- `id` (string): unique id for the task
- `title` (string): trimmed, 1–80 chars
- `is_completed` (bool): default False
- `created_at` (string ISO): optional (nice to have)
- `updated_at` (string ISO): optional (nice to have)

## 4) In-Memory Storage
- Store tasks in a single list in memory:
  - `tasks: list[Task]`
- Tasks exist only during program runtime.
- When app exits, tasks are lost (this is expected).

## 5) Commands (User Stories)
### 5.1 Add
**Input:** title  
**Rules:**
- Trim whitespace
- Title required
- Max 80 chars
**Output:** success message + created task id

### 5.2 List
**Input:** optional filter = `all | active | completed`
**Output:** numbered list showing:
- [ ] / [x]
- id (short or full)
- title

### 5.3 Update Title
**Input:** id + new title  
**Rules:** same validation as Add  
**Output:** success message

### 5.4 Delete
**Input:** id  
**Output:** success message

### 5.5 Toggle Complete
**Input:** id  
**Output:** success message + new status

## 6) Validation & Errors
- If user enters an unknown command: show help
- If id not found: show `"Task not found"`
- If title invalid: show `"Title is required"` or `"Title too long (max 80)"`

## 7) Console UX
- App runs in a loop until user chooses Exit.
- Show a simple menu every cycle or accept commands.
- Must be usable with only keyboard input.

## 8) Reusable Intelligence Requirement
Implement logic as reusable skills (pure functions) separate from UI loop.

Planned structure:
- `store.py` (holds tasks list + helper find)
- `skills/`:
  - `add_task.py`
  - `list_tasks.py`
  - `update_task.py`
  - `delete_task.py`
  - `toggle_task.py`
- `app.py` (console loop; calls skills only)

## 9) Demo Proof (What we will show)
In terminal:
1) Add 2 tasks
2) List all
3) Toggle one complete
4) List completed
5) Update a title
6) Delete a task
7) List all again

## 10) Acceptance Checklist
- [ ] Runs with `python app.py`
- [ ] All 5 actions work: add/list/update/delete/toggle
- [ ] In-memory only
- [ ] Skills separated from console UI
- [ ] Clear messages + basic validation
