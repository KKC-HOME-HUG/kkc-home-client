"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "./api";
import { apiPost, apiPatch, apiPut, apiDel } from "./session";

export type MediaItem = { id: string; url: string; is_cover: boolean; sort_order: number };

export async function uploadImage(
  propertyId: string,
  payload: { filename: string; contentType: string; dataBase64: string },
): Promise<{ media: MediaItem } | { error: string }> {
  try {
    const media = await apiPost<MediaItem>(`/api/admin/properties/${propertyId}/media`, payload);
    revalidatePath(`/admin/properties/${propertyId}/edit`);
    return { media };
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "อัปโหลดไม่สำเร็จ" };
  }
}

export async function setCover(propertyId: string, mediaId: string) {
  try {
    await apiPatch(`/api/admin/properties/${propertyId}/media/${mediaId}/cover`);
  } catch {
    // optimistic UI already updated; ignore
  }
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function reorderMedia(propertyId: string, ids: string[]) {
  try {
    await apiPut(`/api/admin/properties/${propertyId}/media/order`, { ids });
  } catch {
    // ignore
  }
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function deleteImage(propertyId: string, mediaId: string) {
  try {
    await apiDel(`/api/admin/properties/${propertyId}/media/${mediaId}`);
  } catch {
    // ignore
  }
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}
