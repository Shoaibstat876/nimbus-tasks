# 010 — Auth: Login + Token Flow

## Goal
User can login, store token, and access protected pages.

## UX
- Login form: email + password
- On success: store token and navigate to Tasks
- On failure: show error message (no crash)

## Acceptance Criteria
- Token stored only via `lib/services/auth.ts`
- API calls attach `Authorization: Bearer <token>`
- Logout clears token and returns to login

## Evidence
- Screenshot: login page
- Screenshot: successful login → tasks loaded
- Log or note: token present and used for API calls
