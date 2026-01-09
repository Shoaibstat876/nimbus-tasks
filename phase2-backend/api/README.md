# Nimbus Tasks API – Phase 2 Backend

## 📝 Overview
Nimbus Tasks API is a secure FastAPI backend built for **Hackathon 2 – Phase 2**. It provides robust authentication, task management with strict ownership enforcement, and automated testing.

This backend is designed using **Spec-Driven Development** and follows the **teacher-approved architecture** for the GIAIC / Panaversity curriculum.

---

## 🚀 Tech Stack
* **Framework:** Python 3.12, FastAPI
* **Database:** SQLModel (ORM), SQLite
* **Security:** OAuth2 Password Flow with JWT Tokens
* **Testing:** Pytest

---

## ✨ Features

### 🔐 Authentication
* User login using OAuth2 Password flow.
* Secure password hashing.
* JWT-based access tokens for session management.
* Protected `/api/auth/me` endpoint to verify current user.

### ✅ Task Management
* **Create Task:** Users can create personal tasks.
* **List Tasks:** Returns **only** tasks owned by the authenticated user.
* **Update/Toggle:** Modify task details or mark them as complete.
* **Delete Task:** Remove tasks from the database.
* **Security:** Ownership is enforced at the query level (Users cannot see/edit others' tasks).

---

## 📁 Project Structure
```text
api/
├── app/
│   ├── main.py            # Application entry point
│   ├── database.py        # Engine and session configuration
│   ├── models.py          # SQLModel schemas (User, Task)
│   ├── auth.py            # JWT and Password logic
│   └── routes/
│       ├── auth_routes.py # Login & Me endpoints
│       ├── tasks.py       # Task CRUD endpoints
│       └── health.py      # Basic API status check
├── tests/
│   ├── conftest.py        # Test fixtures & DB setup
│   ├── test_health.py     
│   ├── test_auth.py       
│   └── test_tasks.py      
├── .env                   # Environment variables
└── README.md

## Environment Variables
Create a `.env` file inside `api/` with the following:
```text
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_... (your neon link)
JWT_SECRET=Shoaib-Super-Secret-Key-2026

## 🛠 How to Run (Windows PowerShell)
```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env

## swagger ui : http://127.0.0.1:8000/docs


---

## What to do with Code A (your “laws”)
Keep Code A as **root** `CLAUDE.md` (or root `README.md`, but I recommend `CLAUDE.md`).

So you’ll have:
- **Root `CLAUDE.md`** = rules / workflow / evidence / checkpoints  
- **`api/README.md`** = run commands / endpoints / tests

That pairing is *exactly* what prevents confusion later.

If you want, paste your current **root** `README.md` / `CLAUDE.md` contents and I’ll tell you which one should be the “law doc” and which one should be minimal.
