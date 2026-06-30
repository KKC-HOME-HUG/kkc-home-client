"use client";

import { useState } from "react";
import { createLead } from "@/lib/properties";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm({ slug }: { slug: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    setStatus("sending");
    try {
      await createLead({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? "") || undefined,
        message: String(fd.get("message") ?? "") || undefined,
        property_slug: slug,
      });
      setStatus("ok");
      formEl.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold">สนใจทรัพย์นี้</h3>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">ชื่อ</span>
        <input name="name" required placeholder="ชื่อ-นามสกุล" className="input input-bordered w-full" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">เบอร์โทร</span>
        <input name="phone" required placeholder="08x-xxx-xxxx" className="input input-bordered w-full" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          อีเมล <span className="font-normal text-base-content/50">(ไม่บังคับ)</span>
        </span>
        <input name="email" type="email" className="input input-bordered w-full" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">ข้อความ</span>
        <textarea name="message" placeholder="สนใจนัดชม / สอบถามเพิ่มเติม" className="textarea textarea-bordered w-full" rows={3} />
      </label>
      <button type="submit" className="btn btn-primary w-full" disabled={status === "sending"}>
        {status === "sending" ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
      {status === "ok" ? (
        <div className="alert alert-success py-2 text-sm">ส่งเรียบร้อย ทีมงานจะติดต่อกลับ</div>
      ) : null}
      {status === "error" ? (
        <div className="alert alert-error py-2 text-sm">ส่งไม่สำเร็จ ลองใหม่อีกครั้ง</div>
      ) : null}
    </form>
  );
}
