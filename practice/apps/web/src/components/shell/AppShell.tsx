import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateRows: "56px 1fr", height: "100vh" }}>
      <TopNav />
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
        <SideNav />
        <main style={{ overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
