const TOKEN_KEY = "nimbus_token";
const CONV_PREFIX = "nimbus.conversation_id.";

/**
 * Read token safely (client-only)
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token.trim() ? token : null;
}

/**
 * Persist token safely
 * - trims
 * - ignores empty values
 */
export function setToken(token: string) {
  if (typeof window === "undefined") return;

  const clean = token?.trim();
  if (!clean) return;

  localStorage.setItem(TOKEN_KEY, clean);
}

/**
 * Clear auth token only
 */
export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Simple auth helper
 * Use this in route guards
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * FULL logout (used by UI)
 * - clears token
 * - clears chat conversation state
 */
export function logoutEverywhere() {
  if (typeof window === "undefined") return;

  clearToken();

  // remove all stored conversation IDs
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(CONV_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}
