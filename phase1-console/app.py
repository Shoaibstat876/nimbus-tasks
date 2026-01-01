"""
Console UI loop for Hackathon 2 — Phase 1.

Rules:
- This file handles input/output only.
- All business logic lives in skills/.
- In-memory only (no files, no DB).
"""

from skills.add_task import add_task
from skills.list_tasks import list_tasks
from skills.update_task import update_task
from skills.delete_task import delete_task
from skills.toggle_task import toggle_task


def print_help() -> None:
    print(
        """
Commands:
  add <title>                 Add a new task
  list [all|active|completed] List tasks
  update <id> <new title>     Update task title
  toggle <id>                 Toggle complete
  delete <id>                 Delete task
  help                        Show this help
  exit                        Exit the app
"""
    )


def print_tasks(items) -> None:
    if not items:
        print("No tasks.")
        return

    for idx, t in enumerate(items, start=1):
        status = "[x]" if bool(t.get("is_completed")) else "[ ]"
        print(f"{idx}. {status} {t.get('id')} — {t.get('title')}")


def main() -> None:
    print("=== Hackathon 2 | Phase 1 — In-Memory Todo ===")
    print_help()

    while True:
        try:
            raw = input("\n> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if not raw:
            continue

        parts = raw.split(" ", 1)
        cmd = parts[0].lower()
        arg = parts[1] if len(parts) > 1 else ""

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
            if not arg.strip() or " " not in arg:
                print("Usage: update <id> <new title>")
                continue
            tid, new_title = arg.split(" ", 1)
            ok, msg, _ = update_task(tid, new_title)
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
