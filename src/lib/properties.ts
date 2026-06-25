import { api } from "./api";

export type CardType = { code: string; nameTh: string; category: string };
export type LocationRef = {
  zone: { slug: string; nameTh: string } | null;
  amphoe: { code: number; nameTh: string };
  tambon: { code: number; nameTh: string };
};
export type PropertyCard = {
  slug: string;
  title: string;
  type: CardType;
  condition: string | null;
  cover_url: string | null;
  location: LocationRef;
  lat: number | null;
  lng: number | null;
  sale: { price: number } | null;
  rent: { price: number; deposit: number | null } | null;
  bedrooms: number | null;
  bathrooms: number | null;
  usable_area_sqm: number | null;
  land_area_sqw: number | null;
};
export type Offer = {
  kind: string;
  price: number;
  deposit: number | null;
  min_lease_months: number | null;
  status: string;
};
export type FacilityItem = { code: string; group: string; nameTh: string; nameEn: string };
export type PropertyDetail = PropertyCard & {
  description: string | null;
  address_text: string | null;
  attributes: Record<string, unknown>;
  offers: Offer[];
  media: { url: string; is_cover: boolean; sort_order: number }[];
  facilities: FacilityItem[];
  geo: { lat: number | null; lng: number | null };
};
export type SearchResult = { items: PropertyCard[]; total: number; page: number; per_page: number };
export type FilterMeta = {
  categories: string[];
  facility_groups: string[];
  types: { code: string; category: string; nameTh: string; nameEn: string }[];
  zones: { slug: string; nameTh: string; nameEn: string; amphoeCode: number }[];
  facilities: FacilityItem[];
  amphoes: { code: number; nameTh: string; nameEn: string }[];
};

export async function searchProperties(
  params: Record<string, string | string[] | undefined> = {},
): Promise<SearchResult> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val != null && val !== "") qs.set(k, String(val));
  }
  return api.get<SearchResult>(`/api/properties?${qs.toString()}`, { cache: "no-store" });
}

export async function getProperty(slug: string): Promise<PropertyDetail | null> {
  try {
    return await api.get<PropertyDetail>(`/api/properties/${slug}`, { cache: "no-store" });
  } catch {
    return null;
  }
}

export async function getFilterMeta(): Promise<FilterMeta | null> {
  try {
    return await api.get<FilterMeta>("/api/filters/meta", { cache: "no-store" });
  } catch {
    return null;
  }
}

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  property_slug?: string;
};

export async function createLead(input: LeadInput): Promise<{ id: string }> {
  return api.post<{ id: string }>("/api/leads", input);
}

export const TYPE_BADGES: Record<string, string> = {
  NEW_PROJECT: "โครงการใหม่",
  SECOND_HAND: "มือสอง",
};
