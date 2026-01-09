# Ownership Gate — Masterpiece Terminal Playbook (Phase 2 Backend)

**Project:** Nimbus Tasks — Phase 2 Backend (FastAPI + SQLModel)  
**Goal:** Prove Owner-only access (Decision 001) with **two real users**  
**Method:** PowerShell-safe commands with **Terminal 1 (Server)** and **Terminal 2 (Client)**  
**Spec Rules:** No vibe coding, no guessing endpoints, evidence-first.

---

## Important Note (Windows PowerShell)
- In Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`.
- **Do NOT** use `curl -H ...` in PowerShell.
- Use **Invoke-RestMethod** for JSON + headers.
- If you want real curl, use `curl.exe`.

---

# Terminal 1 — SERVER (keep running)

## 1) Go to API folder
```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"


2) Activate venv
.\.venv\Scripts\Activate.ps1

3) Start server (do NOT close this terminal)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env


✅ Expected:

Uvicorn running on http://127.0.0.1:8000

Application startup complete.

Terminal 2 — CLIENT (all test commands run here)
0) Go to API folder (client terminal)
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"

1) Quick Health Check (optional relief)

Use real curl binary:

curl.exe -X GET "http://127.0.0.1:8000/api/health"


✅ Expected:

{"ok":true}

2) Register Two Users (A and B)
Register User A
Invoke-RestMethod `
  -Method POST `
  -Uri "http://127.0.0.1:8000/api/auth/register" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"owner.a@test.com","password":"pass1234"}'

Register User B
Invoke-RestMethod `
  -Method POST `
  -Uri "http://127.0.0.1:8000/api/auth/register" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"owner.b@test.com","password":"pass1234"}'


✅ Expected:

Either ok: True with id and email

Or "Email already registered" → still OK, continue.

3) Login Both Users and Capture Tokens
Login User A → store token
$A = Invoke-RestMethod `
  -Method POST `
  -Uri "http://127.0.0.1:8000/api/auth/login" `
  -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } `
  -Body "username=owner.a@test.com&password=pass1234"

$TOKEN_A = $A.access_token
$TOKEN_A

Login User B → store token
$B = Invoke-RestMethod `
  -Method POST `
  -Uri "http://127.0.0.1:8000/api/auth/login" `
  -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } `
  -Body "username=owner.b@test.com&password=pass1234"

$TOKEN_B = $B.access_token
$TOKEN_B


✅ Expected: token strings print.

4) User A Creates a Private Task
$T = Invoke-RestMethod `
  -Method POST `
  -Uri "http://127.0.0.1:8000/api/tasks" `
  -Headers @{ "Authorization" = "Bearer $TOKEN_A"; "Content-Type" = "application/json" } `
  -Body '{"title":"A private task"}'

$TASK_ID = $T.id
$TASK_ID


✅ Expected: a numeric task id prints (example: 8)

5) Ownership Attack Proof (User B vs User A task)
5A) User B tries UPDATE → must be 404
try {
  Invoke-RestMethod `
    -Method PUT `
    -Uri "http://127.0.0.1:8000/api/tasks/$TASK_ID" `
    -Headers @{ "Authorization" = "Bearer $TOKEN_B"; "Content-Type" = "application/json" } `
    -Body '{"title":"Hacked by B"}'
  "❌ Unexpected: update succeeded"
} catch {
  $_.Exception.Response.StatusCode.value__
}


✅ PASS output: 404

5B) User B tries TOGGLE → must be 404
try {
  Invoke-RestMethod `
    -Method PATCH `
    -Uri "http://127.0.0.1:8000/api/tasks/$TASK_ID/toggle" `
    -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
  "❌ Unexpected: toggle succeeded"
} catch {
  $_.Exception.Response.StatusCode.value__
}


✅ PASS output: 404

5C) User B tries DELETE → must be 404
try {
  Invoke-RestMethod `
    -Method DELETE `
    -Uri "http://127.0.0.1:8000/api/tasks/$TASK_ID" `
    -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
  "❌ Unexpected: delete succeeded"
} catch {
  $_.Exception.Response.StatusCode.value__
}


✅ PASS output: 404

6) List Isolation Proof
6A) User A list → MUST include the task
Invoke-RestMethod `
  -Method GET `
  -Uri "http://127.0.0.1:8000/api/tasks" `
  -Headers @{ "Authorization" = "Bearer $TOKEN_A" }


✅ PASS: shows items including id: $TASK_ID

6B) User B list → MUST be empty
$BTasks = Invoke-RestMethod `
  -Method GET `
  -Uri "http://127.0.0.1:8000/api/tasks" `
  -Headers @{ "Authorization" = "Bearer $TOKEN_B" }

@($BTasks) | ConvertTo-Json


✅ PASS expected:

[]

✅ Final Pass Criteria (Ownership Gate)

Ownership Gate is PASSED if all are true:

Update as B → 404

Toggle as B → 404

Delete as B → 404

List as A shows $TASK_ID

List as B returns []

This proves Decision 001: Owner-only data access enforced at query level.

Optional Cleanup (nice but not required)
Delete the created task as User A (optional)
Invoke-RestMethod `
  -Method DELETE `
  -Uri "http://127.0.0.1:8000/api/tasks/$TASK_ID" `
  -Headers @{ "Authorization" = "Bearer $TOKEN_A" }


Expected: (no output, 204)

Notes (for future you)

Always prefer Invoke-RestMethod in PowerShell.

Use curl.exe only for simple GETs if you like.

Do not touch evidence/ unless behavior changed.


---

If you want, I’ll also write a **second masterpiece** file:

✅ `docs/tests-gate-masterpiece.md`  
- Terminal 1/2, pytest commands, expected output, and where to store logs (Evidence Gate)

Just say “make tests gate masterpiece too”.