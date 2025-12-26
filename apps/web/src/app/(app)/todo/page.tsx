"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button } from "@nimbus/ui";
import { useTodos } from "@/features/todos/useTodos";
import { TaskItem } from "@/features/todos/components/TaskItem";

export default function TodoPage() {
  const { visible, filter, setFilter, add, remove, toggle, edit, warning } = useTodos();

  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canAdd = useMemo(() => title.trim().length > 0, [title]);

  const onAdd = () => {
    const clean = title.trim();
    if (!clean) {
      setError("Title is required.");
      inputRef.current?.focus();
      return;
    }

    const res = add(clean);
    if (!res.ok) {
      setError(res.error);
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setTitle("");
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32 }}>Todo List MVP</h1>
        <p style={{ margin: "6px 0 0", opacity: 0.8 }}>CRUD + complete + filter + persistence.</p>

        {warning ? <p style={{ margin: "6px 0 0", color: "#b45309" }}>{warning}</p> : null}
      </div>

      <Card style={{ padding: 16, display: "grid", gap: 12 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAdd();
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Add a task..."
              aria-label="Task title"
              style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <Button type="submit" disabled={!canAdd}>
              Add
            </Button>
          </div>
        </form>

        {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => {
              setFilter("all");
              if (error) setError(null);
            }}
          >
            All
          </Button>

          <Button
            variant={filter === "active" ? "primary" : "secondary"}
            onClick={() => {
              setFilter("active");
              if (error) setError(null);
            }}
          >
            Active
          </Button>

          <Button
            variant={filter === "completed" ? "primary" : "secondary"}
            onClick={() => {
              setFilter("completed");
              if (error) setError(null);
            }}
          >
            Completed
          </Button>

          <span style={{ marginLeft: "auto", opacity: 0.75, fontSize: 14 }}>
            Showing <b>{visible.length}</b>
          </span>
        </div>
      </Card>

      <Card style={{ padding: 16 }}>
        {visible.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.7 }}>No tasks yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {visible.map((t) => (
              <TaskItem key={t.id} task={t} onToggle={toggle} onDelete={remove} onEdit={edit} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
