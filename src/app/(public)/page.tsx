import { api } from "@/lib/api";

type Health = { status: string; service: string; uptime: number };

async function getHealth(): Promise<Health | null> {
  try {
    return await api.get<Health>("/health", { cache: "no-store" });
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <section className="hero min-h-[70vh] bg-base-100">
      <div className="hero-content flex-col text-center">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold">หาบ้านในขอนแก่น 🏡</h1>
          <p className="py-4 opacity-70">
            ซื้อ ขาย เช่า บ้าน คอนโด ที่ดิน และอาคารพาณิชย์
            — แพลตฟอร์มอสังหาริมทรัพย์สำหรับชาวขอนแก่น
          </p>

          <div className="card mx-auto mt-4 w-full max-w-sm bg-base-200">
            <div className="card-body items-center">
              <span className="text-sm opacity-60">สถานะระบบ (API)</span>
              {health ? (
                <div className="flex items-center gap-2">
                  <span className="badge badge-success">ออนไลน์</span>
                  <span className="text-sm">
                    {health.service} · uptime {health.uptime}s
                  </span>
                </div>
              ) : (
                <span className="badge badge-warning">API ไม่พร้อมใช้งาน</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
