"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isAuthenticated, logoutEverywhere } from "@/lib/services/auth";

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
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
      onClick={onClick}
      className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
    >
      {children}
    </button>
  );
}

export function HeaderClient() {
  const router = useRouter();
  const pathname = usePathname();

  const [authed, setAuthed] = useState(false);

  // Guest-only screens (auth pages)
  const isGuestScreen = useMemo(() => {
    return pathname === "/login" || pathname === "/register";
  }, [pathname]);

  // Single source of truth for auth state
  useEffect(() => {
    setAuthed(isAuthenticated());
  }, [pathname]);

  const onLogout = useCallback(() => {
    logoutEverywhere();
    setAuthed(false);
    router.replace("/login");
  }, [router]);

  const Brand = (
    <div className="text-left">
      <div className="text-3xl font-extrabold tracking-tight text-zinc-900">
        Nimbus Tasks
      </div>
      <div className="mt-1 text-sm text-zinc-600">
        Auth + Ownership + CRUD + AI (proof UI)
      </div>
    </div>
  );

  return (
    <header className="flex items-start justify-between gap-6 px-8 py-6">
      {/* Brand: clickable ONLY when authed and not on guest screens */}
      {authed && !isGuestScreen ? (
        <Link href="/tasks" className="block hover:opacity-95">
          {Brand}
        </Link>
      ) : (
        Brand
      )}

      {/* Nav: ONLY when authenticated, NEVER on guest screens */}
      {authed && !isGuestScreen ? (
        <nav className="flex items-center gap-3">
          <PillLink href="/tasks">Tasks</PillLink>

          {/* AI lives only in floating modal (Spec-Kit compliant) */}

          <PillButton onClick={onLogout}>Logout</PillButton>
        </nav>
      ) : null}
    </header>
  );
}
