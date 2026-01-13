import * as React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-black/10 bg-white shadow-sm ${props.className ?? ""}`}
    />
  );
}
