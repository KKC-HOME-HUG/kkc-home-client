"use client";

import { useActionState } from "react";
import { createProperty, type PropFormState } from "@/lib/property-actions";
import LocationSelect from "./LocationSelect";
import type { AdminMeta } from "@/lib/admin-properties";

export default function PropertyCreateForm({ meta }: { meta: AdminMeta }) {
  const [state, action, pending] = useActionState<PropFormState, FormData>(createProperty, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">ประเภททรัพย์</label>
        <select name="typeCode" required className="select select-bordered w-full">
          <option value="">เลือกประเภท</option>
          {meta.types.map((t) => (
            <option key={t.code} value={t.code}>
              {t.nameTh}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">ชื่อประกาศ</label>
        <input name="title" required className="input input-bordered w-full" placeholder="เช่น บ้านเดี่ยว 2 ชั้น ใกล้มข." />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">ทำเล</label>
        <LocationSelect meta={meta} />
      </div>
      {state.error ? <p className="text-sm text-error">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "กำลังสร้าง…" : "สร้างแบบร่าง → กรอกรายละเอียด"}
      </button>
    </form>
  );
}
