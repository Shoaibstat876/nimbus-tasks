// app/chat/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/services/auth";

/**
 
 *
 * Spec-Kit rule:
 * - This route is not a UI surface.
 * - It only enforces auth and redirects deterministically.
 */
export default function ChatPage(): null {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    router.replace("/tasks");
  }, [router]);

  return null;
}
