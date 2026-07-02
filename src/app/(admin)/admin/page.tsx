import Link from "next/link";
import { LuPlus, LuInbox, LuBuilding2, LuUsers, LuPhone } from "react-icons/lu";
import { getCurrentUser } from "@/lib/session";
import { getDashboard } from "@/lib/admin-dashboard";

export const metadata = { title: "แดชบอร์ด" };

const fmtDate = (s: string) => new Date(s).toLocaleDateString("th-TH", { day: "2-digit", month: "short" });

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-base-200 bg-base-100 px-4 py-3 text-sm font-medium transition hover:border-primary hover:text-primary"
    >
      {icon} {label}
    </Link>
  );
}

export default async function AdminDashboard() {
  const [user, data] = await Promise.all([getCurrentUser(), getDashboard()]);
  const p = data?.properties ?? { total: 0, published: 0, draft: 0 };
  const l = data?.leads ?? { new: 0, contacted: 0, closed: 0, total: 0 };
  const newLeads = data?.recent_new_leads ?? [];
  const recentProps = data?.recent_properties ?? [];

  const STATS = [
    { label: "ทรัพย์ทั้งหมด", value: p.total, href: "/admin/properties" },
    { label: "เผยแพร่", value: p.published, href: "/admin/properties?status=published" },
    { label: "แบบร่าง", value: p.draft, href: "/admin/properties?status=draft" },
    { label: "Leads ใหม่", value: l.new, href: "/admin/leads?status=NEW", accent: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-base-content/60">
          สวัสดี {user?.displayName ?? "ผู้ดูแล"}
          {user ? (
            <span className={`badge badge-sm ml-2 whitespace-nowrap ${user.role === "ADMIN" ? "badge-primary" : "badge-ghost"}`}>{user.role}</span>
          ) : null}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl border bg-base-100 p-4 transition hover:border-primary ${
              s.accent && s.value > 0 ? "border-primary/40" : "border-base-200"
            }`}
          >
            <div className="text-sm text-base-content/60">{s.label}</div>
            <div className={`mt-1 text-3xl font-bold ${s.accent && s.value > 0 ? "text-primary" : ""}`}>
              {s.value.toLocaleString("th-TH")}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* New leads to contact */}
        <div className="rounded-xl border border-base-200 bg-base-100 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-base-200 p-4">
            <h2 className="font-semibold">🔔 Leads ใหม่ที่ต้องติดต่อ</h2>
            <Link href="/admin/leads?status=NEW" className="text-sm text-primary hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          {newLeads.length ? (
            <ul className="divide-y divide-base-200">
              {newLeads.map((ld) => (
                <li key={ld.id}>
                  <Link href={`/admin/leads/${ld.id}`} className="flex items-center gap-3 p-4 transition hover:bg-base-200/50">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{ld.name}</div>
                      <div className="flex items-center gap-1 truncate text-xs text-base-content/60">
                        <LuPhone size={12} className="shrink-0" /> {ld.phone}
                        {ld.property ? ` · ${ld.property}` : ""}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-base-content/50">{fmtDate(ld.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-sm text-base-content/50">ไม่มี lead ใหม่ที่ค้างอยู่ 🎉</div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-2">
          <h2 className="px-1 font-semibold">⚡ ทางลัด</h2>
          <QuickAction href="/admin/properties/new" icon={<LuPlus size={18} />} label="เพิ่มทรัพย์" />
          <QuickAction href="/admin/leads" icon={<LuInbox size={18} />} label="ดู Leads" />
          <QuickAction href="/admin/properties" icon={<LuBuilding2 size={18} />} label="จัดการทรัพย์" />
          {user?.role === "ADMIN" ? (
            <QuickAction href="/admin/users" icon={<LuUsers size={18} />} label="จัดการผู้ใช้งาน" />
          ) : null}
        </div>
      </div>

      {/* Recent properties */}
      <div className="rounded-xl border border-base-200 bg-base-100">
        <div className="flex items-center justify-between border-b border-base-200 p-4">
          <h2 className="font-semibold">ทรัพย์ล่าสุด</h2>
          <Link href="/admin/properties" className="text-sm text-primary hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        {recentProps.length ? (
          <ul className="divide-y divide-base-200">
            {recentProps.map((pr) => (
              <li key={pr.id}>
                <Link href={`/admin/properties/${pr.id}/edit`} className="flex items-center gap-3 p-4 transition hover:bg-base-200/50">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{pr.title}</div>
                    <div className="font-mono text-xs text-base-content/50">{pr.slug}</div>
                  </div>
                  <span className={`badge badge-sm whitespace-nowrap ${pr.is_published ? "badge-success" : "badge-ghost"}`}>
                    {pr.is_published ? "เผยแพร่" : "แบบร่าง"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-sm text-base-content/50">ยังไม่มีทรัพย์</div>
        )}
      </div>
    </div>
  );
}
