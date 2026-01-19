"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken, logoutEverywhere, getToken } from "@/lib/services/auth";

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

  const [banner, setBanner] = useState<{ type: BannerType; text: string }>({
    type: "info",
    text: "Login → verify /me → redirect to Tasks.",
  });

  const verifyExistingSession = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setBusy(true);
    setBanner({ type: "info", text: "Checking existing session…" });

    try {
      const me = await api.me();
      setBanner({ type: "ok", text: `Already signed in as ${me.email}. Redirecting to Tasks…` });
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
  }, [router]);

  // ✅ If already authenticated, don't show login again.
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
        text: `Logged in as ${me.email}. Redirecting to Tasks…`,
      });

      router.replace("/tasks");
    } catch (e) {
      logoutEverywhere();
      setBanner({ type: "err", text: `Login failed: ${getErrorMessage(e)}` });
    } finally {
      setBusy(false);
    }
  }, [busy, email, password, router]);

  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Nimbus — Login</h2>
      </div>

      <Banner type={banner.type} text={banner.text} />

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <label className="space-y-1 block">
          <div className="text-sm font-medium">Email</div>
          <input
            value={email}
            disabled={busy}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 disabled:opacity-70"
            autoComplete="email"
          />
        </label>

        <label className="space-y-1 block">
          <div className="text-sm font-medium">Password</div>
          <input
            type="password"
            value={password}
            disabled={busy}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 disabled:opacity-70"
            autoComplete="current-password"
          />
        </label>

        <button
          onClick={onLogin}
          disabled={busy}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-white font-medium hover:bg-zinc-800 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Login"}
        </button>

        <div className="text-center text-sm text-zinc-600">
          New here?{" "}
          <Link href="/register" className="font-medium text-zinc-900 underline">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
