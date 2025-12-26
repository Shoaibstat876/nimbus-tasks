const items = [
  { label: "Dashboard", href: "/app" },
  { label: "Wizard", href: "/app/wizard" },
  { label: "Todo", href: "/todo" },
  { label: "Tasks", href: "/app/tasks" }
];

export function SideNav() {
  return (
    <aside
      style={{
        borderRight: "1px solid rgba(0,0,0,0.08)",
        background: "white",
        padding: 12
      }}
    >
      <nav style={{ display: "grid", gap: 8 }}>
        {items.map((it) => (
          <a key={it.href} href={it.href} style={{ padding: 10, borderRadius: 12 }}>
            {it.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
