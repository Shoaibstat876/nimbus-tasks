import "./globals.css";
import type { Metadata } from "next";
import { HeaderClient } from "./header-client";
import { AIFloat } from "./components/AIFloat";

export const metadata: Metadata = {
  title: "Nimbus Tasks",
  description: "Secure tasks with Auth, Ownership, CRUD, and Chat (proof UI).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-b from-zinc-50 to-white text-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            {/* HEADER */}
            <div className="border-b border-zinc-100">
              <HeaderClient />
            </div>

            {/* CONTENT */}
            <div className="px-8 py-8">
              {children}
            </div>

            {/* FOOTER */}
            <div className="border-t border-zinc-100 px-8 py-5 text-xs text-zinc-500">
              Proof Flow: Login → /me → Tasks → Chat → Logout
            </div>
          </div>
        </div>

        {/* Global AI (self-gated inside AIFloat for guest routes + unauth) */}
        <AIFloat />
      </body>
    </html>
  );
}
