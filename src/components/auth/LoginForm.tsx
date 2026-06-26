"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/auth-actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-6 space-y-3">
      <input type="hidden" name="next" value={next} />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="อีเมล"
        className="input input-bordered w-full"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="รหัสผ่าน"
        className="input input-bordered w-full"
      />
      {state.error ? <p className="text-sm text-error">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
