import "server-only";
import { apiGet } from "./session";

export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: LeadStatus;
  source: string;
  property: { slug: string; title: string } | null;
  handled_by: { id: string; name: string } | null;
  contacted_at: string | null;
  created_at: string;
};
export type LeadList = { items: LeadListItem[]; total: number; page: number; per_page: number };

export type LeadNote = {
  id: string;
  body: string;
  author: string | null;
  is_system: boolean;
  created_at: string;
};
export type LeadDetail = LeadListItem & { message: string | null; notes: LeadNote[] };

export async function listLeads(qs: string): Promise<LeadList | null> {
  try {
    return await apiGet<LeadList>(`/api/admin/leads?${qs}`);
  } catch {
    return null;
  }
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  try {
    return await apiGet<LeadDetail>(`/api/admin/leads/${id}`);
  } catch {
    return null;
  }
}

export async function countNewLeads(): Promise<number | null> {
  try {
    const r = await apiGet<LeadList>("/api/admin/leads?status=NEW&per_page=1");
    return r.total;
  } catch {
    return null;
  }
}
