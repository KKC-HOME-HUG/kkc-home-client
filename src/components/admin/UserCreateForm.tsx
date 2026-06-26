"use client";

import { useActionState } from "react";
import { createUser, type UserFormState } from "@/lib/user-actions";

export default function UserCreateForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(createUser, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">ชื่อที่แสดง</label>
        <input name="displayName" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">อีเมล</label>
        <input name="email" type="email" required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">บทบาท</label>
        <select name="role" defaultValue="AGENT" className="select select-bordered w-full">
          <option value="AGENT">AGENT (เอเจนต์)</option>
          <option value="ADMIN">ADMIN (ผู้ดูแล)</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">รหัสผ่าน</label>
        <input name="password" type="password" required minLength={8} className="input input-bordered w-full" />
        <p className="mt-1 text-xs text-base-content/50">อย่างน้อย 8 ตัวอักษร</p>
      </div>
      {state.error ? <p className="text-sm text-error">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "สร้างผู้ใช้"}
      </button>
    </form>
  );
}
