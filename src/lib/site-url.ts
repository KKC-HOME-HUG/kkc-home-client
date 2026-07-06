// The site's absolute origin (no trailing slash): explicit env → Vercel → localhost.
// Used for metadataBase, sitemap, robots, canonicals, and JSON-LD urls so prod
// never falls back to localhost.
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
