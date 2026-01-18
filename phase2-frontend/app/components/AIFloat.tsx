"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isAuthenticated } from "@/lib/services/auth";
import NimbusAssistantModal, { type ModalMessage } from "@/components/NimbusAssistantModal";
import { api } from "@/lib/api";

type Me = { id: number; email: string };

function convKey(userId: number) {
  return `nimbus.conversation_id.${userId}`;
}

function looksLikeUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v.trim()
  );
}

function getStatus(e: unknown): number | null {
  if (typeof e === "object" && e !== null && "status" in e) {
    const v = (e as any).status;
    return typeof v === "number" ? v : null;
  }
  return null;
}

type HistoryApiMessage = {
  role: string;
  content: string;
};

export function AIFloat() {
  const pathname = usePathname();

  const isGuestRoute = useMemo(() => {
    return pathname === "/login" || pathname === "/register";
  }, [pathname]);

  // Hydration-safe: render nothing until after mount
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  // modal state
  const [open, setOpen] = useState(false);

  // cache /me so we don’t hit it on every send
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuthenticated());
  }, []);

  // Re-check auth when route changes
  useEffect(() => {
    if (!mounted) return;
    setAuthed(isAuthenticated());
  }, [mounted, pathname]);

  if (!mounted) return null;
  if (isGuestRoute) return null;
  if (!authed) return null;

  async function ensureMe(): Promise<Me> {
    if (me) return me;
    const who = await api.me();
    setMe(who);
    return who;
  }

  async function onLoadHistory() {
    const who = await ensureMe();

    const stored =
      typeof window !== "undefined" ? localStorage.getItem(convKey(who.id)) : null;

    if (stored && !looksLikeUuid(stored)) {
      if (typeof window !== "undefined") localStorage.removeItem(convKey(who.id));
      return { conversationId: null, messages: [] as ModalMessage[] };
    }

    if (!stored) {
      return { conversationId: null, messages: [] as ModalMessage[] };
    }

    try {
      const history = await api.getChatHistory(stored);

      const raw = Array.isArray(history.messages) ? (history.messages as HistoryApiMessage[]) : [];

      const msgs: ModalMessage[] = raw.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? ""),
      }));

      return { conversationId: history.conversation_id ?? stored, messages: msgs };
    } catch (e) {
      const st = getStatus(e);

      // Owner-only 404 or missing conversation -> start fresh
      if (st === 404) {
        if (typeof window !== "undefined") localStorage.removeItem(convKey(who.id));
        return { conversationId: null, messages: [] as ModalMessage[] };
      }

      // If session expired, start fresh (modal stays usable)
      if (st === 401) {
        if (typeof window !== "undefined") localStorage.removeItem(convKey(who.id));
        setMe(null);
        return { conversationId: null, messages: [] as ModalMessage[] };
      }

      throw e;
    }
  }

  async function onSend(message: string, conversationId?: string) {
    const who = await ensureMe();
    const res = await api.sendChatMessage(message, conversationId);

    if (typeof window !== "undefined") {
      localStorage.setItem(convKey(who.id), res.conversation_id);
    }

    return { conversationId: res.conversation_id, reply: res.response };
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Nimbus AI"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full
                   bg-zinc-900 px-5 py-3 text-sm font-semibold text-white
                   shadow-xl hover:bg-zinc-800"
      >
        🤖 <span>AI</span>
      </button>

      <NimbusAssistantModal
        open={open}
        onClose={() => setOpen(false)}
        title="Nimbus Assistant"
        tag="TASKS AI"
        examples={[
          "Add a task: “Finish Step 6 UI”",
          "List my incomplete tasks and summarize in 3 points",
        ]}
        placeholder="Ask Nimbus about your tasks..."
        onLoadHistory={onLoadHistory}
        onSend={onSend}
      />
    </>
  );
}
