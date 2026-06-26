"use client";

import { useActionState } from "react";
import { updateUser, resetUserPassword, type UserFormState } from "@/lib/user-actions";
import type { AdminUser } from "@/lib/session";
import UserActiveToggle from "./UserActiveToggle";

export default function UserEditForm({ user }: { user: AdminUser }) {
  const [profile, updateAction, savingProfile] = useActionState<UserFormState, FormData>(updateUser, {});
  const [pw, pwAction, savingPw] = useActionState<UserFormState, FormData>(resetUserPassword, {});

  return (
    <div className="space-y-8">
      {/* Profile + role */}
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="id" value={user.id} />
        <div>
          <label className="mb-1 block text-sm font-medium">อีเมล</label>
          <input value={user.email} disabled className="input input-bordered w-full opacity-60" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">ชื่อที่แสดง</label>
          <input name="displayName" defaultValue={user.displayName} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">บทบาท</label>
          <select name="role" defaultValue={user.role} className="select select-bordered w-full">
            <option value="AGENT">AGENT (เอเจนต์)</option>
            <option value="ADMIN">ADMIN (ผู้ดูแล)</option>
          </select>
        </div>
        {profile.error ? <p className="text-sm text-error">{profile.error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={savingProfile}>
          {savingProfile ? "กำลังบันทึก…" : "บันทึก"}
        </button>
      </form>

      <div className="divider" />

      {/* Reset password */}
      <form action={pwAction} className="space-y-3">
        <input type="hidden" name="id" value={user.id} />
        <label className="block text-sm font-medium">รีเซ็ตรหัสผ่าน</label>
        <input name="password" type="password" required minLength={8} placeholder="รหัสผ่านใหม่" className="input input-bordered w-full" />
        {pw.error ? <p className="text-sm text-error">{pw.error}</p> : null}
        {pw.ok ? <p className="text-sm text-success">รีเซ็ตรหัสผ่านแล้ว</p> : null}
        <button type="submit" className="btn btn-outline btn-sm" disabled={savingPw}>
          {savingPw ? "กำลังรีเซ็ต…" : "รีเซ็ตรหัสผ่าน"}
        </button>
      </form>

      <div className="divider" />

      {/* Activate / deactivate */}
      <div className="space-y-1">
        <label className="flex items-center gap-3">
          <UserActiveToggle id={user.id} isActive={user.isActive} />
          <span className="text-sm font-medium">
            {user.isActive ? "เปิดใช้งานอยู่" : "ปิดใช้งานอยู่"}
          </span>
        </label>
        <p className="text-xs text-base-content/50">
          ปิดใช้งานแล้วผู้ใช้จะเข้าระบบไม่ได้ และ token เดิมถูกตัดทันที (ปิดตัวเอง/แอดมินคนสุดท้ายไม่ได้)
        </p>
      </div>
    </div>
  );
}
