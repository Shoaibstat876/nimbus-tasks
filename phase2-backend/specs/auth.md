# Nimbus Tasks — Super Hybrid Spec (L2.2 Auth + Owner-Only CRUD)

## 0) Purpose
Deliver teacher-safe JWT authentication AND complete owner-only CRUD for Tasks.
No user can ever read or mutate another user’s tasks.
All behavior must be enforceable by backend checks (UI cannot bypass).

---

## 1) Definitions
- **current_user**: the authenticated user extracted from JWT.
- **Owned task**: a Task where `Task.user_id == current_user.id`.
- **Not found privacy**: if a task exists but is not owned by the current user, respond as if it does not exist.

---

## 2) Auth Method (Teacher-Safe)
- JWT Bearer authentication
- Stateless (no server sessions)
- Client header:
  `Authorization: Bearer <access_token>`

### JWT Rules
- Token contains user id in `sub`
- Expiry enforced
- Logout is client-side token deletion (server does not store sessions)

---

## 3) Data Models

### User (SQLModel)
Fields:
- `id: int` primary key
- `email: str` unique, indexed
- `hashed_password: str`
- `created_at: datetime`

### Task (SQLModel)
Fields:
- `id: int` primary key
- `title: str` required, max 80 after trim
- `is_completed: bool` default false
- `user_id: int` REQUIRED (never null after L2.2)
- `created_at: datetime`
- `updated_at: datetime`

---

## 4) Global Authorization Rules (MANDATORY)
- Unauthenticated request to any protected endpoint → **401**
- Authenticated user must never access any other user’s tasks
- Backend must enforce ownership checks (UI cannot bypass)

### Ownership Query Law (MANDATORY)
For any endpoint that fetches a task by id, the query MUST be:

`Task.id == id AND Task.user_id == current_user.id`

If not found → **404**  
(Do NOT reveal whether it belongs to another user.)

---

## 5) Validation Rules (MANDATORY)
Title validation on create/update:
- `title` is required
- `title.strip()` must not be empty
- max length: **80**
- If invalid → **400** with clear message

Timestamps:
- `created_at` set on create
- `updated_at` set on create
- `updated_at` MUST update on ANY mutation:
  - PUT update title
  - PATCH toggle
  - DELETE (update not required after delete, but mutation path must be owner-checked)

---

## 6) Endpoints

## 6.1 Auth
- `POST /api/auth/register`
  - creates user
- `POST /api/auth/login`
  - returns access_token (JWT)
- `POST /api/auth/logout`
  - client-side token deletion (endpoint may exist but is not required to store server state)
- `GET /api/auth/me`
  - returns current_user info

## 6.2 Tasks (ALL PROTECTED)
All Task routes require authentication.

### List (owner-only)
- `GET /api/tasks`
  - returns only tasks where `Task.user_id == current_user.id`
  - recommended: order by newest first
  - optional pagination: offset/limit

### Create (owned)
- `POST /api/tasks`
  - `Task.user_id = current_user.id` ALWAYS
  - validate title
  - set created_at, updated_at

### Read one (owner-only)
- `GET /api/tasks/{id}`
  - query must follow Ownership Query Law
  - if not found → 404

### Update title (owner-only)
- `PUT /api/tasks/{id}`
  - updates ONLY `title`
  - validate title
  - update `updated_at`
  - query must follow Ownership Query Law
  - if not found → 404

### Toggle complete (owner-only)
- `PATCH /api/tasks/{id}/toggle`
  - flips `is_completed`
  - update `updated_at`
  - query must follow Ownership Query Law
  - if not found → 404

### Delete (owner-only)
- `DELETE /api/tasks/{id}`
  - query must follow Ownership Query Law
  - if not found → 404
  - on success → 204 No Content (recommended)

---

## 7) Non-Goals (Explicitly Out of Scope)
- Refresh tokens
- Roles/permissions system
- Social login
- Email verification
- AI integration

---

## 8) Acceptance Checklist (Pass/Fail)
Auth:
- [ ] Protected endpoints return 401 without token
- [ ] JWT `sub` maps to valid user
- [ ] `/api/auth/me` returns correct user

Ownership:
- [ ] User A cannot list User B tasks
- [ ] User A cannot GET/PUT/PATCH/DELETE User B task id (must return 404)
- [ ] Task.user_id is never null after L2.2

CRUD:
- [ ] PUT updates title (validated, max 80, updated_at changes)
- [ ] PATCH toggle flips is_completed, updated_at changes
- [ ] DELETE removes task (204)

