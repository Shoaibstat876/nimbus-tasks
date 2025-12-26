# Tasks: Todo List MVP

**Feature**: Todo List MVP  
**Branch**: `001-todo-list`  
**Spec**: `specs/001-todo-list/spec.md`  
**Plan**: `specs/001-todo-list/plan.md`  
**Status**: Ready for implementation

## Execution Strategy (MVP-first)

- MVP demo = **US1 (CRUD) + persistence basics**.
- Then add **US2 (complete toggle)**, then **US3 (filters)**.
- Keep logic testable by centralizing core operations in a small pure module.

## Dependencies (Story Order)

US1 → US2 → US3 → Polish

---

## Phase 1 — Setup (project wiring)

- [ ] T001 Confirm Next.js app entry exists at apps/web (identify actual src/app or src/pages)
- [ ] T002 Create todo feature folder in apps/web/src/features/todos/ (create if missing)
- [ ] T003 [P] Create UI placeholder page route for Todo MVP in apps/web/src/app/todo/page.tsx (or pages/todo.tsx if pages router)
- [ ] T004 [P] Add simple navigation link to Todo page from existing entry (e.g., apps/web/src/app/page.tsx or apps/web/src/app/(marketing)/page.tsx)

---

## Phase 2 — Foundational (core model + persistence + tests)

- [ ] T005 Define Task + FilterMode types in apps/web/src/features/todos/types.ts
- [ ] T006 Implement pure task operations in apps/web/src/features/todos/taskStore.ts (create/edit/delete/toggle/filter helpers)
- [ ] T007 Implement local persistence adapter in apps/web/src/features/todos/storage.ts (load/save + safe parse + fallback)
- [ ] T008 Create lightweight unit tests for core logic in apps/web/src/features/todos/taskStore.test.ts
- [ ] T009 Create lightweight unit tests for storage fallback behavior in apps/web/src/features/todos/storage.test.ts
- [ ] T010 Wire a small hook/controller in apps/web/src/features/todos/useTodos.ts (connect taskStore + storage + React state)

---

## Phase 3 — User Story 1 (P1) CRUD: Create / Edit / Delete

**Goal**: Users can add, edit, and delete tasks.

- [ ] T011 [US1] Build Todo page shell in apps/web/src/app/todo/page.tsx (or pages/todo.tsx) using useTodos()
- [ ] T012 [P] [US1] Create AddTaskForm component in apps/web/src/features/todos/components/AddTaskForm.tsx
- [ ] T013 [P] [US1] Create TaskList component in apps/web/src/features/todos/components/TaskList.tsx
- [ ] T014 [P] [US1] Create TaskItem component in apps/web/src/features/todos/components/TaskItem.tsx
- [ ] T015 [US1] Implement “create task” UI behavior + validation messages (empty/whitespace + >200 chars) in AddTaskForm.tsx
- [ ] T016 [US1] Implement “delete task” UI behavior in TaskItem.tsx
- [ ] T017 [US1] Implement “edit task title” UI behavior (enter edit mode, save/cancel) in TaskItem.tsx
- [ ] T018 [US1] Ensure create/edit trims whitespace and rejects invalid title (match spec FR-002..FR-004) via taskStore.ts
- [ ] T019 [US1] Persist changes after create/edit/delete (ensure save triggers) via useTodos.ts + storage.ts
- [ ] T020 [US1] Empty state UI when no tasks exist in TaskList.tsx

**US1 Independent Test Criteria**
- Create a valid task → appears
- Edit title → updates
- Delete → removed
- Refresh page → tasks remain

---

## Phase 4 — User Story 2 (P2) Toggle Complete

**Goal**: Users can mark tasks completed and undo.

- [ ] T021 [US2] Add complete toggle control in TaskItem.tsx
- [ ] T022 [US2] Implement toggle behavior through useTodos.ts → taskStore.ts (no direct mutation)
- [ ] T023 [US2] Add clear “completed” visual distinction in TaskItem.tsx (text style + accessible state)
- [ ] T024 [US2] Persist completion changes via storage.ts (refresh keeps state)

**US2 Independent Test Criteria**
- Toggle active → completed and back
- Refresh page → completion state preserved

---

## Phase 5 — User Story 3 (P3) Filters All / Active / Completed

**Goal**: Users can filter visible tasks by mode.

- [ ] T025 [P] [US3] Create FilterBar component in apps/web/src/features/todos/components/FilterBar.tsx
- [ ] T026 [US3] Add filter state in useTodos.ts (default: all)
- [ ] T027 [US3] Implement filtering using taskStore.ts helper (All/Active/Completed)
- [ ] T028 [US3] Update Todo page to display filter + filtered list (page.tsx)
- [ ] T029 [US3] Ensure empty states are correct per filter (e.g., “No completed tasks”)

**US3 Independent Test Criteria**
- With mixed tasks: Active shows only active, Completed shows only completed, All shows all

---

## Phase 6 — Polish (quality + a11y + resilience)

- [ ] T030 Add keyboard accessibility for edit mode (Enter=save, Esc=cancel) in TaskItem.tsx
- [ ] T031 Ensure focus behavior is sensible (focus input on entering edit mode) in TaskItem.tsx
- [ ] T032 Add user-friendly notification when storage load fails (FR-012) in apps/web/src/app/todo/page.tsx (or equivalent)
- [ ] T033 Verify offline behavior (no network dependency) and remove any unnecessary calls
- [ ] T034 Update quickstart steps in specs/001-todo-list/quickstart.md (how to run + how to demo)
- [ ] T035 Final review: ensure all spec requirements FR-001..FR-012 are satisfied; update specs/001-todo-list/spec.md only if mismatched
