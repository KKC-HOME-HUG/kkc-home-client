import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { searchProperties } from "@/lib/properties";
import PropertyCard from "@/components/property/PropertyCard";

const CHIPS = [
  { label: "ซื้อ", href: "/properties?kind=sale" },
  { label: "เช่า", href: "/properties?kind=rent" },
  { label: "บ้านเดี่ยว", href: "/properties?type_code=DETACHED_HOUSE" },
  { label: "คอนโด", href: "/properties?type_code=CONDO" },
  { label: "ที่ดิน", href: "/properties?type_code=LAND" },
];

export default async function HomePage() {
  let featured = [] as Awaited<ReturnType<typeof searchProperties>>["items"];
  try {
    featured = (await searchProperties({ per_page: "6", sort: "newest" })).items;
  } catch {
    featured = [];
  }

  return (
    <div>
      <section className="border-b border-base-200">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center md:py-14">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">อสังหาริมทรัพย์ขอนแก่น</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">หาบ้านในขอนแก่น</h1>
          <p className="mx-auto mt-3 max-w-xl text-base-content/60">
            ซื้อ ขาย เช่า บ้าน คอนโด ที่ดิน และอาคารพาณิชย์ ในที่เดียว
          </p>

          <form action="/properties" className="join mx-auto mt-6 w-full max-w-xl shadow-sm">
            <label className="input input-bordered join-item flex flex-1 items-center gap-2">
              <LuSearch size={18} className="opacity-50" />
              <input
                name="q"
                placeholder="ค้นหาทำเล โครงการ หรือประเภททรัพย์"
                className="grow"
              />
            </label>
            <button type="submit" className="btn btn-primary join-item px-6">
              ค้นหา
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-full border border-base-300 px-4 py-1.5 text-sm text-base-content/70 transition hover:border-primary hover:text-primary"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">ทรัพย์แนะนำ</h2>
            <p className="mt-1 text-sm text-base-content/60">ทรัพย์ล่าสุดในขอนแก่น</p>
          </div>
          <Link href="/properties" className="text-sm font-medium text-primary hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        {featured.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-base-200 py-16 text-center text-base-content/50">
            ยังไม่มีทรัพย์ หรือ API ไม่พร้อมใช้งาน
          </div>
        )}
      </section>
    </div>
  );
}
