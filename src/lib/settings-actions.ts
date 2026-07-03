"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "./api";
import { apiGet, apiPost, apiPatch, apiPut } from "./session";

export type CreateInput = { nameTh: string; nameEn: string; meta: string; meta2?: string; ident?: string };
export type UpdateInput = { nameTh?: string; nameEn?: string; meta?: string; meta2?: string; isActive?: boolean };
export type Result = { id?: string | number; error?: string };
export type Option = { value: string; label: string };

const RP = () => revalidatePath("/admin/settings");
const err = (e: unknown, f: string) => (e instanceof ApiError ? e.message : f);

/* ---- site contact/social settings (single record) ---- */
export type ContactSettings = { line_url: string; facebook_url: string; tiktok_url: string; phone: string };

export async function updateSiteSettings(input: ContactSettings): Promise<Result> {
  try {
    await apiPatch("/api/admin/site-settings", input);
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout"); // refresh the public footer/detail that read these
    return {};
  } catch (e) {
    return { error: err(e, "บันทึกไม่สำเร็จ") };
  }
}

// Tambon options for one amphoe — feeds the zone form's amphoe → tambon cascade.
export async function loadTambons(amphoeCode: string): Promise<Option[]> {
  if (!amphoeCode) return [];
  try {
    const r = await apiGet<{ tambons: { code: number; nameTh: string }[] }>(`/api/filters/tambons?amphoe=${amphoeCode}`);
    return (r.tambons ?? []).map((t) => ({ value: String(t.code), label: t.nameTh }));
  } catch {
    return [];
  }
}

/* ---- zones (key = id, meta = amphoeCode, ident = slug optional) ---- */
export async function createZone(i: CreateInput): Promise<Result> {
  try {
    const r = await apiPost<{ id: number }>("/api/admin/zones", {
      nameTh: i.nameTh,
      nameEn: i.nameEn,
      amphoeCode: Number(i.meta),
      tambonCode: i.meta2 ? Number(i.meta2) : null,
      slug: i.ident || undefined,
    });
    RP();
    return { id: r.id };
  } catch (e) {
    return { error: err(e, "สร้างย่านไม่สำเร็จ") };
  }
}
export async function updateZone(id: string | number, p: UpdateInput): Promise<Result> {
  const body: Record<string, unknown> = {};
  if (p.nameTh !== undefined) body.nameTh = p.nameTh;
  if (p.nameEn !== undefined) body.nameEn = p.nameEn;
  if (p.meta !== undefined) body.amphoeCode = Number(p.meta);
  if (p.meta2 !== undefined) body.tambonCode = p.meta2 ? Number(p.meta2) : null;
  if (p.isActive !== undefined) body.isActive = p.isActive;
  try {
    await apiPatch(`/api/admin/zones/${id}`, body);
    RP();
    return {};
  } catch (e) {
    return { error: err(e, "บันทึกไม่สำเร็จ") };
  }
}
export async function reorderZones(keys: (string | number)[]) {
  try {
    await apiPut("/api/admin/zones/order", { ids: keys.map(Number) });
    RP();
  } catch {
    /* ignore */
  }
}

/* ---- property types (key = code, meta = category, ident = code) ---- */
export async function createType(i: CreateInput): Promise<Result> {
  try {
    await apiPost("/api/admin/property-types", { code: i.ident, category: i.meta, nameTh: i.nameTh, nameEn: i.nameEn });
    RP();
    return { id: i.ident };
  } catch (e) {
    return { error: err(e, "สร้างประเภทไม่สำเร็จ") };
  }
}
export async function updateType(code: string | number, p: UpdateInput): Promise<Result> {
  const body: Record<string, unknown> = {};
  if (p.nameTh !== undefined) body.nameTh = p.nameTh;
  if (p.nameEn !== undefined) body.nameEn = p.nameEn;
  if (p.meta !== undefined) body.category = p.meta;
  if (p.isActive !== undefined) body.isActive = p.isActive;
  try {
    await apiPatch(`/api/admin/property-types/${code}`, body);
    RP();
    return {};
  } catch (e) {
    return { error: err(e, "บันทึกไม่สำเร็จ") };
  }
}
export async function reorderTypes(keys: (string | number)[]) {
  try {
    await apiPut("/api/admin/property-types/order", { codes: keys.map(String) });
    RP();
  } catch {
    /* ignore */
  }
}

/* ---- facilities (key = code, meta = group, ident = code) ---- */
export async function createFacility(i: CreateInput): Promise<Result> {
  try {
    await apiPost("/api/admin/facilities", { code: i.ident, group: i.meta, nameTh: i.nameTh, nameEn: i.nameEn });
    RP();
    return { id: i.ident };
  } catch (e) {
    return { error: err(e, "สร้างสิ่งอำนวยฯ ไม่สำเร็จ") };
  }
}
export async function updateFacility(code: string | number, p: UpdateInput): Promise<Result> {
  const body: Record<string, unknown> = {};
  if (p.nameTh !== undefined) body.nameTh = p.nameTh;
  if (p.nameEn !== undefined) body.nameEn = p.nameEn;
  if (p.meta !== undefined) body.group = p.meta;
  if (p.isActive !== undefined) body.isActive = p.isActive;
  try {
    await apiPatch(`/api/admin/facilities/${code}`, body);
    RP();
    return {};
  } catch (e) {
    return { error: err(e, "บันทึกไม่สำเร็จ") };
  }
}
export async function reorderFacilities(keys: (string | number)[]) {
  try {
    await apiPut("/api/admin/facilities/order", { codes: keys.map(String) });
    RP();
  } catch {
    /* ignore */
  }
}
