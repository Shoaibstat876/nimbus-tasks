"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type BannerType = "ok" | "warn" | "err" | "info";

function Banner({ type, text }: { type: BannerType; text: string }) {
  const style =
    type === "ok"
      ? {
          borderColor: "var(--success-border)",
          background: "var(--success-bg)",
          color: "var(--success-text)",
        }
      : type === "warn"
      ? {
          borderColor: "var(--warning-border)",
          background: "var(--warning-bg)",
          color: "var(--warning-text)",
        }
      : type === "err"
      ? {
          borderColor: "var(--danger-border)",
          background: "var(--danger-bg)",
          color: "var(--danger-text)",
        }
      : {
          borderColor: "var(--info-border)",
          background: "var(--info-bg)",
          color: "var(--info-text)",
        };

  return (
    <div className="rounded-2xl border px-4 py-3 text-sm" style={style}>
      {text}
    </div>
  );
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
    return "Registration failed. Please try again.";
  }
}

function normalizeEmail(v: string): string {
  return v.trim();
}

function validateRegisterInput(email: string, password: string): string | null {
  if (!normalizeEmail(email)) return "Email is required.";
  if (!password) return "Password is required.";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const [banner, setBanner] = useState<{ type: BannerType; text: string }>({
    type: "info",
    text: "Create an account → then login.",
  });

  const onRegister = useCallback(async () => {
    if (busy) return;

    const err = validateRegisterInput(email, password);
    if (err) {
      setBanner({ type: "warn", text: err });
      return;
    }

    setBusy(true);
    setBanner({ type: "info", text: "Creating account…" });

    try {
      await api.register(normalizeEmail(email), password);

      setBanner({
        type: "ok",
        text: "Account created successfully. Redirecting to login…",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (e) {
      setBanner({
        type: "err",
        text: getErrorMessage(e),
      });
    } finally {
      setBusy(false);
    }
  }, [busy, email, password, router]);

  const card = "rounded-3xl border bg-[var(--surface)] shadow-sm";
  const input =
    "h-12 w-full rounded-2xl border bg-[var(--surface)] px-4 text-sm outline-none disabled:opacity-60";
  const btn =
    "h-12 w-full rounded-2xl px-5 text-sm font-medium shadow-sm transition-colors disabled:opacity-60";
  const btnPrimary = `${btn} text-white hover:opacity-95`;

  return (
    <main className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Nimbus — Register
        </h2>
      </div>

      <Banner type={banner.type} text={banner.text} />

      <div className={`${card} p-6 space-y-4`} style={{ borderColor: "var(--border)" }}>
        <label className="block space-y-1">
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Email
          </div>
          <input
            value={email}
            disabled={busy}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onRegister();
            }}
            className={input}
            style={{ borderColor: "var(--border)" }}
            autoComplete="email"
          />
        </label>

        <label className="block space-y-1">
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Password
          </div>
          <input
            type="password"
            value={password}
            disabled={busy}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onRegister();
            }}
            className={input}
            style={{ borderColor: "var(--border)" }}
            autoComplete="new-password"
          />
        </label>

        <button
          onClick={onRegister}
          disabled={busy}
          className={btnPrimary}
          style={{ background: "var(--accent)" }}
        >
          {busy ? "Creating…" : "Create Account"}
        </button>

        <div className="text-center text-sm" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4"
            style={{ color: "var(--text)" }}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
