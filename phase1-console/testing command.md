- **Repo:** `nimbus-tasks`
- **Phase:** `phase1-console`

# Phase I — Testing Commands (Terminal Demo)

## 1) Go to Nimbus repo
```powershell
cd "D:\Shoaib Project\nimbus-tasks"


## 2) Option A (recommended): run by file path
python "phase1-console\app.py"


## 3) Option B: run as a module (only if needed)
python -m phase1-console.app

## Note: If Option B fails because of module naming rules, use Option A.

=== Hackathon 2 | Phase 1 — In-Memory Todo ===

Commands:
  add <title>                 Add a new task
  list [all|active|completed] List tasks
  update <id> <new title>     Update task title
  toggle <id>                 Toggle complete
  delete <id>                 Delete task
  help                        Show this help
  exit                        Exit the app

> add Buy milk
Task added.

> add Read book
Task added.

> list
1. [ ] bbcb4a90fea74064ac28498e4048d1d4 — Buy milk
2. [ ] e09ac6b62a6644fda8f93d812e581c7f — Read book

> toggle b794878c9687459e9112f3ca1add59ab
Task not found.

> toggle bbcb4a90fea74064ac28498e4048d1d4
Task marked completed.

> list completed
1. [x] bbcb4a90fea74064ac28498e4048d1d4 — Buy milk

> list active
1. [ ] e09ac6b62a6644fda8f93d812e581c7f — Read book

> update bbcb4a90fea74064ac28498e4048d1d4 Buy almond milk
Task updated.

> delete bbcb4a90fea74064ac28498e4048d1d4
Task deleted.

> exit
Goodbye.

