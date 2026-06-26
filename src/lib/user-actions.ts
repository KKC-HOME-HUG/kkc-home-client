"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { apiPost, apiPatch } from "./session";

export type UserFormState = { error?: string; ok?: boolean };

function message(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const payload = {
    email: String(formData.get("email") ?? "").trim(),
    displayName: String(formData.get("displayName") ?? "").trim(),
    role: String(formData.get("role") ?? "AGENT"),
    password: String(formData.get("password") ?? ""),
  };
  try {
    await apiPost("/api/users", payload);
  } catch (e) {
    return { error: message(e, "สร้างผู้ใช้ไม่สำเร็จ") };
  }
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const id = String(formData.get("id") ?? "");
  const payload = {
    displayName: String(formData.get("displayName") ?? "").trim(),
    role: String(formData.get("role") ?? "AGENT"),
  };
  try {
    await apiPatch(`/api/users/${id}`, payload);
  } catch (e) {
    return { error: message(e, "บันทึกไม่สำเร็จ") };
  }
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function resetUserPassword(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await apiPatch(`/api/users/${id}/password`, { password });
  } catch (e) {
    return { error: message(e, "รีเซ็ตรหัสผ่านไม่สำเร็จ") };
  }
  return { ok: true };
}

// Best-effort active toggle from the list row. API enforces self / last-admin guards
// (a blocked toggle simply leaves the row unchanged).
export async function setUserActive(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  try {
    await apiPatch(`/api/users/${id}`, { isActive });
  } catch {
    // guard hit (409) — ignore; UI stays as-is
  }
  revalidatePath("/admin/users");
}
