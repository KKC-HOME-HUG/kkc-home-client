"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { apiPost, apiPatch, apiPut, apiDel } from "./session";

export type PropFormState = { error?: string; ok?: boolean };

const msg = (e: unknown, fallback: string) => (e instanceof ApiError ? e.message : fallback);
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const optNum = (fd: FormData, k: string) => {
  const v = s(fd, k);
  return v === "" ? null : Number(v);
};

export async function createProperty(_prev: PropFormState, fd: FormData): Promise<PropFormState> {
  const payload = {
    typeCode: s(fd, "typeCode"),
    title: s(fd, "title"),
    amphoeCode: Number(s(fd, "amphoeCode")),
    tambonCode: Number(s(fd, "tambonCode")),
    zoneId: optNum(fd, "zoneId"),
  };
  let id: string;
  try {
    const r = await apiPost<{ id: string }>("/api/admin/properties", payload);
    id = r.id;
  } catch (e) {
    return { error: msg(e, "สร้างทรัพย์ไม่สำเร็จ") };
  }
  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${id}/edit`);
}

export async function updateProperty(_prev: PropFormState, fd: FormData): Promise<PropFormState> {
  const id = s(fd, "id");
  let attributes: Record<string, unknown> = {};
  try {
    attributes = JSON.parse(s(fd, "attributes") || "{}");
  } catch {
    return { error: "attributes ไม่ถูกต้อง" };
  }
  const payload = {
    title: s(fd, "title"),
    condition: s(fd, "condition") || null,
    description: s(fd, "description") || null,
    typeCode: s(fd, "typeCode"),
    amphoeCode: Number(s(fd, "amphoeCode")),
    tambonCode: Number(s(fd, "tambonCode")),
    zoneId: optNum(fd, "zoneId"),
    addressText: s(fd, "addressText") || null,
    latitude: optNum(fd, "latitude"),
    longitude: optNum(fd, "longitude"),
    bedrooms: optNum(fd, "bedrooms"),
    bathrooms: optNum(fd, "bathrooms"),
    usableAreaSqm: optNum(fd, "usableAreaSqm"),
    landAreaSqw: optNum(fd, "landAreaSqw"),
    attributes,
    facilities: fd.getAll("facilities").map(String),
  };
  try {
    await apiPatch(`/api/admin/properties/${id}`, payload);
  } catch (e) {
    return { error: msg(e, "บันทึกไม่สำเร็จ") };
  }
  revalidatePath(`/admin/properties/${id}/edit`);
  return { ok: true };
}

export async function saveOffers(_prev: PropFormState, fd: FormData): Promise<PropFormState> {
  const id = s(fd, "id");
  const sale = fd.get("sale_on")
    ? { price: Number(s(fd, "sale_price")), status: s(fd, "sale_status") || "AVAILABLE" }
    : null;
  const rent = fd.get("rent_on")
    ? {
        price: Number(s(fd, "rent_price")),
        deposit: optNum(fd, "rent_deposit"),
        minLeaseMonths: optNum(fd, "rent_min_lease"),
        status: s(fd, "rent_status") || "AVAILABLE",
      }
    : null;
  try {
    await apiPut(`/api/admin/properties/${id}/offers`, { sale, rent });
  } catch (e) {
    return { error: msg(e, "บันทึกข้อเสนอไม่สำเร็จ") };
  }
  revalidatePath(`/admin/properties/${id}/edit`);
  return { ok: true };
}

export async function publishProperty(_prev: PropFormState, fd: FormData): Promise<PropFormState> {
  const id = s(fd, "id");
  try {
    await apiPost(`/api/admin/properties/${id}/publish`);
  } catch (e) {
    return { error: msg(e, "เผยแพร่ไม่สำเร็จ") };
  }
  revalidatePath(`/admin/properties/${id}/edit`);
  return { ok: true };
}

export async function unpublishProperty(fd: FormData) {
  const id = s(fd, "id");
  try {
    await apiPost(`/api/admin/properties/${id}/unpublish`);
  } catch {
    // ignore
  }
  revalidatePath(`/admin/properties/${id}/edit`);
}

export async function deleteProperty(id: string): Promise<{ error: string } | void> {
  try {
    await apiDel(`/api/admin/properties/${id}`);
  } catch (e) {
    return { error: msg(e, "ลบทรัพย์ไม่สำเร็จ") };
  }
  revalidatePath("/admin/properties");
  redirect("/admin/properties?deleted=1"); // NEXT_REDIRECT — must stay outside the try
}
