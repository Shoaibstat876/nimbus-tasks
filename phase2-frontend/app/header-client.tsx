"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isAuthenticated, logoutEverywhere } from "@/lib/services/auth";

function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-medium shadow-sm transition-colors hover:shadow"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      {children}
    </Link>
  );
}

function PillButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm font-semibold shadow-sm transition-colors hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-[var(--bg)] disabled:opacity-60"
      style={{
        background: "var(--danger)",
        borderColor: "var(--border)",
        color: "var(--danger-text)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "var(--danger-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--danger)";
      }}
    >
      {children}
    </button>
  );
}

export function HeaderClient() {
  const router = useRouter();
  const pathname = usePathname();

  const [authed, setAuthed] = useState(false);

  const isGuestScreen = useMemo(
    () => pathname === "/login" || pathname === "/register",
    [pathname]
  );

  useEffect(() => {
    // eslint react-hooks/set-state-in-effect: avoid synchronous setState in effect body
    queueMicrotask(() => setAuthed(isAuthenticated()));
  }, [pathname]);

  const onLogout = useCallback(() => {
    logoutEverywhere();
    setAuthed(false);
    router.replace("/login");
  }, [router]);

  const Brand = (
    <div className="min-w-0 text-left">
      <div
        className="truncate text-2xl sm:text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        Nimbus Tasks
      </div>
      <div className="mt-1 truncate text-sm" style={{ color: "var(--muted)" }}>
        Auth + Ownership + CRUD + AI (proof UI)
      </div>
    </div>
  );

  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand clickable ONLY when authed and not on guest screens */}
          <div className="min-w-0">
            {authed && !isGuestScreen ? (
              <Link
                href="/tasks"
                className="block min-w-0 transition-opacity hover:opacity-95"
              >
                {Brand}
              </Link>
            ) : (
              Brand
            )}
          </div>

          {/* Nav ONLY when authenticated, NEVER on guest screens */}
          {authed && !isGuestScreen ? (
            <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
              <PillLink href="/tasks">Tasks</PillLink>

              {/* AI lives only in floating modal (Spec-Kit compliant) */}

              <PillButton onClick={onLogout}>Logout</PillButton>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
