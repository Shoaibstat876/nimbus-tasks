#!/usr/bin/env pwsh
# Phase-1 (Hackathon 2) — Create/Validate Project Skeleton
# Replaces "create-new-feature" (NO git, NO branches, NO specs/<feature>, NO history/prompts)

[CmdletBinding()]
param(
    [switch]$Json,
    [string]$ProjectName = "hackathon2_phase1_python",
    [switch]$Force,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output @"
Usage: ./create-new-feature.ps1 [-Json] [-ProjectName <name>] [-Force]

Creates or validates the Hackathon 2 Phase-1 Python console app skeleton.

Defaults:
  ProjectName: hackathon2_phase1_python

What it creates:
  <ProjectName>/
    __init__.py
    app.py
    store.py
    spec.md
    README.md
    skills/
      __init__.py
      add_task.py
      list_tasks.py
      update_task.py
      toggle_task.py
      delete_task.py
"@
    exit 0
}

function Ensure-Dir {
    param([string]$Path)
    if (-not (Test-Path $Path -PathType Container)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Ensure-File {
    param([string]$Path, [string]$Content)
    if (Test-Path $Path -PathType Leaf) {
        if ($Force) {
            Set-Content -Path $Path -Value $Content -Encoding UTF8
        }
        return
    }
    Set-Content -Path $Path -Value $Content -Encoding UTF8
}

$root = (Get-Location).Path
$projectDir = Join-Path $root $ProjectName
$skillsDir  = Join-Path $projectDir "skills"

Ensure-Dir $projectDir
Ensure-Dir $skillsDir

# ---------- file contents (Phase-1 correct) ----------

$rootInit = @"
# Package marker for Hackathon 2 Phase 1
"@

$skillsInit = @"
# Skills package
"@

$storePy = @"
from datetime import datetime
import uuid

# In-memory storage
tasks = []


def now_iso() -> str:
    return datetime.utcnow().isoformat()


def generate_id() -> str:
    return uuid.uuid4().hex


def find_task(task_id: str):
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None
"@

$addTaskPy = @"
from ..store import tasks, generate_id, now_iso


def add_task(title: str):
    title = (title or "").strip()

    if not title:
        return False, "Title is required.", {}

    if len(title) > 80:
        return False, "Title too long (max 80).", {}

    task = {
        "id": generate_id(),
        "title": title,
        "is_completed": False,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }

    tasks.append(task)
    return True, "Task added.", task
"@

$listTasksPy = @"
from ..store import tasks


def list_tasks(filter_by="all"):
    filter_by = (filter_by or "all").lower()

    if filter_by not in ("all", "active", "completed"):
        return False, "Invalid filter. Use: all | active | completed.", []

    if filter_by == "all":
        return True, "OK", list(tasks)

    if filter_by == "active":
        return True, "OK", [t for t in tasks if not t["is_completed"]]

    return True, "OK", [t for t in tasks if t["is_completed"]]
"@

$updateTaskPy = @"
from ..store import find_task, now_iso


def update_task(task_id: str, new_title: str):
    task_id = (task_id or "").strip()
    new_title = (new_title or "").strip()

    if not task_id:
        return False, "Task id is required.", {}

    if not new_title:
        return False, "Title is required.", {}

    if len(new_title) > 80:
        return False, "Title too long (max 80).", {}

    task = find_task(task_id)
    if not task:
        return False, "Task not found.", {}

    task["title"] = new_title
    task["updated_at"] = now_iso()
    return True, "Task updated.", task
"@

$toggleTaskPy = @"
from ..store import find_task, now_iso


def toggle_task(task_id: str):
    task_id = (task_id or "").strip()

    if not task_id:
        return False, "Task id is required.", {}

    task = find_task(task_id)
    if not task:
        return False, "Task not found.", {}

    task["is_completed"] = not task["is_completed"]
    task["updated_at"] = now_iso()

    status = "completed" if task["is_completed"] else "active"
    return True, f"Task marked {status}.", task
"@

$deleteTaskPy = @"
from ..store import tasks, find_task


def delete_task(task_id: str):
    task_id = (task_id or "").strip()

    if not task_id:
        return False, "Task id is required."

    task = find_task(task_id)
    if not task:
        return False, "Task not found."

    tasks.remove(task)
    return True, "Task deleted."
"@

$appPy = @"
from .skills.add_task import add_task
from .skills.list_tasks import list_tasks
from .skills.update_task import update_task
from .skills.toggle_task import toggle_task
from .skills.delete_task import delete_task


def print_help():
    print("""
Commands:
  add <title>                 Add a new task
  list [all|active|completed] List tasks
  update <id> <new title>     Update task title
  toggle <id>                 Toggle complete
  delete <id>                 Delete task
  help                        Show this help
  exit                        Exit the app
""")


def print_tasks(items):
    if not items:
        print("No tasks.")
        return

    for i, task in enumerate(items, start=1):
        status = "[x]" if task["is_completed"] else "[ ]"
        print(f"{i}. {status} {task['id']} — {task['title']}")


def main():
    print("=== Hackathon 2 | Phase 1 — In-Memory Todo ===")
    print()
    print_help()

    while True:
        try:
            raw = input("> ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\\nGoodbye.")
            break

        if not raw:
            continue

        cmd, *rest = raw.split(" ", 1)
        cmd = cmd.lower()
        arg = rest[0] if rest else ""

        if cmd == "exit":
            print("Goodbye.")
            break

        if cmd == "help":
            print_help()
            continue

        if cmd == "add":
            if not arg.strip():
                print("Usage: add <title>")
                continue
            ok, msg, _ = add_task(arg)
            print(msg)
            continue

        if cmd == "list":
            mode = arg.strip() if arg.strip() else "all"
            ok, msg, items = list_tasks(mode)
            if not ok:
                print(msg)
            else:
                print_tasks(items)
            continue

        if cmd == "update":
            if not arg.strip() or " " -notin $arg:
                print("Usage: update <id> <new title>")
                continue
            tid, title = arg.split(" ", 2)
            ok, msg, _ = update_task(tid, title)
            print(msg)
            continue

        if cmd == "toggle":
            if not arg.strip():
                print("Usage: toggle <id>")
                continue
            ok, msg, _ = toggle_task(arg)
            print(msg)
            continue

        if cmd == "delete":
            if not arg.strip():
                print("Usage: delete <id>")
                continue
            ok, msg = delete_task(arg)
            print(msg)
            continue

        print("Unknown command. Type 'help' to see commands.")


if __name__ == "__main__":
    main()
"@

$specMd = @"
# Hackathon 2 — Phase 1 Spec

## Goal
Build a Python in-memory console todo app using spec-first and reusable skills.

## Commands
- add
- list (all / active / completed)
- update
- toggle
- delete
- help
- exit

## Rules
- In-memory only
- No files, DB, web, AI
- Skills contain logic
- app.py handles I/O only
"@

$readmeMd = @"
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
