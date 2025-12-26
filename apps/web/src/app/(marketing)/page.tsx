import Link from "next/link";
import { Button, Card } from "@nimbus/ui";

export default function MarketingHome() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 36, margin: 0 }}>Nimbus Tasks</h1>
      <p style={{ margin: 0, opacity: 0.8 }}>
        A formal, professional task system with a guided wizard experience.
      </p>

      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/app">
            <Button>Enter App</Button>
          </Link>

          <Button variant="secondary" disabled>
            Try Wizard (Soon)
          </Button>
        </div>
      </Card>
    </div>
  );
}
