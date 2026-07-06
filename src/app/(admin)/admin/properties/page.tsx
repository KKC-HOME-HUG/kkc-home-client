import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { listAdminProperties } from "@/lib/admin-properties";

export const metadata = { title: "ทรัพย์" };

const baht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const page = sp.page ?? "1";
  const qs = new URLSearchParams({ page, per_page: "20" });
  if (sp.status) qs.set("status", sp.status);
  if (sp.q) qs.set("q", sp.q);

  const data = await listAdminProperties(qs.toString());
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const current = data?.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / (data?.per_page ?? 20)));

  const tab = (key: string, label: string) => (
    <Link
      href={key ? `/admin/properties?status=${key}` : "/admin/properties"}
      className={`tab ${(sp.status ?? "") === key ? "tab-active" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-6">
      {sp.deleted === "1" ? (
        <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm">
          <span className="font-medium text-success">ลบทรัพย์แล้ว ✓</span>
          <Link href="/admin/properties" className="btn btn-ghost btn-xs btn-square" aria-label="ปิด">
            ✕
          </Link>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ทรัพย์</h1>
          <p className="mt-1 text-sm text-base-content/60">จัดการประกาศ ({total.toLocaleString("th-TH")} รายการ)</p>
        </div>
        <Link href="/admin/properties/new" className="btn btn-primary btn-sm gap-1">
          <LuPlus size={16} /> เพิ่มทรัพย์
        </Link>
      </div>

      <div role="tablist" className="tabs tabs-bordered w-fit">
        {tab("", "ทั้งหมด")}
        {tab("published", "เผยแพร่")}
        {tab("draft", "แบบร่าง")}
      </div>

      {/* Cards — phone (< md) */}
      <div className="space-y-3 md:hidden">
        {items.length ? (
          items.map((p) => (
            <div key={p.id} className="rounded-xl border border-base-200 bg-base-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="font-mono text-xs text-base-content/50">{p.slug}</div>
                </div>
                <span className={`badge badge-sm shrink-0 whitespace-nowrap ${p.is_published ? "badge-success" : "badge-ghost"}`}>
                  {p.is_published ? "เผยแพร่" : "แบบร่าง"}
                </span>
              </div>
              <div className="mt-2 text-sm text-base-content/70">
                {p.type} · {p.zone ?? p.amphoe}
              </div>
              <div className="mt-1 text-sm">
                {p.offers.length ? (
                  p.offers.map((o) => (
                    <span key={o.kind} className="mr-3">
                      {o.kind === "SALE" ? "ขาย " : "เช่า "}
                      {baht(o.price)}
                    </span>
                  ))
                ) : (
                  <span className="text-base-content/40">—</span>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <Link href={`/admin/properties/${p.id}/edit`} className="btn btn-ghost btn-xs">
                  แก้ไข
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-base-200 bg-base-100 py-10 text-center text-sm text-base-content/50">
            ยังไม่มีทรัพย์
          </p>
        )}
      </div>

      {/* Table — md and up */}
      <div className="hidden overflow-x-auto rounded-xl border border-base-200 bg-base-100 md:block">
        <table className="table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>ชื่อ</th>
              <th>ประเภท</th>
              <th>ทำเล</th>
              <th>ราคา</th>
              <th>สถานะ</th>
              <th className="text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-base-content/60">{p.slug}</td>
                  <td className="font-medium">{p.title}</td>
                  <td className="text-sm text-base-content/70">{p.type}</td>
                  <td className="text-sm text-base-content/70">{p.zone ?? p.amphoe}</td>
                  <td className="text-sm">
                    {p.offers.length
                      ? p.offers.map((o) => (
                          <div key={o.kind}>
                            {o.kind === "SALE" ? "ขาย " : "เช่า "}
                            {baht(o.price)}
                          </div>
                        ))
                      : <span className="text-base-content/40">—</span>}
                  </td>
                  <td>
                    <span className={`badge badge-sm whitespace-nowrap ${p.is_published ? "badge-success" : "badge-ghost"}`}>
                      {p.is_published ? "เผยแพร่" : "แบบร่าง"}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link href={`/admin/properties/${p.id}/edit`} className="btn btn-ghost btn-xs">แก้ไข</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/50">ยังไม่มีทรัพย์</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="flex justify-center">
          <div className="join">
            {current > 1 ? (
              <Link href={`/admin/properties?page=${current - 1}`} className="btn btn-sm join-item">ก่อนหน้า</Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ก่อนหน้า</button>
            )}
            <button className="btn btn-sm join-item pointer-events-none">{current} / {pages}</button>
            {current < pages ? (
              <Link href={`/admin/properties?page=${current + 1}`} className="btn btn-sm join-item">ถัดไป</Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ถัดไป</button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
