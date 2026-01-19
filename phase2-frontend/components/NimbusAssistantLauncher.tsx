"use client";

import { useCallback, useState } from "react";
import NimbusAssistantModal, { type ModalMessage } from "@/components/NimbusAssistantModal";
import { api } from "@/lib/api";

type Me = { id: number; email: string };

type HistoryApiMessage = { role: string; content: string };

type LoadResult = {
  conversationId: string | null;
  messages: ModalMessage[];
};

// per-user conversation id key
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

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function safeRemove(key: string) {
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

export default function NimbusAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const ensureMe = useCallback(async (): Promise<Me> => {
    if (me) return me;
    const who = await api.me();
    setMe(who);
    return who;
  }, [me]);

  const onLoadHistory = useCallback(async (): Promise<LoadResult> => {
    const who = await ensureMe();
    const key = convKey(who.id);

    const stored = safeGet(key);

    // invalid -> clear it and start fresh
    if (stored && !looksLikeUuid(stored)) {
      safeRemove(key);
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

      // Owner-only 404 or deleted conversation -> start fresh
      if (st === 404) {
        safeRemove(key);
        return { conversationId: null, messages: [] };
      }

      // Session expired -> clear local conversation cache, let modal decide UX
      if (st === 401) {
        safeRemove(key);
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

      safeSet(convKey(who.id), res.conversation_id);

      return {
        conversationId: res.conversation_id,
        reply: res.response,
      };
    },
    [ensureMe]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border bg-white px-4 py-3 text-sm shadow-md hover:bg-zinc-50"
        aria-label="Open Nimbus Assistant"
      >
        Nimbus AI
      </button>

      <NimbusAssistantModal
        open={open}
        onClose={() => setOpen(false)}
        title="Nimbus Assistant"
        tag="TASKS CHAT"
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
