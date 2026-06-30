"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiPatch, apiPost, apiDel } from "./session";

export async function updateLead(
  id: string,
  patch: { status?: string; handledByUserId?: string | null },
) {
  try {
    await apiPatch(`/api/admin/leads/${id}`, patch);
  } catch {
    // ignore (UI revalidates from server truth)
  }
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
}

export async function addLeadNote(id: string, body: string) {
  const text = body.trim();
  if (!text) return;
  try {
    await apiPost(`/api/admin/leads/${id}/notes`, { body: text });
  } catch {
    // ignore
  }
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(id: string) {
  try {
    await apiDel(`/api/admin/leads/${id}`);
  } catch {
    // ignore
  }
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
