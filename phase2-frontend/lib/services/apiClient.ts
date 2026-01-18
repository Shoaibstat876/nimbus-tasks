import { getToken } from "./auth";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").trim();

export class ApiError extends Error {
  readonly status: number;
  readonly bodyText?: string;

  constructor(status: number, message: string, bodyText?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

function buildError(status: number, text: string, fallback: string) {
  try {
    const parsed = text ? JSON.parse(text) : null;

    // FastAPI often uses { detail: "..." }, but sometimes detail can be list/dict
    if (parsed && "detail" in parsed) {
      const d = (parsed as any).detail;
      const detailText = typeof d === "string" ? d : JSON.stringify(d);
      return new ApiError(status, `${status} ${detailText}`, text);
    }
  } catch {
    // ignore JSON parse
  }

  return new ApiError(status, `${status} ${text || fallback || "Request failed"}`, text);
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> | undefined),
  };

  // Default JSON when body exists, unless Content-Type is already provided
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

  if (res.status === 204) return undefined as unknown as T;

  const raw = await res.text().catch(() => "");
  if (!raw) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.parse(raw) as T;
  }

  // If backend returns non-JSON on a success endpoint we expect JSON from,
  // return undefined rather than crashing.
  return undefined as unknown as T;
}

export type TaskDTO = {
  id: number;
  title: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type ChatResponse = {
  conversation_id: string;
  response: string;
  tool_calls?: unknown[]; // keep optional to avoid breaking existing UI
};

export type ChatHistoryResponse = {
  conversation_id: string;
  messages: ChatMessage[];
};

export const apiClient = {
  // Auth (NO token writes here — Law 3)
  register(email: string, password: string) {
    return request<{ ok: boolean; id: number; email: string }>(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string) {
    // Keep login inside boundary, but do NOT store token here.
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);

    return request<{ access_token: string; token_type: string }>(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  },

  me() {
    return request<{ id: number; email: string }>(`/api/auth/me`);
  },

  // Tasks
  listTasks() {
    return request<TaskDTO[]>(`/api/tasks`);
  },

  createTask(title: string) {
    return request<TaskDTO>(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  updateTask(id: number, title: string) {
    return request<TaskDTO>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  },

  toggleTask(id: number) {
    return request<TaskDTO>(`/api/tasks/${id}/toggle`, { method: "PATCH" });
  },

  deleteTask(id: number) {
    return request<void>(`/api/tasks/${id}`, { method: "DELETE" });
  },

  // Chat
  sendChatMessage(message: string, conversationId?: string) {
    return request<ChatResponse>(`/api/chat`, {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId || undefined,
      }),
    });
  },

  getChatHistory(conversationId: string) {
    return request<ChatHistoryResponse>(`/api/chat/history/${conversationId}`);
  },
};
