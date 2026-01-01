# Feature Specification: Phase-1 In-Memory Python Console Todo

**Created**: 2025-12-27  
**Status**: Accepted  
**Phase**: Hackathon 2 — Phase 1

## User Scenarios & Testing (MANDATORY)

### User Story 1 — Add and View Tasks (Priority: P1)

As a user, I want to add todo tasks and list them so I can track what I need to do.

**Why this priority**:  
This is the core value of a todo application. Without this, the app has no purpose.

**Independent Test**:  
Can be fully tested by running the app, adding a task, and listing tasks.

**Acceptance Scenarios**:
1. **Given** the app is running, **When** I enter `add Buy milk`, **Then** the task is added.
2. **Given** tasks exist, **When** I enter `list`, **Then** all tasks are displayed.

---

### User Story 2 — Mark Tasks Complete (Priority: P2)

As a user, I want to mark tasks as completed so I know what is finished.

**Why this priority**:  
Task completion status is essential for basic task management.

**Independent Test**:  
Can be tested by toggling a task and listing completed tasks.

**Acceptance Scenarios**:
1. **Given** an existing task, **When** I enter `toggle <id>`, **Then** the task is marked completed.
2. **Given** completed tasks exist, **When** I enter `list completed`, **Then** only completed tasks are shown.

---

### User Story 3 — Modify and Remove Tasks (Priority: P3)

As a user, I want to update or delete tasks so I can correct or remove them.

**Why this priority**:  
Editing and deletion improve usability but are secondary to creation and listing.

**Independent Test**:  
Can be tested by updating a task title and deleting it.

**Acceptance Scenarios**:
1. **Given** a task exists, **When** I enter `update <id> New title`, **Then** the task title is updated.
2. **Given** a task exists, **When** I enter `delete <id>`, **Then** the task is removed.

---

## Edge Cases

- Invalid command entered → show help message
- Empty title on add/update → show validation error
- Non-existent task ID → show “Task not found”
- App restarted → tasks reset (in-memory behavior)

## Requirements (MANDATORY)

### Functional Requirements

- **FR-001**: System MUST allow users to add tasks via console.
- **FR-002**: System MUST list all tasks.
- **FR-003**: System MUST filter tasks by active or completed state.
- **FR-004**: System MUST allow updating task titles.
- **FR-005**: System MUST allow toggling task completion.
- **FR-006**: System MUST allow deleting tasks.
- **FR-007**: System MUST run entirely in memory with no persistence.

### Key Entities

- **Task**
  - id (string)
  - title (string)
  - is_completed (boolean)
  - created_at (timestamp)
  - updated_at (timestamp)

## Success Criteria (MANDATORY)

### Measurable Outcomes

- **SC-001**: User can add and list tasks in a single run.
- **SC-002**: User can toggle task completion successfully.
- **SC-003**: User can update and delete tasks without errors.
- **SC-004**: Application runs using `python -m hackathon2_phase1_python.app`.
- **SC-005**: No files or databases are created or used.
