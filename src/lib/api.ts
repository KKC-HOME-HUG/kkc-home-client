// Fetch client for the Hapi API. Base URL from NEXT_PUBLIC_API_BASE_URL (only
// NEXT_PUBLIC_* values reach the browser — no privileged secrets here).
// Loosely typed for now; OpenAPI type-generation is deferred.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type Envelope<T> = {
  status_code?: string;
  message?: string;
  result?: T;
  results?: T;
  error?: unknown;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  const code = body?.status_code ? Number(body.status_code) : res.status;

  if (!body || code >= 400) {
    throw new ApiError(code, body?.message ?? res.statusText, body?.error);
  }

  return (body.result ?? body.results) as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
};
