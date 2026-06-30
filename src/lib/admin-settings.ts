import "server-only";
import { apiGet } from "./session";

export type ZoneItem = {
  id: number;
  slug: string;
  nameTh: string;
  nameEn: string;
  amphoeCode: number;
  amphoe: string;
  tambonCode: number | null;
  tambon: string | null;
  isActive: boolean;
  sortOrder: number;
};
export type TypeItem = {
  code: string;
  category: string;
  nameTh: string;
  nameEn: string;
  isActive: boolean;
  sortOrder: number;
};
export type FacilityItem = {
  code: string;
  group: string;
  nameTh: string;
  nameEn: string;
  isActive: boolean;
  sortOrder: number;
};
export type Amphoe = { code: number; nameTh: string };

export async function getZones(): Promise<ZoneItem[]> {
  try {
    return (await apiGet<{ items: ZoneItem[] }>("/api/admin/zones")).items;
  } catch {
    return [];
  }
}
export async function getTypes(): Promise<TypeItem[]> {
  try {
    return (await apiGet<{ items: TypeItem[] }>("/api/admin/property-types")).items;
  } catch {
    return [];
  }
}
export async function getFacilities(): Promise<FacilityItem[]> {
  try {
    return (await apiGet<{ items: FacilityItem[] }>("/api/admin/facilities")).items;
  } catch {
    return [];
  }
}
export async function getAmphoes(): Promise<Amphoe[]> {
  try {
    return (await apiGet<{ amphoes: Amphoe[] }>("/api/filters/meta")).amphoes ?? [];
  } catch {
    return [];
  }
}
