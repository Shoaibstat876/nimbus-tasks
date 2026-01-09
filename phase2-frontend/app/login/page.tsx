"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, clearToken } from "../../lib/api";

type BannerType = "ok" | "warn" | "err" | "info";

function Banner({ type, text }: { type: BannerType; text: string }) {
  const cls =
    type === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : type === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : type === "err"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${cls}`}>{text}</div>;
}

export default function LoginPage() {
  const [email, setEmail] = useState("owner.a@test.com");
  const [password, setPassword] = useState("pass1234");
  const [busy, setBusy] = useState<"register" | "login" | null>(null);

  const [banner, setBanner] = useState<{ type: BannerType; text: string }>({
    type: "info",
    text: "Demo-ready login. Register (optional) → Login → Verify /me.",
  });

  // 🔍 Deployment sanity check (prevents panic)
  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "";

    if (typeof window !== "undefined" && window.location.host.includes("vercel.app")) {
      if (!apiBase) {
        setBanner({
          type: "warn",
          text:
            "API base URL is NOT set on Vercel. " +
            "Add NEXT_PUBLIC_API_BASE_URL in Vercel → Settings → Environment Variables.",
        });
      } else if (apiBase.includes("localhost") || apiBase.includes("127.0.0.1")) {
        setBanner({
          type: "warn",
          text:
            "API base URL points to localhost. This works locally but FAILS on Vercel. " +
            "Use your deployed backend URL + /api.",
        });
      }
    }
  }, []);

  async function onRegister() {
    setBusy("register");
    setBanner({ type: "info", text: "Registering user..." });
    try {
      const res = await api.register(email.trim(), password);
      setBanner({
        type: "ok",
        text: `Registered: ${res.email} (id=${res.id}). Now login + verify /me.`,
      });
    } catch (e: any) {
      setBanner({ type: "warn", text: `Register failed: ${e.message}` });
    } finally {
      setBusy(null);
    }
  }

  async function onLogin() {
    setBusy("login");
    setBanner({ type: "info", text: "Logging in + verifying /me..." });
    try {
      await api.login(email.trim(), password);
      const me = await api.me();
      setBanner({
        type: "ok",
        text: `Logged in as ${me.email} (id=${me.id}). Ownership gate ready.`,
      });
    } catch (e: any) {
      clearToken();
      setBanner({ type: "err", text: `Login failed: ${e.message}` });
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nimbus — Sign in</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Proof page for <span className="font-semibold">JWT login</span> +{" "}
            <span className="font-semibold">/me</span>.
          </p>
        </div>

        <Link href="/tasks" className="text-sm text-zinc-600 hover:text-zinc-900">
          Go to Tasks →
        </Link>
      </div>

      <Banner type={banner.type} text={banner.text} />

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Login card */}
        <div className="lg:col-span-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <div className="text-sm font-medium">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="space-y-2">
              <div className="text-sm font-medium">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onRegister}
              disabled={busy !== null}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-zinc-50 disabled:opacity-60"
            >
              {busy === "register" ? "Registering..." : "Register"}
            </button>

            <button
              onClick={onLogin}
              disabled={busy !== null}
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
            >
              {busy === "login" ? "Signing in..." : "Login + Verify /me"}
            </button>

            <Link
              href="/tasks"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
            >
              Open Tasks
            </Link>
          </div>
        </div>

        {/* Proof panel */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
          <div className="text-sm font-semibold">Proof checklist</div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>✅ Register (optional)</li>
            <li>✅ Login (JWT)</li>
            <li>✅ Verify /me</li>
            <li>✅ Tasks CRUD</li>
            <li>✅ Owner-only isolation</li>
          </ul>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600">
            Teacher tip: Use two accounts (A & B) to prove ownership gate (404 for others).
          </div>
        </div>
      </div>
    </main>
  );
}
