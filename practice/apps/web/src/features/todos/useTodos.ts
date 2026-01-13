"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FilterMode, Task } from "./types";
import { applyFilter, createTask, deleteTask, editTask, toggleTask } from "./taskStore";
import { loadTasks, saveTasks } from "./storage";

type ActionOk = { ok: true };
type ActionErr = { ok: false; error: string };
type ActionResult = ActionOk | ActionErr;

function joinWarnings(...parts: Array<string | null | undefined>): string | null {
  const msg = parts
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" ");
  return msg.length ? msg : null;
}

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterMode>("all");

  // Keep warnings separated (different meaning + lifecycle)
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  const [hydrated, setHydrated] = useState(false);

  // Latest tasks snapshot (prevents stale-state bugs in add/edit while keeping ActionResult synchronous)
  const tasksRef = useRef<Task[]>([]);

  // --- Helpers ---
  const clearSaveWarning = useCallback(() => setSaveWarning(null), []);

  // Single helper: keeps React state + ref always in sync
  const setTasksSafe = useCallback((next: Task[] | ((prev: Task[]) => Task[])) => {
    setTasks((prev) => {
      const resolved = typeof next === "function" ? (next as (p: Task[]) => Task[])(prev) : next;
      tasksRef.current = resolved;
      return resolved;
    });
  }, []);

  // Hydrate from storage once
  useEffect(() => {
    const { tasks: loaded, warning: w } = loadTasks();
    setTasksSafe(loaded); // keep state + ref synced through one path
    setLoadWarning(w ?? null);
    setHydrated(true);
  }, [setTasksSafe]);

  // Persist only after hydration (prevents overwriting storage with [])
  useEffect(() => {
    if (!hydrated) return;

    const res = saveTasks(tasks);
    setSaveWarning(res.warning ?? null);
  }, [tasks, hydrated]);

  // Visible list based on filter
  const visible = useMemo(() => applyFilter(tasks, filter), [tasks, filter]);

  // Optional polish: if list becomes empty, reset filter to "all"
  useEffect(() => {
    if (!hydrated) return;
    if (tasks.length === 0 && filter !== "all") setFilter("all");
  }, [tasks.length, filter, hydrated]);

  // UI warning: join both if they exist (save first because it's usually actionable)
  const warning = useMemo(
    () => joinWarnings(saveWarning, loadWarning),
    [saveWarning, loadWarning]
  );

  // --- Actions (memoized for stable props to child components) ---
  const add = useCallback(
    (title: string): ActionResult => {
      const clean = title.trim();
      const res = createTask(tasksRef.current, clean);
      if (!res.ok) return { ok: false, error: res.error };

      setTasksSafe(res.tasks);
      clearSaveWarning();
      return { ok: true };
    },
    [clearSaveWarning, setTasksSafe]
  );

  const edit = useCallback(
    (id: string, title: string): ActionResult => {
      const clean = title.trim();
      const res = editTask(tasksRef.current, id, clean);
      if (!res.ok) return { ok: false, error: res.error };

      setTasksSafe(res.tasks);
      clearSaveWarning();
      return { ok: true };
    },
    [clearSaveWarning, setTasksSafe]
  );

  const remove = useCallback(
    (id: string) => {
      setTasksSafe((prev) => deleteTask(prev, id));
      clearSaveWarning();
    },
    [clearSaveWarning, setTasksSafe]
  );

  const toggle = useCallback(
    (id: string) => {
      setTasksSafe((prev) => toggleTask(prev, id));
      clearSaveWarning();
    },
    [clearSaveWarning, setTasksSafe]
  );

  return {
    tasks,
    visible,
    filter,
    setFilter,
    add,
    remove,
    toggle,
    edit,
    warning,
  };
}
