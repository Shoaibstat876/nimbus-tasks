"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

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

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const [banner, setBanner] = useState<{ type: BannerType; text: string }>({
    type: "info",
    text: "Create an account → then login.",
  });

  async function onRegister() {
    if (busy) return;

    setBusy(true);
    setBanner({ type: "info", text: "Creating account…" });

    try {
      await api.register(email.trim(), password);
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
        text: e instanceof Error ? e.message : "Registration failed. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Nimbus — Register</h2>
      </div>

      <Banner type={banner.type} text={banner.text} />

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <label className="block space-y-1">
          <div className="text-sm font-medium">Email</div>
          <input
            value={email}
            disabled={busy}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 disabled:opacity-70"
            autoComplete="email"
          />
        </label>

        <label className="block space-y-1">
          <div className="text-sm font-medium">Password</div>
          <input
            type="password"
            value={password}
            disabled={busy}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 disabled:opacity-70"
            autoComplete="new-password"
          />
        </label>

        <button
          onClick={onRegister}
          disabled={busy}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create Account"}
        </button>

        {/* Optional tiny link inside the card (NOT header nav) */}
        <div className="text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
