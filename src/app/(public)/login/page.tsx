import type { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

// Stub — the real login flow is delivered by the admin-portal change.
export default function LoginPage() {
  return (
    <div className="hero min-h-[70vh]">
      <div className="hero-content">
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title">เข้าสู่ระบบผู้ดูแล</h1>
            <p className="text-sm opacity-60">
              ระบบเข้าสู่ระบบจะพร้อมใช้งานในขั้นตอน admin-portal
            </p>
            <input
              className="input input-bordered"
              placeholder="อีเมล"
              disabled
            />
            <input
              className="input input-bordered"
              type="password"
              placeholder="รหัสผ่าน"
              disabled
            />
            <button type="button" className="btn btn-primary" disabled>
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
