import Link from "next/link";
import { LuBedDouble, LuBath, LuMaximize, LuMapPin } from "react-icons/lu";
import type { PropertyCard as Card } from "@/lib/properties";
import { TYPE_BADGES } from "@/lib/properties";

const baht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

export default function PropertyCard({ p }: { p: Card }) {
  const place = [p.location.zone?.nameTh, p.location.amphoe.nameTh].filter(Boolean).join(", ");
  const area = p.usable_area_sqm
    ? `${p.usable_area_sqm} ตร.ม.`
    : p.land_area_sqw
      ? `${p.land_area_sqw} ตร.ว.`
      : null;

  return (
    <Link href={`/properties/${p.slug}`} className="group">
      <div className="card overflow-hidden border border-base-200 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <figure className="relative aspect-[4/3] bg-base-200">
          {p.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.cover_url}
              alt={p.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute left-3 top-3 flex gap-1">
            {p.condition && TYPE_BADGES[p.condition] ? (
              <span className="badge badge-primary badge-sm font-medium">{TYPE_BADGES[p.condition]}</span>
            ) : null}
            {p.sale && p.rent ? (
              <span className="badge badge-sm border-0 bg-base-100/90 font-medium">ขาย/เช่า</span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10">
            {p.sale ? <div className="text-lg font-bold text-white">{baht(p.sale.price)}</div> : null}
            {p.rent ? (
              <div className="text-sm font-semibold text-white/90">{baht(p.rent.price)}/เดือน</div>
            ) : null}
          </div>
        </figure>

        <div className="card-body gap-0 p-4">
          <span className="badge badge-ghost badge-sm w-fit">{p.type.nameTh}</span>
          <h3 className="card-title mt-2 line-clamp-1 text-base">{p.title}</h3>
          <p className="flex items-center gap-1 text-sm text-base-content/60">
            <LuMapPin size={14} />
            <span className="line-clamp-1">{place}</span>
          </p>
          {p.bedrooms || p.bathrooms || area ? (
            <div className="mt-3 flex items-center gap-4 border-t border-base-200 pt-3 text-sm text-base-content/70">
              {p.bedrooms ? (
                <span className="flex items-center gap-1">
                  <LuBedDouble size={16} />
                  {p.bedrooms}
                </span>
              ) : null}
              {p.bathrooms ? (
                <span className="flex items-center gap-1">
                  <LuBath size={16} />
                  {p.bathrooms}
                </span>
              ) : null}
              {area ? (
                <span className="flex items-center gap-1">
                  <LuMaximize size={16} />
                  {area}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
