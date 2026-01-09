import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nimbus Tasks",
  description: "Secure tasks with Auth, Ownership, CRUD, and Neon PostgreSQL.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-b
 from-zinc-50 to-white text-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-8 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">
                    NIMBUS • PHASE 2
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">
                    Nimbus Tasks
                  </h1>
                  <p className="mt-1 text-sm text-zinc-600">
                    Auth + Ownership + CRUD + Neon PostgreSQL (proof UI)
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                    localhost:3000
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                    API: :8000
                  </span>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">{children}</div>

            <div className="border-t border-zinc-100 px-8 py-5 text-xs text-zinc-500">
              Built for proof: Login → /me → Tasks (owner-only) → Neon persistence.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
