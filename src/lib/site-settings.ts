// Public site contact/social settings (no auth). Cached briefly — they change rarely.
const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export type SiteSettings = {
  line_url: string;
  facebook_url: string;
  tiktok_url: string;
  phone: string;
};

const EMPTY: SiteSettings = { line_url: "", facebook_url: "", tiktok_url: "", phone: "" };

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/site`, { next: { revalidate: 300 } });
    if (!res.ok) return EMPTY;
    const body = await res.json();
    return { ...EMPTY, ...(body.result ?? body.results ?? {}) };
  } catch {
    return EMPTY;
  }
}
