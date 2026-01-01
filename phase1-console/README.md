# Hackathon 2 — Phase 1 (In-Memory Python Console App)

**Title:** In-Memory Python Console App  
**Stack:** Python + Spec-first + reusable skills  
**Storage:** In-memory only (no DB, no files)

## Folder
This project lives here:
`hackathon2_phase1_python/`

## How to Run (Windows PowerShell)
Open terminal at:
`D:\Shoaib Project`

Run:
```powershell
python -m hackathon2_phase1_python.app
```

## Commands
- `add <title>` — Add a new task
- `list [all|active|completed]` — List tasks
- `update <id> <new title>` — Update task title
- `toggle <id>` — Toggle complete
- `delete <id>` — Delete task
- `help` — Show help
- `exit` — Exit app

## Demo Proof (what to show in terminal)
1. `add Buy milk`
2. `list`
3. Copy an id from list
4. `toggle <id>`
5. `list completed`
6. `update <id> Buy almond milk`
7. `delete <id>`
8. `list`
9. `exit`

## Notes
- Logic is separated into reusable skills under `skills/`
- `app.py` handles input/output only
- `store.py` holds in-memory tasks and helpers
