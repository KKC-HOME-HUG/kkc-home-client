import "server-only";
import { apiGet } from "./session";

export type AdminListItem = {
  id: string;
  ref_no: number;
  slug: string;
  title: string;
  type: string;
  amphoe: string;
  zone: string | null;
  cover_url: string | null;
  is_published: boolean;
  offers: { kind: string; price: number; status: string }[];
};
export type AdminList = { items: AdminListItem[]; total: number; page: number; per_page: number };

export type OfferDetail = {
  kind: string;
  price: number;
  deposit: number | null;
  min_lease_months: number | null;
  status: string;
};
export type AdminDetail = {
  id: string;
  ref_no: number;
  slug: string;
  type_code: string;
  condition: string | null;
  title: string;
  description: string | null;
  amphoe_code: number;
  tambon_code: number;
  zone_id: number | null;
  address_text: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  usable_area_sqm: number | null;
  land_area_sqw: number | null;
  attributes: Record<string, unknown>;
  is_published: boolean;
  offers: OfferDetail[];
  facilities: string[];
  media: { id: string; url: string; is_cover: boolean; sort_order: number }[];
};

export type AdminMeta = {
  types: { code: string; category: string; nameTh: string }[];
  zones: { id: number; nameTh: string; amphoeCode: number }[];
  facilities: { code: string; group: string; nameTh: string }[];
  amphoes: { code: number; nameTh: string }[];
  facility_groups: string[];
};
export type Tambon = { code: number; nameTh: string };

export async function listAdminProperties(qs: string): Promise<AdminList | null> {
  try {
    return await apiGet<AdminList>(`/api/admin/properties?${qs}`);
  } catch {
    return null;
  }
}

export async function getAdminProperty(id: string): Promise<AdminDetail | null> {
  try {
    return await apiGet<AdminDetail>(`/api/admin/properties/${id}`);
  } catch {
    return null;
  }
}

export async function getAdminMeta(): Promise<AdminMeta | null> {
  try {
    return await apiGet<AdminMeta>("/api/filters/meta");
  } catch {
    return null;
  }
}

export async function getTambons(amphoe: number): Promise<Tambon[]> {
  try {
    const r = await apiGet<{ tambons: Tambon[] }>(`/api/filters/tambons?amphoe=${amphoe}`);
    return r.tambons;
  } catch {
    return [];
  }
}
