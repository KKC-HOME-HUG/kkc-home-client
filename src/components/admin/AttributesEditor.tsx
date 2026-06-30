"use client";

import { useState } from "react";
import { LuPlus, LuX } from "react-icons/lu";

type Row = { k: string; v: string };

// Free-form key→value editor for the property `attributes` JSONB. Serializes to a
// hidden `attributes` input so the parent form submits it as JSON.
export default function AttributesEditor({ initial }: { initial: Record<string, unknown> }) {
  const [rows, setRows] = useState<Row[]>(
    Object.entries(initial ?? {}).map(([k, v]) => ({ k, v: String(v) })),
  );

  const json = JSON.stringify(
    rows.reduce<Record<string, string>>((acc, r) => {
      const key = r.k.trim();
      if (key) acc[key] = r.v;
      return acc;
    }, {}),
  );

  const set = (i: number, patch: Partial<Row>) =>
    setRows(rows.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-2">
      <input type="hidden" name="attributes" value={json} />
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={r.k}
            onChange={(e) => set(i, { k: e.target.value })}
            placeholder="คีย์ เช่น floor"
            className="input input-bordered input-sm w-1/3"
          />
          <input
            value={r.v}
            onChange={(e) => set(i, { v: e.target.value })}
            placeholder="ค่า เช่น 8"
            className="input input-bordered input-sm flex-1"
          />
          <button
            type="button"
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="ลบ"
          >
            <LuX size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows([...rows, { k: "", v: "" }])}
        className="btn btn-outline btn-sm gap-1"
      >
        <LuPlus size={14} /> เพิ่มข้อมูล
      </button>
    </div>
  );
}
