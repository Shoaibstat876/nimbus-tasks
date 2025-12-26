import type { FilterMode, Task } from "./types";

export const TITLE_MAX = 200;

type Ok<T> = { ok: true; value: T };
type Err = { ok: false; error: string };

export function normalizeTitle(raw: string): Ok<string> | Err {
  const title = raw.trim();

  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  if (title.length > TITLE_MAX) {
    return { ok: false, error: `Max ${TITLE_MAX} characters.` };
  }

  return { ok: true, value: title };
}

function nowIso(): string {
  return new Date().toISOString();
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(list: Task[], titleRaw: string) {
  const v = normalizeTitle(titleRaw);

  if (!v.ok) {
    return { ok: false as const, error: v.error, tasks: list };
  }

  const now = nowIso();

  const task: Task = {
    id: uuid(),
    title: v.value,
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ok: true as const,
    tasks: [task, ...list],
  };
}

export function deleteTask(list: Task[], id: string): Task[] {
  return list.filter((t) => t.id !== id);
}

export function toggleTask(list: Task[], id: string): Task[] {
  const now = nowIso();

  return list.map((t) =>
    t.id === id
      ? { ...t, isCompleted: !t.isCompleted, updatedAt: now }
      : t
  );
}

export function editTask(list: Task[], id: string, titleRaw: string) {
  const v = normalizeTitle(titleRaw);

  if (!v.ok) {
    return { ok: false as const, error: v.error, tasks: list };
  }

  const now = nowIso();

  return {
    ok: true as const,
    tasks: list.map((t) =>
      t.id === id ? { ...t, title: v.value, updatedAt: now } : t
    ),
  };
}

export function applyFilter(list: Task[], mode: FilterMode): Task[] {
  if (mode === "active") {
    return list.filter((t) => !t.isCompleted);
  }

  if (mode === "completed") {
    return list.filter((t) => t.isCompleted);
  }

  return list;
}
