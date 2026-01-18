"use client";

import { useCallback, useState } from "react";
import NimbusAssistantModal, { type ModalMessage } from "@/components/NimbusAssistantModal";
import { api } from "@/lib/api";

type Me = { id: number; email: string };

// per-user conversation id key
function convKey(userId: number) {
  return `nimbus.conversation_id.${userId}`;
}

function looksLikeUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v.trim()
  );
}

export default function NimbusAssistantLauncher() {
  const [open, setOpen] = useState(false);

  const onLoadHistory = useCallback(async () => {
    // must be logged in already; Chat page is protected and token exists
    const me: Me = await api.me();

    const stored =
      typeof window !== "undefined" ? localStorage.getItem(convKey(me.id)) : null;

    // if invalid -> clear it and start fresh
    if (stored && !looksLikeUuid(stored)) {
      if (typeof window !== "undefined") localStorage.removeItem(convKey(me.id));
      return { conversationId: null, messages: [] as ModalMessage[] };
    }

    // if no stored conversation -> start fresh
    if (!stored) {
      return { conversationId: null, messages: [] as ModalMessage[] };
    }

    // try load history
    try {
      const history = await api.getChatHistory(stored);

      const msgs: ModalMessage[] = Array.isArray(history.messages)
        ? history.messages.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content ?? ""),
          }))
        : [];

      return { conversationId: history.conversation_id ?? stored, messages: msgs };
    } catch (e: any) {
      // Owner-only 404 or deleted conversation -> start fresh
      if (e && typeof e === "object" && "status" in e && e.status === 404) {
        if (typeof window !== "undefined") localStorage.removeItem(convKey(me.id));
        return { conversationId: null, messages: [] as ModalMessage[] };
      }
      // Let modal show error
      throw e;
    }
  }, []);

  const onSend = useCallback(async (message: string, conversationId?: string) => {
    const me: Me = await api.me();

    const res = await api.sendChatMessage(message, conversationId);

    if (typeof window !== "undefined") {
      localStorage.setItem(convKey(me.id), res.conversation_id);
    }

    return {
      conversationId: res.conversation_id,
      reply: res.response,
    };
  }, []);

  return (
    <>
      {/* Floating button (bottom-right) */}
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
