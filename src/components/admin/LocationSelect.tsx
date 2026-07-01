"use client";

import { useEffect, useState } from "react";
import type { AdminMeta, Tambon } from "@/lib/admin-properties";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/+$/, "");

// amphoe → tambon cascade + zone (filtered by amphoe). Tambons are fetched from the
// public lookup when the amphoe changes; `tambons` seeds the initial list (edit page).
export default function LocationSelect({
  meta,
  amphoe,
  tambon,
  zone,
  tambons: initial = [],
}: {
  meta: AdminMeta;
  amphoe?: number;
  tambon?: number;
  zone?: number | null;
  tambons?: Tambon[];
}) {
  const [amphoeCode, setAmphoeCode] = useState(amphoe ?? 0);
  const [tambonCode, setTambonCode] = useState(tambon ?? 0);
  const [tambons, setTambons] = useState<Tambon[]>(initial);
  const [loadedFor, setLoadedFor] = useState(amphoe ?? 0);

  useEffect(() => {
    if (!amphoeCode || amphoeCode === loadedFor) return;
    let active = true;
    fetch(`${BASE}/api/filters/tambons?amphoe=${amphoeCode}`)
      .then((r) => r.json())
      .then((b) => {
        if (!active) return;
        setTambons(b?.result?.tambons ?? b?.tambons ?? []);
        setLoadedFor(amphoeCode);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [amphoeCode, loadedFor]);

  const zones = meta.zones.filter((z) => z.amphoeCode === amphoeCode);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block">
        <span className="mb-1 block text-xs text-base-content/60">อำเภอ</span>
        <select
          name="amphoeCode"
          value={amphoeCode || ""}
          onChange={(e) => {
            setAmphoeCode(Number(e.target.value));
            setTambonCode(0);
          }}
          required
          className="select select-bordered w-full"
        >
          <option value="">เลือกอำเภอ</option>
          {meta.amphoes.map((a) => (
            <option key={a.code} value={a.code}>
              {a.nameTh}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-base-content/60">ตำบล</span>
        <select
          name="tambonCode"
          value={tambonCode || ""}
          onChange={(e) => setTambonCode(Number(e.target.value))}
          required
          className="select select-bordered w-full"
        >
          <option value="">เลือกตำบล</option>
          {tambons.map((t) => (
            <option key={t.code} value={t.code}>
              {t.nameTh}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-base-content/60">ย่าน (ถ้ามี)</span>
        <select name="zoneId" defaultValue={zone ?? ""} className="select select-bordered w-full">
          <option value="">— ไม่ระบุ —</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nameTh}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
