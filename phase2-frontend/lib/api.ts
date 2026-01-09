const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").trim();

const TOKEN_KEY = "nimbus_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

function buildError(status: number, text: string, fallback: string) {
  // FastAPI often returns {"detail": "..."}
  try {
    const parsed = text ? JSON.parse(text) : null;
    if (parsed?.detail) return new Error(`${status} ${parsed.detail}`);
  } catch {
    // ignore parse errors
  }
  return new Error(`${status} ${text || fallback || "Request failed"}`);
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> | undefined),
  };

  // ✅ Only set JSON content-type when there is a body AND it's not FormData
  if (!headers["Content-Type"] && opts.body && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw buildError(res.status, text, res.statusText);
  }

  // ✅ 204 No Content (common for DELETE)
  if (res.status === 204) return undefined as unknown as T;

  // ✅ Safe parsing: read text first, then parse only if not empty
  const raw = await res.text().catch(() => "");
  if (!raw) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.parse(raw) as T;
  }

  // Non-JSON successful response (rare here)
  return undefined as unknown as T;
}

export const api = {
  register(email: string, password: string) {
    return request<{ ok: boolean; id: number; email: string }>(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw buildError(res.status, text, res.statusText);
    }

    const data = (await res.json()) as { access_token: string; token_type: string };

    if (!data?.access_token) {
      throw new Error("Login succeeded but no access_token returned");
    }

    setToken(data.access_token);
    return data;
  },

  me() {
    return request<{ id: number; email: string }>(`/api/auth/me`);
  },

  listTasks() {
    return request<
      { id: number; title: string; is_completed: boolean; created_at: string; updated_at: string }[]
    >(`/api/tasks`);
  },

  createTask(title: string) {
    return request<{ id: number; title: string; is_completed: boolean }>(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  toggleTask(id: number) {
    return request<{ id: number; title: string; is_completed: boolean }>(`/api/tasks/${id}/toggle`, {
      method: "PATCH",
    });
  },

  // ✅ Now DELETE will NEVER try to parse JSON
  deleteTask(id: number) {
    return request<void>(`/api/tasks/${id}`, { method: "DELETE" });
  },
};
