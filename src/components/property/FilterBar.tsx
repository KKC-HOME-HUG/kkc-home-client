"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuSearch, LuChevronDown } from "react-icons/lu";
import type { FilterMeta } from "@/lib/properties";

const PRESETS: { label: string; min: string; max: string }[] = [
  { label: "ไม่เกิน 1 ล้าน", min: "", max: "1000000" },
  { label: "1 – 3 ล้าน", min: "1000000", max: "3000000" },
  { label: "3 – 5 ล้าน", min: "3000000", max: "5000000" },
  { label: "5 – 10 ล้าน", min: "5000000", max: "10000000" },
  { label: "10 ล้านขึ้นไป", min: "10000000", max: "" },
];

function fmt(v: string): string {
  const n = Number(v);
  if (!n) return "";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)} ล้าน`;
  }
  return n.toLocaleString("th-TH");
}

function priceLabel(min: string, max: string): string {
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (max) return `ไม่เกิน ${fmt(max)}`;
  if (min) return `ตั้งแต่ ${fmt(min)}`;
  return "ราคา";
}

export default function FilterBar({
  meta,
  current,
}: {
  meta: FilterMeta | null;
  current: Record<string, string>;
}) {
  const router = useRouter();
  const [priceMin, setPriceMin] = useState(current.price_min ?? "");
  const [priceMax, setPriceMax] = useState(current.price_max ?? "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const qs = new URLSearchParams();
    for (const [k, v] of fd.entries()) {
      const val = String(v).trim();
      if (val) qs.set(k, val);
    }
    router.push(`/properties?${qs.toString()}`);
  }

  const sel = "select select-bordered select-sm";
  const hasPrice = Boolean(priceMin || priceMax);

  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2 p-3">
        <label className="input input-bordered input-sm flex min-w-[160px] flex-1 items-center gap-2">
          <LuSearch size={16} className="opacity-50" />
          <input name="q" defaultValue={current.q ?? ""} placeholder="ค้นหา" className="grow" />
        </label>

        <select name="kind" defaultValue={current.kind ?? ""} className={sel}>
          <option value="">ขาย/เช่า</option>
          <option value="sale">ขาย</option>
          <option value="rent">เช่า</option>
        </select>
        <select name="type_code" defaultValue={current.type_code ?? ""} className={sel}>
          <option value="">ประเภท</option>
          {meta?.types.map((t) => (
            <option key={t.code} value={t.code}>
              {t.nameTh}
            </option>
          ))}
        </select>
        <select name="zone" defaultValue={current.zone ?? ""} className={sel}>
          <option value="">ย่าน</option>
          {meta?.zones.map((z) => (
            <option key={z.slug} value={z.slug}>
              {z.nameTh}
            </option>
          ))}
        </select>

        {/* Price range — daisyUI dropdown + card popover */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className={`btn btn-sm gap-1 font-normal ${hasPrice ? "btn-primary" : "btn-outline border-base-300"}`}
          >
            {priceLabel(priceMin, priceMax)}
            <LuChevronDown size={14} />
          </div>
          <div
            tabIndex={0}
            className="card dropdown-content card-compact z-20 mt-2 w-72 border border-base-200 bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <span className="text-sm font-medium">ช่วงราคา (บาท)</span>
              <div className="join w-full">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="ต่ำสุด"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="input input-bordered input-sm join-item w-full"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="สูงสุด"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="input input-bordered input-sm join-item w-full"
                />
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {PRESETS.map((p) => {
                  const active = priceMin === p.min && priceMax === p.max;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setPriceMin(p.min);
                        setPriceMax(p.max);
                      }}
                      className={`btn btn-xs ${active ? "btn-primary" : "btn-outline border-base-300"}`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {hasPrice ? (
                <button
                  type="button"
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="btn btn-ghost btn-xs mt-1 w-fit text-base-content/60"
                >
                  ล้างราคา
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* submitted via FormData */}
        <input type="hidden" name="price_min" value={priceMin} />
        <input type="hidden" name="price_max" value={priceMax} />

        <select name="sort" defaultValue={current.sort ?? "newest"} className={sel}>
          <option value="newest">ล่าสุด</option>
          <option value="price_asc">ราคาต่ำ→สูง</option>
          <option value="price_desc">ราคาสูง→ต่ำ</option>
        </select>
        <button type="submit" className="btn btn-primary btn-sm">
          ค้นหา
        </button>
      </form>
    </div>
  );
}
