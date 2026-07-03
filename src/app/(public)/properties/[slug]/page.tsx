import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LuBedDouble, LuBath, LuMaximize, LuMapPin } from "react-icons/lu";
import { getProperty } from "@/lib/properties";
import { TYPE_BADGES } from "@/lib/properties";
import Gallery from "@/components/property/Gallery";
import MapEmbed from "@/components/property/MapEmbed";
import ContactForm from "@/components/property/ContactForm";
import LineContactCard from "@/components/property/LineContactCard";
import { getSiteSettings } from "@/lib/site-settings";

const baht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

const GROUP_LABEL: Record<string, string> = {
  IN_UNIT: "ในห้อง/ตัวบ้าน",
  COMMON: "ส่วนกลาง",
  SECURITY: "ความปลอดภัย",
  NEARBY: "ใกล้เคียง",
};
const GROUPS = ["IN_UNIT", "COMMON", "SECURITY", "NEARBY"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) return { title: "ไม่พบทรัพย์" };
  return {
    title: p.title,
    description: p.description ?? `${p.type.nameTh} ${p.location.amphoe.nameTh}`,
    openGraph: { title: p.title, images: p.cover_url ? [p.cover_url] : [] },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) notFound();
  const s = await getSiteSettings();

  const sale = p.offers.find((o) => o.kind === "SALE");
  const rent = p.offers.find((o) => o.kind === "RENT");
  const place = [p.location.zone?.nameTh, p.location.tambon.nameTh, p.location.amphoe.nameTh]
    .filter(Boolean)
    .join(" · ");

  const specs: { icon: React.ReactNode; label: string }[] = [];
  if (p.bedrooms) specs.push({ icon: <LuBedDouble size={18} />, label: `${p.bedrooms} ห้องนอน` });
  if (p.bathrooms) specs.push({ icon: <LuBath size={18} />, label: `${p.bathrooms} ห้องน้ำ` });
  if (p.usable_area_sqm) specs.push({ icon: <LuMaximize size={18} />, label: `${p.usable_area_sqm} ตร.ม.` });
  if (p.land_area_sqw) specs.push({ icon: <LuMaximize size={18} />, label: `${p.land_area_sqw} ตร.ว.` });

  const card = "rounded-xl bg-base-100 p-5 shadow-sm ring-1 ring-base-200";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description ?? undefined,
    image: p.media.map((m) => m.url),
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/properties/${p.slug}`,
  };

  return (
    <div className="bg-base-200/40">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="breadcrumbs mb-3 text-sm">
          <ul>
            <li><Link href="/">หน้าแรก</Link></li>
            <li><Link href="/properties">ทรัพย์</Link></li>
            <li className="max-w-[50vw] truncate">{p.title}</li>
          </ul>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Gallery media={p.media} alt={p.title} />

            <div className={card}>
              <div className="flex flex-wrap gap-1">
                <span className="badge badge-ghost">{p.type.nameTh}</span>
                {p.condition && TYPE_BADGES[p.condition] ? (
                  <span className="badge badge-primary">{TYPE_BADGES[p.condition]}</span>
                ) : null}
              </div>
              <h1 className="mt-2 text-2xl font-bold">{p.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-base-content/60">
                <LuMapPin size={16} /> {place}
              </p>

              <div className="mt-4 flex flex-wrap items-end gap-8">
                {sale ? (
                  <div>
                    <div className="text-xs text-base-content/50">ราคาขาย</div>
                    <div className="text-2xl font-bold text-primary">{baht(sale.price)}</div>
                  </div>
                ) : null}
                {rent ? (
                  <div>
                    <div className="text-xs text-base-content/50">ค่าเช่า</div>
                    <div className="text-2xl font-bold text-secondary">
                      {baht(rent.price)}
                      <span className="text-base font-normal">/เดือน</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {specs.length ? (
                <div className="mt-4 flex flex-wrap gap-6 border-t border-base-200 pt-4 text-sm text-base-content/80">
                  {specs.map((s, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {s.icon}
                      {s.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {p.description ? (
              <div className={card}>
                <h2 className="mb-2 font-semibold">รายละเอียด</h2>
                <p className="whitespace-pre-line text-base-content/80">{p.description}</p>
              </div>
            ) : null}

            {p.facilities.length ? (
              <div className={card}>
                <h2 className="mb-3 font-semibold">สิ่งอำนวยความสะดวก</h2>
                <div className="space-y-3">
                  {GROUPS.map((g) => {
                    const items = p.facilities.filter((f) => f.group === g);
                    if (!items.length) return null;
                    return (
                      <div key={g}>
                        <div className="mb-1 text-xs font-medium text-base-content/50">{GROUP_LABEL[g]}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((f) => (
                            <span key={f.code} className="badge badge-outline">
                              {f.nameTh}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className={card}>
              <h2 className="mb-3 font-semibold">ที่ตั้ง</h2>
              <MapEmbed lat={p.geo.lat} lng={p.geo.lng} title={p.title} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <LineContactCard lineUrl={s.line_url} phone={s.phone} />
              <div className={card}>
                <ContactForm slug={p.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
