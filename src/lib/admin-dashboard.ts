import "server-only";
import { apiGet } from "./session";

export type Dashboard = {
  properties: { total: number; published: number; draft: number };
  leads: { new: number; contacted: number; closed: number; total: number };
  recent_new_leads: { id: string; name: string; phone: string; property: string | null; created_at: string }[];
  recent_properties: { id: string; slug: string; title: string; is_published: boolean; updated_at: string }[];
};

export async function getDashboard(): Promise<Dashboard | null> {
  try {
    return await apiGet<Dashboard>("/api/admin/stats");
  } catch {
    return null;
  }
}
