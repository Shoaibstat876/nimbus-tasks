# Hackathon 2 — Phase 1 Development Guidelines

Last updated: 2025-12-27

## Active Technologies
- Python 3.x (standard library only)

## Project Structure
```text
hackathon2_phase1_python/
├── app.py
├── store.py
├── spec.md
├── README.md
└── skills/
    ├── add_task.py
    ├── list_tasks.py
    ├── update_task.py
    ├── toggle_task.py
    └── delete_task.py
## Commands
python -m hackathon2_phase1_python.app

## Code Style

Follow standard Python conventions (PEP 8 where reasonable)

Keep functions small and readable

No side effects in skills (no print / input)