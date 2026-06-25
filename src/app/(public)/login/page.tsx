import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

// Stub — the real login flow is delivered by the admin-portal change.
export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-sm flex-col justify-center px-4">
      <div className="rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm">
        <Logo size={36} />
        <h1 className="mt-6 text-xl font-semibold tracking-tight">เข้าสู่ระบบผู้ดูแล</h1>
        <p className="mt-1 text-sm text-base-content/50">
          ระบบเข้าสู่ระบบจะพร้อมใช้งานในขั้นตอน admin-portal
        </p>
        <div className="mt-6 space-y-3">
          <input className="input input-bordered w-full" placeholder="อีเมล" disabled />
          <input className="input input-bordered w-full" type="password" placeholder="รหัสผ่าน" disabled />
          <button type="button" className="btn btn-primary w-full" disabled>
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
      <Link href="/" className="mt-5 text-center text-sm text-base-content/50 hover:text-primary">
        ← กลับหน้าแรก
      </Link>
    </div>
  );
}
