# Feature Specification: Todo List MVP

**Feature Branch**: `001-todo-list`  
**Created**: 2025-12-26  
**Status**: Draft  
**Input**: User description: "Todo List MVP: users can add, edit, complete, delete tasks; filter tasks (all/active/completed); data persists."

## Overview

A simple single-user Todo List MVP that works offline and persists tasks on the same device.

### In Scope
- Create, edit, delete tasks
- Toggle complete/incomplete
- Filter tasks: All / Active / Completed
- Persist tasks locally so they survive refresh/reopen

### Out of Scope (explicit)
- Accounts/authentication, multi-user sync, sharing/collaboration
- Due dates, reminders, priorities, tags, search, sorting controls beyond defaults
- Cloud backup or cross-device sync

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Tasks (Create/Edit/Delete) (Priority: P1)

As a user, I want to create, edit, and delete tasks so I can maintain a simple list of things I need to do.

**Why this priority**: This is the core value of a todo app. Without this, nothing else matters.

**Independent Test**: Can be tested end-to-end by creating a task, editing it, and deleting it, verifying the list reflects each change.

**Acceptance Scenarios**:
1. **Given** an empty task list, **When** I add a task with a valid title, **Then** the task appears in the list.
2. **Given** an existing task, **When** I edit its title to another valid title, **Then** the updated title is shown for that same task.
3. **Given** an existing task, **When** I delete the task, **Then** it no longer appears in the list.

---

### User Story 2 - Mark Tasks Complete (Priority: P2)

As a user, I want to mark tasks as completed (and undo completion) so I can track what I finished.

**Why this priority**: Completion tracking is the next most important behavior after basic task creation.

**Independent Test**: Can be tested by toggling completion for a task and confirming the completion state changes and can be reversed.

**Acceptance Scenarios**:
1. **Given** an active task, **When** I mark it as completed, **Then** the task is shown as completed and its completion state is saved.
2. **Given** a completed task, **When** I mark it as active again, **Then** the task returns to active and its state is saved.

---

### User Story 3 - Filter Tasks (All / Active / Completed) (Priority: P3)

As a user, I want to filter tasks by All, Active, or Completed so I can focus on what I need.

**Why this priority**: Filtering improves usability and is a common MVP expectation, but the app still works without it.

**Independent Test**: Can be tested by creating both active and completed tasks and switching filters to confirm the correct set is visible.

**Acceptance Scenarios**:
1. **Given** I have both active and completed tasks, **When** I select "Active", **Then** only active tasks are shown.
2. **Given** I have both active and completed tasks, **When** I select "Completed", **Then** only completed tasks are shown.
3. **Given** I am viewing a filtered list, **When** I select "All", **Then** all tasks are shown.

---

## Edge Cases

- What happens when the user tries to create a task with an empty/whitespace-only title?
- What happens when the user edits a task to an empty/whitespace-only title?
- What happens when the user enters a very long title (e.g., >200 characters)?
- What happens when there are no tasks and the user switches filters?
- What happens when persisted data is missing/corrupted/unreadable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new task by providing a title.
- **FR-002**: System MUST trim leading/trailing whitespace from task titles on create and edit.
- **FR-003**: System MUST reject create/edit when the resulting title is empty (after trimming) and show a user-friendly message.
- **FR-004**: System MUST define and enforce a maximum task title length (default: 200 characters). If exceeded, creation/edit MUST be rejected with a user-friendly message.
- **FR-005**: System MUST allow users to edit an existing task’s title.
- **FR-006**: System MUST allow users to delete a task.
- **FR-007**: System MUST allow users to toggle a task’s completion state (active ↔ completed).
- **FR-008**: System MUST provide filtering modes: **All**, **Active**, **Completed**.
- **FR-009**: System MUST display tasks according to the selected filter mode.
- **FR-010**: System MUST persist tasks locally so tasks remain available after refresh/reopen.
- **FR-011**: System MUST load persisted tasks on startup (initial app load).
- **FR-012**: System MUST define behavior if persisted data cannot be loaded (default: start with an empty list and notify the user in a friendly way).

### Non-Functional Requirements

- **NFR-001 (Offline)**: The core MVP MUST work without network access.
- **NFR-002 (Accessibility)**: Interactive controls MUST be usable via keyboard and have clear focus indication.
- **NFR-003 (Usability)**: The UI MUST remain usable on both desktop and mobile screens.

### Key Entities *(include if feature involves data)*

- **Task**
  - Attributes: `id` (unique), `title` (text), `isCompleted` (boolean), `createdAt` (timestamp), `updatedAt` (timestamp)
- **FilterMode**
  - Values: `all`, `active`, `completed`

### Assumptions

- Tasks are single-user and stored on the same device/browser profile.
- Default display order is acceptable as long as it is consistent (no user-controlled sorting required).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can add their first task and see it in the list in under **30 seconds**.
- **SC-002**: Users can complete a full cycle (add → edit → complete → delete) without encountering an app-blocking failure in normal use.
- **SC-003**: Filter correctness is **100%** (Active shows only active; Completed shows only completed; All shows all).
- **SC-004**: After refresh/reopen, **100%** of previously saved tasks reappear in the same completion state (unless storage is unavailable/corrupted, in which case FR-012 applies).
