const TOKEN_KEY = "nimbus_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  const clean = (token ?? "").trim();
  if (!clean) return;
  localStorage.setItem(TOKEN_KEY, clean);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}
