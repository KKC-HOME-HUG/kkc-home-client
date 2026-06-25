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
      <input name="name" required placeholder="ชื่อ" className="input input-bordered w-full" />
      <input name="phone" required placeholder="เบอร์โทร" className="input input-bordered w-full" />
      <input name="email" type="email" placeholder="อีเมล (ไม่บังคับ)" className="input input-bordered w-full" />
      <textarea name="message" placeholder="ข้อความ" className="textarea textarea-bordered w-full" rows={3} />
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
