# 020 — Tasks: Owner-only CRUD

## Goal
Authenticated user can manage their own tasks only.

## Features
- List tasks (newest first if backend supports)
- Create task
- Update task title
- Toggle completed
- Delete task

## Acceptance Criteria
- AC-001: All task requests go through `lib/services/apiClient.ts` (no fetch in components).
- AC-002: Tasks list only shows the current user’s tasks (owner-only UX).
- AC-003: If a task is missing OR not owned, UI behaves the same (404-style / not found).
- AC-004: Title validation happens before API calls.
- AC-005: Loading state shown while fetching tasks.
- AC-006: Empty state shown when user has zero tasks.
- AC-007: Error state shown when fetch/mutation fails (with retry).
- AC-008: Validation: title is trimmed, required, max 80 chars; friendly message; no request sent on invalid input.
- AC-009: Mutations (create/update/toggle/delete) update UI without full refresh.

## Evidence
- Screenshot: `evidence/screenshots/020-loading.png`
- Screenshot: `evidence/screenshots/020-empty.png`
- Screenshot: `evidence/screenshots/020-two-tasks.png`
- Screenshot: `evidence/screenshots/020-toggle.png`
- Screenshot: `evidence/screenshots/020-delete.png`
- Screenshot: `evidence/screenshots/020-validation-too-long.png`
- Screenshot: `evidence/screenshots/020-error-sta
