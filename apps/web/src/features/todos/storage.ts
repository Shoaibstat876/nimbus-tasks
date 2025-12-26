import type { Task } from "./types";

const KEY = "nimbus.todo.tasks.v1";
const MAX_TASKS = 200;

/* ---------- helpers ---------- */

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function isValidTaskShape(x: any): x is Partial<Task> {
  return x && typeof x === "object" && typeof x.id === "string" && typeof x.title === "string";
}

function normalizeTask(x: Partial<Task>): Task {
  const now = new Date().toISOString();

  return {
    id: String(x.id),
    title: String(x.title),
    isCompleted: Boolean(x.isCompleted),
    createdAt: typeof x.createdAt === "string" ? x.createdAt : now,
    updatedAt: typeof x.updatedAt === "string" ? x.updatedAt : now,
  };
}

function toTime(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function newestFirst(a: Task, b: Task): number {
  // Prefer updatedAt; fall back to createdAt
  const at = toTime(a.updatedAt || a.createdAt);
  const bt = toTime(b.updatedAt || b.createdAt);
  return bt - at;
}

function joinWarnings(...parts: Array<string | null | undefined>): string | undefined {
  const msg = parts.filter(Boolean).join(" ");
  return msg.length ? msg : undefined;
}

/* ---------- public API ---------- */

export function loadTasks(): { tasks: Task[]; warning?: string } {
  if (!hasStorage()) return { tasks: [], warning: "Storage unavailable." };

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { tasks: [] };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { tasks: [], warning: "Bad storage format. Resetting." };

    const normalizedAll = parsed.filter(isValidTaskShape).map(normalizeTask);

    const removedInvalid = normalizedAll.length !== parsed.length;

    // ensure consistent "keep newest" behavior
    const sorted = [...normalizedAll].sort(newestFirst);

    const trimmed = sorted.length > MAX_TASKS;
    const tasks = sorted.slice(0, MAX_TASKS);

    const warning = joinWarnings(
      removedInvalid ? "Some invalid tasks were removed." : null,
      trimmed ? `List was trimmed to the newest ${MAX_TASKS} tasks.` : null
    );

    return { tasks, warning };
  } catch {
    return { tasks: [], warning: "Storage corrupted. Started fresh." };
  }
}

/**
 * Save tasks. Returns optional warning if storage write fails.
 * (You can ignore the return value if you don't need UI warnings.)
 */
export function saveTasks(tasks: Task[]): { warning?: string } {
  if (!hasStorage()) return { warning: "Storage unavailable." };

  try {
    // enforce deterministic cap before saving
    const sorted = [...tasks].sort(newestFirst);
    const safe = sorted.slice(0, MAX_TASKS);

    localStorage.setItem(KEY, JSON.stringify(safe));

    // optional: tell caller we trimmed (useful if they pass > MAX_TASKS)
    if (safe.length !== tasks.length) {
      return { warning: `List was trimmed to the newest ${MAX_TASKS} tasks.` };
    }

    return {};
  } catch {
    return { warning: "Could not save tasks (storage blocked or full)." };
  }
}
