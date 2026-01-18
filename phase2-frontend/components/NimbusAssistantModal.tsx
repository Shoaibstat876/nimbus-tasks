"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";

export type ModalMessage = {
  role: Role;
  content: string;
};

type HistoryResult = {
  conversationId: string | null;
  messages: ModalMessage[];
};

type SendResult = {
  conversationId: string;
  reply: string;
};

type Props = {
  open: boolean;
  onClose: () => void;

  title?: string;
  tag?: string;
  examples?: string[];
  placeholder?: string;

  // Load messages when modal opens (history + conversation id)
  onLoadHistory: () => Promise<HistoryResult>;

  // Send a message (returns new/continued conversation id + reply)
  onSend: (message: string, conversationId?: string) => Promise<SendResult>;
};

export default function NimbusAssistantModal({
  open,
  onClose,
  title = "Nimbus Assistant",
  tag = "TASKS CHAT",
  examples = [
    "Add a task: “Finish Step 6 UI”",
    "List my incomplete tasks and summarize in 3 points",
  ],
  placeholder = "Ask Nimbus about your tasks...",
  onLoadHistory,
  onSend,
}: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ModalMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => text.trim().length > 0 && !busy, [text, busy]);

  // Load history when opened
  useEffect(() => {
    if (!open) return;

    setBusy(true);
    setError(null);

    (async () => {
      try {
        const hist = await onLoadHistory();
        setConversationId(hist.conversationId);
        setMessages(hist.messages ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setConversationId(null);
        setMessages([]);
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    })();
  }, [open, onLoadHistory]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const msg = text.trim();
    if (!msg || busy) return;

    setText("");
    setBusy(true);
    setError(null);

    // optimistic user message
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const res = await onSend(msg, conversationId ?? undefined);
      setConversationId(res.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
    if (e.key === "Escape") onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />

      <div className="relative w-[92vw] max-w-md rounded-2xl bg-white shadow-xl border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{title}</div>
            <span className="text-[11px] px-2 py-0.5 rounded-full border bg-zinc-50 text-zinc-700">
              {tag}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {/* Help text */}
          <div className="text-sm text-zinc-600">
            Ask anything about your Nimbus tasks. Try:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {examples.map((ex) => (
                <li key={ex} className="text-zinc-600">
                  “{ex}”
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          {/* Messages */}
          <div className="max-h-64 overflow-auto rounded-xl border bg-zinc-50 p-3 space-y-2">
            {busy && messages.length === 0 ? (
              <div className="text-sm text-zinc-600">Loading...</div>
            ) : null}

            {!busy && messages.length === 0 ? (
              <div className="text-sm text-zinc-600">No messages yet. Say hello.</div>
            ) : null}

            {messages.map((m, i) => (
              <div key={i} className="rounded-lg border bg-white px-3 py-2">
                <div className="text-xs font-semibold text-zinc-500">{m.role}</div>
                <div className="text-sm text-zinc-900 whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input + button */}
          <div>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              disabled={busy}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60"
            />

            <button
              onClick={send}
              disabled={!canSend}
              className="mt-2 w-full rounded-lg bg-zinc-800 text-white py-2 text-sm disabled:opacity-50"
            >
              {busy ? "Sending..." : "SEND"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
