"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  onLoadHistory: () => Promise<HistoryResult>;
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

  // Load history when modal opens
  useEffect(() => {
    if (!open) return;

    let alive = true;

    async function load() {
      setBusy(true);
      setError(null);

      try {
        const hist = await onLoadHistory();
        if (!alive) return;
        setConversationId(hist.conversationId);
        setMessages(hist.messages ?? []);
      } catch (e) {
        if (!alive) return;
        setError(String(e));
        setConversationId(null);
        setMessages([]);
      } finally {
        if (!alive) return;
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [open, onLoadHistory]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = useCallback(async () => {
    const msg = text.trim();
    if (!msg || busy) return;

    setText("");
    setBusy(true);
    setError(null);

    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const res = await onSend(msg, conversationId ?? undefined);
      setConversationId(res.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [text, busy, conversationId, onSend]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") void send();
      if (e.key === "Escape") onClose();
    },
    [send, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="relative w-[92vw] max-w-md overflow-hidden rounded-2xl border shadow-xl"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="min-w-0 flex items-center gap-2">
            <div className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>
              {title}
            </div>
            <span
              className="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface-2)",
                color: "var(--muted)",
              }}
            >
              {tag}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-[var(--bg)]"
            style={{
              color: "var(--muted)",
              background: "transparent",
              outlineColor: "var(--ring)",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Ask anything about your Nimbus tasks. Try:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {examples.map((ex) => (
                <li key={ex} style={{ color: "var(--muted)" }}>
                  “{ex}”
                </li>
              ))}
            </ul>
          </div>

          {error ? (
            <div
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--danger-border)",
                background: "var(--danger-bg)",
                color: "var(--danger-text)",
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            className="max-h-64 overflow-auto rounded-2xl border p-3 space-y-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface-2)",
            }}
          >
            {busy && messages.length === 0 ? (
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Loading...
              </div>
            ) : null}

            {!busy && messages.length === 0 ? (
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                No messages yet. Say hello.
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  {m.role}
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              disabled={busy}
              className="w-full rounded-2xl border px-3 py-2 text-sm outline-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-[var(--bg)]"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                outlineColor: "var(--ring)",
              }}
            />

            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className="mt-2 w-full rounded-2xl py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-[var(--bg)]"
              style={{
                background: canSend ? "var(--accent)" : "var(--surface-2)",
                color: canSend ? "#ffffff" : "var(--muted)",
                outlineColor: "var(--ring)",
              }}
              onMouseEnter={(e) => {
                if (!canSend) return;
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                if (!canSend) return;
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              }}
            >
              {busy ? "Sending..." : "SEND"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
