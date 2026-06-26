import Link from "next/link";
import type { Metadata } from "next";
import { searchProperties, getFilterMeta } from "@/lib/properties";
import PropertyCard from "@/components/property/PropertyCard";
import FilterBar from "@/components/property/FilterBar";

export const metadata: Metadata = { title: "ค้นหาทรัพย์" };

type SP = Record<string, string | string[] | undefined>;

function toCurrent(sp: SP): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) out[k] = Array.isArray(v) ? v[0] ?? "" : v ?? "";
  return out;
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [meta, result] = await Promise.all([
    getFilterMeta(),
    searchProperties(sp).catch(() => null),
  ]);

  const current = toCurrent(sp);
  const items = result?.items ?? [];
  const total = result?.total ?? 0;
  const page = result?.page ?? 1;
  const perPage = result?.per_page ?? 12;
  const pages = Math.max(1, Math.ceil(total / perPage));

  const linkFor = (n: number) => {
    const qs = new URLSearchParams(current);
    qs.set("page", String(n));
    return `/properties?${qs.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">ทรัพย์ในขอนแก่น</h1>

      <div className="mt-4">
        <FilterBar meta={meta} current={current} />
      </div>

      <p className="mb-5 mt-4 text-sm text-base-content/60">พบ {total.toLocaleString("th-TH")} รายการ</p>

      {items.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-base-200 py-16 text-center text-base-content/50">
          ไม่พบทรัพย์ตามเงื่อนไข
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-8 flex justify-center">
          <div className="join">
            {page > 1 ? (
              <Link href={linkFor(page - 1)} className="btn btn-sm join-item">
                ก่อนหน้า
              </Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ก่อนหน้า</button>
            )}
            <button className="btn btn-sm join-item pointer-events-none">
              {page} / {pages}
            </button>
            {page < pages ? (
              <Link href={linkFor(page + 1)} className="btn btn-sm join-item">
                ถัดไป
              </Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ถัดไป</button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
