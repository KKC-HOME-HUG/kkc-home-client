import type { MetadataRoute } from "next";
import { searchProperties } from "@/lib/properties";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  let slugs: string[] = [];
  try {
    slugs = (await searchProperties({ per_page: "100" })).items.map((p) => p.slug);
  } catch {
    slugs = [];
  }

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, changeFrequency: "daily", priority: 0.9 },
    ...slugs.map((slug) => ({
      url: `${base}/properties/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
