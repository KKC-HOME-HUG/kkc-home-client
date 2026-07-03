"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings, type ContactSettings } from "@/lib/settings-actions";

const FIELDS: { key: keyof ContactSettings; label: string; placeholder: string }[] = [
  { key: "line_url", label: "LINE OA (ลิงก์เพิ่มเพื่อน)", placeholder: "https://lin.ee/xxxxxxx" },
  { key: "facebook_url", label: "Facebook เพจ", placeholder: "https://facebook.com/yourpage" },
  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@yourhandle" },
  { key: "phone", label: "เบอร์โทร", placeholder: "08x-xxx-xxxx" },
];

export default function SiteSettingsForm({ initial }: { initial: ContactSettings }) {
  const [form, setForm] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function save() {
    setError("");
    setSaved(false);
    start(async () => {
      const r = await updateSiteSettings(form);
      if (r.error) setError(r.error);
      else setSaved(true);
    });
  }

  return (
    <div className="max-w-lg space-y-4">
      {FIELDS.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-sm font-medium">{f.label}</span>
          <input
            value={form[f.key]}
            onChange={(e) => {
              setForm({ ...form, [f.key]: e.target.value });
              setSaved(false);
            }}
            placeholder={f.placeholder}
            className="input input-bordered w-full"
          />
        </label>
      ))}
      {error ? <p className="text-sm text-error">{error}</p> : null}
      {saved ? <p className="text-sm text-success">บันทึกแล้ว ✓</p> : null}
      <button type="button" onClick={save} disabled={pending} className="btn btn-primary btn-sm">
        {pending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
      <p className="text-xs text-base-content/50">ช่องที่เว้นว่าง = ไม่แสดงบนเว็บ · LINE จะสร้าง QR ให้อัตโนมัติจากลิงก์</p>
    </div>
  );
}
