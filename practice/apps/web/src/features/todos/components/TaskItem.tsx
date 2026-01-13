"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@nimbus/ui";
import type { Task } from "../types";
import { normalizeTitle } from "../taskStore";

type ActionOk = { ok: true };
type ActionErr = { ok: false; error: string };
type ActionResult = ActionOk | ActionErr;

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextTitle: string) => ActionResult;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // keep draft synced if task changes (but don't overwrite user while editing)
  useEffect(() => {
    if (!isEditing) setDraft(task.title);
  }, [task.title, isEditing]);

  // focus + select when entering edit mode
  useEffect(() => {
    if (!isEditing) return;

    const el = inputRef.current;
    if (!el) return;

    el.focus();
    el.setSelectionRange(0, el.value.length);
  }, [isEditing]);

  const startEdit = () => {
    setError(null);
    setDraft(task.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setError(null);
    setDraft(task.title);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const current = task.title.trim();
    const nextRaw = draft.trim();

    // no-op if unchanged: exit edit mode quietly
    if (nextRaw === current) {
      setError(null);
      setIsEditing(false);
      return;
    }

    const v = normalizeTitle(draft);
    if (!v.ok) {
      setError(v.error);
      return;
    }

    const res = onEdit(task.id, v.value);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    setError(null);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 12,
      }}
    >
      <input
        type="checkbox"
        checked={task.isCompleted}
        disabled={isEditing}
        onChange={() => onToggle(task.id)}
        aria-label={task.isCompleted ? "Mark as active" : "Mark as completed"}
      />

      <div style={{ flex: 1 }}>
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                // IME-safe
                if (e.nativeEvent.isComposing) return;

                if (e.key === "Enter") {
                  e.preventDefault();
                  saveEdit();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelEdit();
                }
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
              aria-label="Edit task title"
            />

            {error ? (
              <div style={{ marginTop: 6, color: "#b91c1c", fontSize: 12 }}>{error}</div>
            ) : null}

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Button type="button" onClick={saveEdit}>
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <span
            onDoubleClick={startEdit}
            style={{
              textDecoration: task.isCompleted ? "line-through" : "none",
              cursor: "text",
            }}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
      </div>

      {!isEditing ? (
        <Button type="button" variant="secondary" onClick={startEdit}>
          Edit
        </Button>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        disabled={isEditing}
        onClick={() => onDelete(task.id)}
      >
        Delete
      </Button>
    </div>
  );
}
