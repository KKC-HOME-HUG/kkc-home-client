import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { countNewLeads } from "@/lib/admin-leads";

export default async function AdminDashboard() {
  const [user, newLeads] = await Promise.all([getCurrentUser(), countNewLeads()]);
  const STATS = [
    { label: "ทรัพย์ทั้งหมด", value: "—" },
    { label: "เผยแพร่อยู่", value: "—" },
    { label: "Leads ใหม่", value: newLeads == null ? "—" : newLeads.toLocaleString("th-TH") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-base-content/60">
          สวัสดี {user?.displayName ?? "ผู้ดูแล"}
          {user ? (
            <span className={`badge badge-sm ml-2 ${user.role === "ADMIN" ? "badge-primary" : "badge-ghost"}`}>
              {user.role}
            </span>
          ) : null}
        </p>
      </div>

      <div className="stats stats-vertical w-full border border-base-200 bg-base-100 sm:stats-horizontal">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-title">{s.label}</div>
            <div className="stat-value text-3xl">{s.value}</div>
          </div>
        ))}
      </div>

      {user?.role === "ADMIN" ? (
        <Link
          href="/admin/users"
          className="inline-flex rounded-xl border border-base-200 bg-base-100 px-5 py-3 text-sm font-medium hover:border-primary hover:text-primary"
        >
          จัดการผู้ใช้งาน →
        </Link>
      ) : null}

      <div className="rounded-xl border border-base-200 bg-base-100 p-6 text-sm text-base-content/60">
        การจัดการทรัพย์ / Leads (CRUD, อัปโหลดรูป, inbox) จะถูกเพิ่มในขั้นตอน{" "}
        <code>admin-catalog</code> และ <code>lead-inbox</code>
      </div>
    </div>
  );
}
