"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken, logoutEverywhere, getToken } from "@/lib/services/auth";

type BannerType = "ok" | "warn" | "err" | "info";

function Banner({ type, text }: { type: BannerType; text: string }) {
  const base = "rounded-2xl border px-4 py-3 text-sm";

  const cls =
    type === "ok"
      ? "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-text)]"
      : type === "warn"
      ? "border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-text)]"
      : type === "err"
      ? "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]"
      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]";

  return <div className={`${base} ${cls}`}>{text}</div>;
}

function getErrorMessage(e: unknown): string {
  if (!e) return "Unknown error.";
  if (typeof e === "string") return e;

  if (typeof e === "object" && e !== null && "message" in e) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error.";
  }
}

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

function normalizeEmail(v: string): string {
  return v.trim();
}

function validateLoginInput(email: string, password: string): string | null {
  const e = normalizeEmail(email);
  if (!e) return "Email is required.";
  if (!password) return "Password is required.";
  return null;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("owner.a@test.com");
  const [password, setPassword] = useState("Pass12345!");
  const [busy, setBusy] = useState(false);

  const defaultInfo = "Login → verify /me → redirect to Tasks.";

  const [banner, setBanner] = useState<{ type: BannerType; text: string }>({
    type: "info",
    text: defaultInfo,
  });

  const clearBannerToDefault = useCallback(() => {
    setBanner({ type: "info", text: defaultInfo });
  }, []);

  const verifyExistingSession = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    if (busy) return; // ✅ avoid fighting with manual login

    setBusy(true);
    setBanner({ type: "info", text: "Checking existing session…" });

    try {
      const me = await api.me();
      setBanner({ type: "ok", text: `Already signed in as ${me.email}. Redirecting…` });
      router.replace("/tasks");
    } catch (e) {
      const st = getStatus(e);
      if (st === 401) {
        logoutEverywhere();
        setBanner({ type: "info", text: "Session expired. Please login again." });
        return;
      }
      setBanner({ type: "warn", text: `Could not verify session. ${getErrorMessage(e)}` });
    } finally {
      setBusy(false);
    }
  }, [router, busy]);

  useEffect(() => {
    void verifyExistingSession();
  }, [verifyExistingSession]);

  const onLogin = useCallback(async () => {
    if (busy) return;

    const err = validateLoginInput(email, password);
    if (err) {
      setBanner({ type: "warn", text: err });
      return;
    }

    setBusy(true);
    setBanner({ type: "info", text: "Logging in and verifying session…" });

    try {
      const data = await api.login(normalizeEmail(email), password);
      setToken(data.access_token);

      const me = await api.me();

      setBanner({
        type: "ok",
        text: `Logged in as ${me.email}. Redirecting…`,
      });

      router.replace("/tasks");
    } catch (e) {
      logoutEverywhere();
      setBanner({ type: "err", text: `Login failed: ${getErrorMessage(e)}` });
    } finally {
      setBusy(false);
    }
  }, [busy, email, password, router]);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") void onLogin();
      if (e.key === "Escape") clearBannerToDefault();
    },
    [onLogin, clearBannerToDefault]
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10 bg-[var(--bg)]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Nimbus Login
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Secure access to your task system</p>
        </div>

        <Banner type={banner.type} text={banner.text} />

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
          <label className="block space-y-1">
            <div className="text-sm font-medium text-[var(--text)]">Email</div>
            <input
              value={email}
              disabled={busy}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKey}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm outline-none disabled:opacity-60"
              autoComplete="email"
            />
          </label>

          <label className="block space-y-1">
            <div className="text-sm font-medium text-[var(--text)]">Password</div>
            <input
              type="password"
              value={password}
              disabled={busy}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKey}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm outline-none disabled:opacity-60"
              autoComplete="current-password"
            />
          </label>

          <button
            onClick={onLogin}
            disabled={busy}
            className="h-12 w-full rounded-2xl bg-[var(--accent)] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Login"}
          </button>

          <div className="text-center text-sm text-[var(--muted)]">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-hover)]"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
