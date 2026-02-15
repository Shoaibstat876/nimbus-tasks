// app/chat/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/services/auth";

/**
 * Chat Route Redirect Layer
 *
 * Spec-Kit rule:
 * - This route is not a UI surface.
 * - It only enforces auth and redirects deterministically.
 * - No rendering.
 * - No side UI logic.
 */
export default function ChatPage(): null {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    redirected.current = true;

    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    // AI is accessed via floating modal only.
    // Route-level chat is not exposed.
    router.replace("/tasks");
  }, [router]);

  return null;
}
