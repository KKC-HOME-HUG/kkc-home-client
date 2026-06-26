"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { TOKEN_COOKIE } from "./session";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/admin");
  const next = nextRaw.startsWith("/") ? nextRaw : "/admin";

  let token: string;
  try {
    const res = await api.post<{ token: string }>("/api/auth/login", { email, password });
    token = res.token;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    return { error: "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }

  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day — matches JWT_EXPIRES (24h)
  });

  redirect(next);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/login");
}
