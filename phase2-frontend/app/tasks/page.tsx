"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, clearToken } from "../../lib/api";

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
  const [me, setMe] = useState<Me | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Ready");

  // busy states
  const [busyGlobal, setBusyGlobal] = useState<"refresh" | "add" | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);

  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);
  const pendingCount = useMemo(() => tasks.length - completedCount, [tasks]);

  function hardLogout(message: string) {
    clearToken();
    setMe(null);
    setTasks([]);
    setStatus(message);
  }

  async function refresh() {
    setBusyGlobal("refresh");
    setStatus("Loading /me + tasks...");
    try {
      const who = await api.me();
      setMe(who);

      const list = await api.listTasks();
      setTasks(list);

      setStatus("Loaded");
    } catch (e) {
      // if token expired / unauthorized, show clean state
      setMe(null);
      setTasks([]);
      const msg = niceError(e);

      // common FastAPI auth failures bubble as "401 ..." in our api.ts error builder
      if (msg.startsWith("401") || msg.startsWith("403")) {
        hardLogout("Session expired. Please login again.");
      } else {
        setStatus(`Not authorized. Go login. (${msg})`);
      }
    } finally {
      setBusyGlobal(null);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTask() {
    const cleaned = title.trim();
    if (!cleaned) {
      setStatus("Please type a task title.");
      return;
    }

    setBusyGlobal("add");
    setStatus("Creating task...");
    try {
      await api.createTask(cleaned);
      setTitle("");
      setStatus("Created. Refreshing...");
      await refresh();
    } catch (e) {
      setStatus(`Create failed: ${niceError(e)}`);
    } finally {
      setBusyGlobal(null);
    }
  }

  async function toggleTask(id: number) {
    setBusyTaskId(id);
    setStatus("Toggling...");

    // optimistic UI
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)));

    try {
      await api.toggleTask(id);
      setStatus("Toggled");
      // background refresh to keep DB truth
      await refresh();
    } catch (e) {
      setStatus(`Toggle failed: ${niceError(e)}`);
      // revert by refreshing
      await refresh();
    } finally {
      setBusyTaskId(null);
    }
  }

  async function deleteTask(id: number) {
    setBusyTaskId(id);
    setStatus("Deleting...");

    // optimistic remove
    const before = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id); // ✅ safe now (204 supported)
      setStatus("Deleted");
      await refresh();
    } catch (e) {
      setStatus(`Delete failed: ${niceError(e)}`);
      // restore then refresh
      setTasks(before);
      await refresh();
    } finally {
      setBusyTaskId(null);
    }
  }

  function logout() {
    hardLogout("Logged out. Please login again.");
  }

  const isDisabled = busyGlobal !== null || busyTaskId !== null;

  return (
    <main className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="mt-1 text-sm text-zinc-600">
            This page proves: <span className="font-semibold">CRUD</span> +{" "}
            <span className="font-semibold">owner-only isolation</span>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-zinc-800"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm text-zinc-600">
              Signed in:{" "}
              <span className="font-semibold text-zinc-900">
                {me ? `${me.email} (id=${me.id})` : "Not logged in"}
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
            <button
              onClick={logout}
              disabled={isDisabled}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 disabled:opacity-60"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          Status: <span className="font-medium">{status}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div className="overflow-hidden rounded-3xl border border-zinc-200">
          {tasks.length === 0 ? (
            <div className="p-8 text-sm text-zinc-600">
              No tasks yet. Create your first task to prove Neon persistence.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {tasks.map((t) => {
                const rowBusy = busyTaskId === t.id || busyGlobal !== null;

                return (
                  <div
                    key={t.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.is_completed ? "✅" : "⬜"}</span>
                        <div className="font-semibold truncate">{t.title}</div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">Task #{t.id}</div>
                    </div>

                    <div className="flex gap-2">
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
