"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { clearToken, getToken } from "../../lib/services/auth";
import { AIFloat } from "../components/AIFloat";

type Task = {
  id: number;
  title: string;
  is_completed: boolean;
};

type Me = { id: number; email: string };
type BusyGlobal = "refresh" | "add" | "save" | null;

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--muted)",
      }}
    >
      {children}
    </span>
  );
}

function Pill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="mt-0.5 font-semibold" style={{ color: "var(--text)" }}>
        {value}
      </div>
    </div>
  );
}

const TITLE_MAX = 80;

function getStatus(e: unknown): number | null {
  if (typeof e === "object" && e !== null && "status" in e) {
    const v = (e as { status?: unknown }).status;
    return typeof v === "number" ? v : null;
  }
  if (e instanceof Error) {
    const m = e.message.trim();
    const n = Number(m.slice(0, 3));
    if (!Number.isNaN(n) && n >= 100 && n <= 599) return n;
  }
  return null;
}

function niceError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

function validateTitle(raw: string): string | null {
  const cleaned = raw.trim();
  if (!cleaned) return "Title is required.";
  if (cleaned.length > TITLE_MAX) return `Title too long (max ${TITLE_MAX} characters).`;
  return null;
}

export default function TasksPage() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Create
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  // Update
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // UI states
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");

  // Busy states
  const [busyGlobal, setBusyGlobal] = useState<BusyGlobal>(null);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);

  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.length - completedCount, [tasks]);

  const redirectToLogin = useCallback(
    (message: string) => {
      clearToken();
      setMe(null);
      setTasks([]);
      setErrorMsg(null);
      setStatus(message);
      router.replace("/login");
    },
    [router]
  );

  const showNotFoundStyle = useCallback((message: string) => {
    setMe(null);
    setTasks([]);
    setErrorMsg(message);
    setStatus("Not found");
  }, []);

  const refresh = useCallback(async () => {
    setBusyGlobal("refresh");
    setStatus("Loading /me + tasks...");
    setErrorMsg(null);

    if (!getToken()) {
      redirectToLogin("Please login to continue.");
      setInitialLoading(false);
      setBusyGlobal(null);
      return;
    }

    try {
      const who = await api.me();
      setMe(who);

      const list = await api.listTasks();
      setTasks(list);

      setStatus("Loaded");
    } catch (e) {
      setMe(null);
      setTasks([]);

      const st = getStatus(e);

      if (st === 401) {
        redirectToLogin("Session expired. Redirecting to login...");
        return;
      }

      if (st === 403 || st === 404) {
        showNotFoundStyle("This page is not available.");
        return;
      }

      setErrorMsg(`Could not load tasks. ${niceError(e)}`);
      setStatus("Error");
    } finally {
      setBusyGlobal(null);
      setInitialLoading(false);
    }
  }, [redirectToLogin, showNotFoundStyle]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTask = useCallback(async () => {
    const err = validateTitle(title);
    setTitleError(err);
    if (err) {
      setStatus("Fix the title error and try again.");
      return;
    }

    setBusyGlobal("add");
    setStatus("Creating task...");
    setErrorMsg(null);

    try {
      await api.createTask(title.trim());
      setTitle("");
      setTitleError(null);
      setStatus("Created. Refreshing...");
      await refresh();
    } catch (e) {
      const st = getStatus(e);
      if (st === 401) return redirectToLogin("Session expired. Redirecting to login...");
      if (st === 403 || st === 404) return showNotFoundStyle("This action is not available.");
      setErrorMsg(`Create failed. ${niceError(e)}`);
      setStatus("Error");
    } finally {
      setBusyGlobal(null);
    }
  }, [title, refresh, redirectToLogin, showNotFoundStyle]);

  const startEdit = useCallback((t: Task) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditError(null);
  }, []);

  const saveEdit = useCallback(
    async (id: number) => {
      const err = validateTitle(editTitle);
      setEditError(err);
      if (err) return;

      setBusyGlobal("save");
      setStatus("Saving...");
      setErrorMsg(null);

      try {
        await api.updateTask(id, editTitle.trim());
        cancelEdit();
        setStatus("Saved. Refreshing...");
        await refresh();
      } catch (e) {
        const st = getStatus(e);
        if (st === 401) return redirectToLogin("Session expired. Redirecting to login...");
        if (st === 403 || st === 404) return showNotFoundStyle("This action is not available.");
        setErrorMsg(`Update failed. ${niceError(e)}`);
        setStatus("Error");
      } finally {
        setBusyGlobal(null);
      }
    },
    [editTitle, cancelEdit, refresh, redirectToLogin, showNotFoundStyle]
  );

  const toggleTask = useCallback(
    async (id: number) => {
      setBusyTaskId(id);
      setStatus("Toggling...");
      setErrorMsg(null);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t))
      );

      try {
        await api.toggleTask(id);
        setStatus("Toggled. Refreshing...");
        await refresh();
      } catch (e) {
        const st = getStatus(e);
        if (st === 401) return redirectToLogin("Session expired. Redirecting to login...");
        if (st === 403 || st === 404) return showNotFoundStyle("This action is not available.");
        setErrorMsg(`Toggle failed. ${niceError(e)}`);
        setStatus("Error");
        await refresh();
      } finally {
        setBusyTaskId(null);
      }
    },
    [refresh, redirectToLogin, showNotFoundStyle]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      setBusyTaskId(id);
      setStatus("Deleting...");
      setErrorMsg(null);

      const before = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        await api.deleteTask(id);
        setStatus("Deleted. Refreshing...");
        await refresh();
      } catch (e) {
        const st = getStatus(e);
        if (st === 401) return redirectToLogin("Session expired. Redirecting to login...");
        if (st === 403 || st === 404) return showNotFoundStyle("This action is not available.");
        setTasks(before);
        setErrorMsg(`Delete failed. ${niceError(e)}`);
        setStatus("Error");
        await refresh();
      } finally {
        setBusyTaskId(null);
      }
    },
    [tasks, refresh, redirectToLogin, showNotFoundStyle]
  );

  const isDisabled = busyGlobal !== null || busyTaskId !== null;

  if (!initialLoading && !me) return null;

  const card = "rounded-3xl border bg-[var(--surface)] shadow-sm";
  const mutedPanel = "rounded-2xl border px-4 py-3 text-sm";
  const input =
    "h-12 w-full rounded-2xl border bg-[var(--surface)] px-4 text-sm outline-none disabled:opacity-60";
  const btn =
    "h-12 rounded-2xl px-5 text-sm font-medium shadow-sm transition-colors disabled:opacity-60";
  const btnOutline = `${btn} border bg-[var(--surface)] hover:bg-[var(--surface-2)]`;
  const btnPrimary = `${btn} text-white hover:opacity-95`;

  // Row-sized controls (for list edit mode)
  const rowInput =
    "h-11 w-full rounded-2xl border bg-[var(--surface)] px-4 text-sm outline-none disabled:opacity-60";
  const rowBtn =
    "h-11 rounded-2xl px-4 text-sm font-medium shadow-sm transition-colors disabled:opacity-60";
  const rowBtnOutline = `${rowBtn} border bg-[var(--surface)] hover:bg-[var(--surface-2)]`;
  const rowBtnPrimary = `${rowBtn} text-white hover:opacity-95`;

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-20 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Tasks
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Owner-only isolation + CRUD proof.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refresh}
              disabled={isDisabled}
              className={btnOutline}
              style={{ borderColor: "var(--border)" }}
            >
              {busyGlobal === "refresh" ? "Refreshing..." : "Refresh"}
            </button>
            <div className="hidden sm:block">
              <Badge>Status: {status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Page Body */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile status */}
        <div className="sm:hidden mb-4">
          <div
            className={mutedPanel}
            style={{
              borderColor: "var(--border)",
              background: "var(--surface-2)",
              color: "var(--muted)",
            }}
          >
            Status:{" "}
            <span className="font-semibold" style={{ color: "var(--text)" }}>
              {status}
            </span>
          </div>
        </div>

        {/* Error */}
        {errorMsg ? (
          <div
            className="rounded-2xl border px-4 py-4 text-sm mb-6"
            style={{
              borderColor: "var(--danger-border)",
              background: "var(--danger-bg)",
              color: "var(--danger-text)",
            }}
          >
            <div className="font-semibold">Something went wrong</div>
            <div className="mt-1">{errorMsg}</div>
            <button
              onClick={refresh}
              disabled={isDisabled}
              className="mt-3 h-10 rounded-2xl border bg-[var(--surface)] px-4 text-sm font-medium shadow-sm hover:bg-[var(--danger-hover)] disabled:opacity-60"
              style={{ borderColor: "var(--danger-border)", color: "var(--danger-text)" }}
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* Two-column on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Rail */}
          <section className="lg:col-span-4 space-y-6">
            {/* Identity */}
            <div className={`${card} p-6`} style={{ borderColor: "var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Signed in
              </div>
              <div className="mt-1 font-semibold break-words" style={{ color: "var(--text)" }}>
                {me ? me.email : "—"}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>id: {me?.id ?? "—"}</Badge>
                <Badge>Total: {tasks.length}</Badge>
                <Badge>Done: {completedCount}</Badge>
                <Badge>Pending: {pendingCount}</Badge>
              </div>
            </div>

            {/* Add Task */}
            <div className={`${card} p-6`} style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Add a task
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    Keep titles short and clear.
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Badge>Max {TITLE_MAX}</Badge>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  value={title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTitle(v);
                    if (titleError) setTitleError(validateTitle(v));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void addTask();
                  }}
                  disabled={isDisabled}
                  className={input}
                  style={{ borderColor: "var(--border)" }}
                  placeholder='e.g., "Deploy Phase 2"'
                />

                {titleError ? (
                  <div className="text-sm" style={{ color: "var(--danger-text)" }}>
                    {titleError}
                  </div>
                ) : null}

                <button
                  onClick={() => void addTask()}
                  disabled={isDisabled}
                  className={`${btnPrimary} w-full`}
                  style={{ background: "var(--accent)" }}
                >
                  {busyGlobal === "add" ? "Adding..." : "Add Task"}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Pill label="Total tasks" value={tasks.length} />
              <Pill
                label="Completion"
                value={`${tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%`}
              />
            </div>
          </section>

          {/* Main List */}
          <section className="lg:col-span-8">
            <div className={`${card} overflow-hidden`} style={{ borderColor: "var(--border)" }}>
              <div
                className="px-6 py-5 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Your tasks
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    Tap to toggle. Edit when needed.
                  </div>
                </div>

                {initialLoading ? <Badge>Loading...</Badge> : <Badge>{tasks.length} items</Badge>}
              </div>

              {initialLoading ? (
                <div
                  className="px-6 py-10 text-sm"
                  style={{ color: "var(--muted)", background: "var(--surface-2)" }}
                >
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="text-3xl">📝</div>
                  <div className="mt-3 font-semibold" style={{ color: "var(--text)" }}>
                    No tasks yet
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    Add your first task from the left panel.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[var(--line)]">
                  {tasks.map((t) => {
                    const rowBusy = busyTaskId === t.id || busyGlobal !== null;
                    const isEditing = editingId === t.id;

                    return (
                      <div
                        key={t.id}
                        className="px-6 py-4 hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => void toggleTask(t.id)}
                            disabled={rowBusy}
                            className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border bg-[var(--surface)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                            style={{ borderColor: "var(--border)" }}
                            aria-label="Toggle task"
                            title="Toggle"
                          >
                            <span className="text-lg">{t.is_completed ? "✅" : "⬜"}</span>
                          </button>

                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div>
                                {/* EDIT ROW — cohesive + aligned */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                  <input
                                    value={editTitle}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setEditTitle(v);
                                      if (editError) setEditError(validateTitle(v));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") void saveEdit(t.id);
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                    disabled={isDisabled}
                                    className={`${rowInput} sm:flex-1`}
                                    style={{ borderColor: "var(--border)" }}
                                    aria-label="Edit task title"
                                  />

                                  <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:justify-end">
                                    <button
                                      onClick={() => void saveEdit(t.id)}
                                      disabled={rowBusy}
                                      className={`${rowBtnPrimary} w-full sm:w-auto`}
                                      style={{ background: "var(--accent)" }}
                                    >
                                      {busyGlobal === "save" ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      disabled={rowBusy}
                                      className={`${rowBtnOutline} w-full sm:w-auto`}
                                      style={{ borderColor: "var(--border)" }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>

                                {editError ? (
                                  <div className="mt-2 text-sm" style={{ color: "var(--danger-text)" }}>
                                    {editError}
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div
                                    className={`font-semibold truncate ${t.is_completed ? "opacity-70" : ""}`}
                                    style={{
                                      color: t.is_completed ? "var(--muted)" : "var(--text)",
                                    }}
                                  >
                                    {t.title}
                                  </div>

                                  <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                                    Task #{t.id}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => startEdit(t)}
                                    disabled={rowBusy}
                                    className="h-9 rounded-2xl px-3 text-xs font-medium border bg-[var(--surface)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => void deleteTask(t.id)}
                                    disabled={rowBusy}
                                    className="h-9 rounded-2xl px-3 text-xs font-medium border bg-[var(--surface)] hover:bg-[var(--danger-hover)] disabled:opacity-60"
                                    style={{
                                      borderColor: "var(--danger-border)",
                                      color: "var(--danger-text)",
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        <AIFloat />
      </main>
    </div>
  );
}
