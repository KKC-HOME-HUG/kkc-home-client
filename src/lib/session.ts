import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "./api";

// Server-only session / BFF layer. The JWT lives in an HttpOnly cookie on the web
// origin; only this module (server components + server actions) reads it and forwards
// it to the Hapi API as a bearer header. The token never reaches the browser.

export const TOKEN_COOKIE = "kkc_token";

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: "ADMIN" | "AGENT";
  isActive: boolean;
};

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

function authInit(token: string | null, init?: RequestInit): RequestInit {
  return {
    ...init,
    cache: "no-store",
    headers: { ...(init?.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  return api.get<T>(path, authInit(await getToken()));
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  return api.post<T>(path, data, authInit(await getToken()));
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  return api.patch<T>(path, data, authInit(await getToken()));
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  return api.put<T>(path, data, authInit(await getToken()));
}

export async function apiDel<T>(path: string): Promise<T> {
  return api.del<T>(path, authInit(await getToken()));
}

// Current user via /api/auth/me; null when unauthenticated or token rejected.
export async function getCurrentUser(): Promise<AdminUser | null> {
  if (!(await getToken())) return null;
  try {
    return await apiGet<AdminUser>("/api/auth/me");
  } catch {
    return null;
  }
}

// Page guard for ADMIN-only areas: bounce to login if unauthenticated, or to the
// dashboard if signed in without the ADMIN role.
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}
