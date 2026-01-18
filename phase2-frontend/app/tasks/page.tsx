"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { clearToken, getToken } from "../../lib/services/auth"; // Token Authority (Law 3)
import { AIFloat } from "../components/AIFloat";

type Task = {
  id: number;
  title: string;
  is_completed: boolean;
};

type Me = { id: number; email: string };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
      {children}
    </span>
  );
}

const TITLE_MAX = 80;

function getStatus(e: unknown): number | null {
  if (typeof e === "object" && e !== null && "status" in e) {
    const v = (e as any).status;
    return typeof v === "number" ? v : null;
  }
  // fallback: try parse "401 ..." style messages (legacy)
  if (e instanceof Error) {
    const m = e.message.trim();
    const n = Number(m.slice(0, 3));
    if (!Number.isNaN(n) && n >= 100 && n <= 599) return n;
  }
  return null;
}

function niceError(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function TasksPage() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Create
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  // Update (Spec 020)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // UI states (Law 5)
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");

  // Busy states
  const [busyGlobal, setBusyGlobal] = useState<"refresh" | "add" | "save" | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);

  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.length - completedCount, [tasks]);

  function validateTitle(raw: string): string | null {
    const cleaned = raw.trim();
    if (!cleaned) return "Title is required.";
    if (cleaned.length > TITLE_MAX) return `Title too long (max ${TITLE_MAX} characters).`;
    return null;
  }

  function redirectToLogin(message: string) {
    // ✅ Law 3: only auth.ts clears token
    clearToken();
    setMe(null);
    setTasks([]);
    setErrorMsg(null);
    setStatus(message);
    router.replace("/login"); // prevent back-button confusion
  }

  function showNotFoundStyle(message: string) {
    // ✅ Law 4: do not leak whether task exists or is owned
    setMe(null);
    setTasks([]);
    setErrorMsg(message);
    setStatus("Not found");
  }

  async function refresh() {
    setBusyGlobal("refresh");
    setStatus("Loading /me + tasks...");
    setErrorMsg(null);

    // ✅ Guard: no token → redirect immediately
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

      // ✅ Spec 010: protected page → if unauthenticated, go login
      if (st === 401) {
        redirectToLogin("Session expired. Redirecting to login...");
        return;
      }

      // ✅ Law 4: treat 403/404 as not-found style
      if (st === 403 || st === 404) {
        showNotFoundStyle("This page is not available.");
        return;
      }

      // ✅ Law 5: friendly error state with retry
      setErrorMsg(`Could not load tasks. ${niceError(e)}`);
      setStatus("Error");
    } finally {
      setBusyGlobal(null);
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTask() {
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
  }

  function startEdit(t: Task) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditError(null);
  }

  async function saveEdit(id: number) {
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
  }

  async function toggleTask(id: number) {
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
  }

  async function deleteTask(id: number) {
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
  }

  const isDisabled = busyGlobal !== null || busyTaskId !== null;

  // ✅ If not authed and not loading, we should already be redirecting.
  if (!initialLoading && !me) return null;

  return (
    <main className="space-y-6">
      {/* ✅ No local nav here (layout owns global nav + logout) */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="mt-1 text-sm text-zinc-600">
          This page proves: <span className="font-semibold">CRUD</span> +{" "}
          <span className="font-semibold">owner-only isolation</span>.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        {initialLoading ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-700">
            Loading tasks...
          </div>
        ) : null}

        {errorMsg ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-900">
            <div className="font-medium">Something went wrong</div>
            <div className="mt-1">{errorMsg}</div>
            <button
              onClick={refresh}
              disabled={isDisabled}
              className="mt-3 rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-rose-50 disabled:opacity-60"
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm text-zinc-600">
              Signed in:{" "}
              <span className="font-semibold text-zinc-900">
                {me ? `${me.email} (id=${me.id})` : "—"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Total: {tasks.length}</Badge>
              <Badge>Completed: {completedCount}</Badge>
              <Badge>Pending: {pendingCount}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={isDisabled}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
            >
              {busyGlobal === "refresh" ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          Status: <span className="font-medium">{status}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(validateTitle(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
              disabled={isDisabled}
              className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400 disabled:opacity-60"
              placeholder='New task title (e.g., "Neon proof task")'
            />
            <button
              onClick={addTask}
              disabled={isDisabled}
              className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
            >
              {busyGlobal === "add" ? "Adding..." : "Add Task"}
            </button>
          </div>

          {titleError ? <div className="text-sm text-rose-700">{titleError}</div> : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200">
          {tasks.length === 0 ? (
            <div className="p-8 text-sm text-zinc-600">
              No tasks yet. Create your first task to prove Neon persistence.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {tasks.map((t) => {
                const rowBusy = busyTaskId === t.id || busyGlobal !== null;
                const isEditing = editingId === t.id;

                return (
                  <div
                    key={t.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.is_completed ? "✅" : "⬜"}</span>

                        {isEditing ? (
                          <div className="flex flex-col gap-2 w-full">
                            <input
                              value={editTitle}
                              onChange={(e) => {
                                setEditTitle(e.target.value);
                                if (editError) setEditError(validateTitle(e.target.value));
                              }}
                              disabled={isDisabled}
                              className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:opacity-60"
                            />
                            {editError ? (
                              <div className="text-sm text-rose-700">{editError}</div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="font-semibold truncate">{t.title}</div>
                        )}
                      </div>

                      <div className="mt-1 text-xs text-zinc-500">Task #{t.id}</div>
                    </div>

                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(t.id)}
                            disabled={rowBusy}
                            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
                          >
                            {busyGlobal === "save" ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={rowBusy}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(t)}
                            disabled={rowBusy}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleTask(t.id)}
                            disabled={rowBusy}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
                          >
                            {busyTaskId === t.id ? "Working..." : "Toggle"}
                          </button>
                          <button
                            onClick={() => deleteTask(t.id)}
                            disabled={rowBusy}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
                          >
                            {busyTaskId === t.id ? "Working..." : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <AIFloat />

    </main>
  );
}
