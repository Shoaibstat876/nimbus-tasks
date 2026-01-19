"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isAuthenticated } from "@/lib/services/auth";
import NimbusAssistantModal, { type ModalMessage } from "@/components/NimbusAssistantModal";
import { api } from "@/lib/api";

type Me = { id: number; email: string };

type HistoryApiMessage = {
  role: string;
  content: string;
};

type HistoryLoadResult = {
  conversationId: string | null;
  messages: ModalMessage[];
};

function convKey(userId: number): string {
  return `nimbus.conversation_id.${userId}`;
}

function looksLikeUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v.trim()
  );
}

function getStatus(e: unknown): number | null {
  if (typeof e === "object" && e !== null && "status" in e) {
    const v = (e as { status?: unknown }).status;
    return typeof v === "number" ? v : null;
  }
  return null;
}

function safeLocalStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function safeLocalStorageSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function safeLocalStorageRemove(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

function toModalMessages(raw: unknown): ModalMessage[] {
  const arr = Array.isArray(raw) ? (raw as HistoryApiMessage[]) : [];
  return arr.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? ""),
  }));
}

export function AIFloat() {
  const pathname = usePathname();

  const isGuestRoute = useMemo(() => pathname === "/login" || pathname === "/register", [pathname]);

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  const [open, setOpen] = useState(false);

  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setAuthed(isAuthenticated());
  }, [mounted, pathname]);

  const ensureMe = useCallback(async (): Promise<Me> => {
    if (me) return me;
    const who = await api.me();
    setMe(who);
    return who;
  }, [me]);

  const onLoadHistory = useCallback(async (): Promise<HistoryLoadResult> => {
    const who = await ensureMe();
    const key = convKey(who.id);

    const stored = safeLocalStorageGet(key);

    if (stored && !looksLikeUuid(stored)) {
      safeLocalStorageRemove(key);
      return { conversationId: null, messages: [] };
    }

    if (!stored) {
      return { conversationId: null, messages: [] };
    }

    try {
      const history = await api.getChatHistory(stored);
      const msgs = toModalMessages(history.messages);
      return { conversationId: history.conversation_id ?? stored, messages: msgs };
    } catch (e) {
      const st = getStatus(e);

      if (st === 404) {
        safeLocalStorageRemove(key);
        return { conversationId: null, messages: [] };
      }

      if (st === 401) {
        safeLocalStorageRemove(key);
        setMe(null);
        return { conversationId: null, messages: [] };
      }

      throw e;
    }
  }, [ensureMe]);

  const onSend = useCallback(
    async (message: string, conversationId?: string) => {
      const who = await ensureMe();
      const res = await api.sendChatMessage(message, conversationId);

      safeLocalStorageSet(convKey(who.id), res.conversation_id);

      return { conversationId: res.conversation_id, reply: res.response };
    },
    [ensureMe]
  );

  if (!mounted) return null;
  if (isGuestRoute) return null;
  if (!authed) return null;

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
