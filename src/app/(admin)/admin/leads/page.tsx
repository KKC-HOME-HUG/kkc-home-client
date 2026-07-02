import Link from "next/link";
import { listLeads } from "@/lib/admin-leads";

export const metadata = { title: "Leads" };

const BADGE: Record<string, string> = { NEW: "badge-info", CONTACTED: "badge-warning", CLOSED: "badge-ghost" };
const LABEL: Record<string, string> = { NEW: "ใหม่", CONTACTED: "ติดต่อแล้ว", CLOSED: "ปิด" };

const fmt = (s: string) => new Date(s).toLocaleDateString("th-TH", { day: "2-digit", month: "short" });

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; mine?: string }>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ page: sp.page ?? "1", per_page: "20" });
  if (sp.status) qs.set("status", sp.status);
  if (sp.mine) qs.set("mine", "true");

  const data = await listLeads(qs.toString());
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const current = data?.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / (data?.per_page ?? 20)));

  const mineParam = sp.mine ? "&mine=true" : "";
  const tab = (key: string, label: string) => (
    <Link
      href={`/admin/leads?${key ? `status=${key}` : ""}${mineParam}`}
      className={`tab ${(sp.status ?? "") === key ? "tab-active" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-base-content/60">ผู้สนใจที่ติดต่อเข้ามา ({total.toLocaleString("th-TH")} รายการ)</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="tabs tabs-bordered">
          {tab("", "ทั้งหมด")}
          {tab("NEW", "ใหม่")}
          {tab("CONTACTED", "ติดต่อแล้ว")}
          {tab("CLOSED", "ปิด")}
        </div>
        <Link
          href={`/admin/leads?${sp.status ? `status=${sp.status}` : ""}${sp.mine ? "" : "&mine=true"}`}
          className={`btn btn-sm ${sp.mine ? "btn-primary" : "btn-outline"}`}
        >
          เคสของฉัน
        </Link>
      </div>

      {/* Cards — phone (< md) */}
      <div className="space-y-3 md:hidden">
        {items.length ? (
          items.map((l) => (
            <Link
              key={l.id}
              href={`/admin/leads/${l.id}`}
              className="block rounded-xl border border-base-200 bg-base-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{l.name}</div>
                  <div className="text-xs text-base-content/60">{l.phone}</div>
                </div>
                <span className={`badge badge-sm shrink-0 whitespace-nowrap ${BADGE[l.status]}`}>{LABEL[l.status]}</span>
              </div>
              {l.property ? (
                <div className="mt-2 truncate text-sm text-base-content/70">{l.property.title}</div>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-base-content/50">
                <span>{l.source}</span>
                <span>·</span>
                <span>{l.handled_by ? l.handled_by.name : "ยังไม่รับ"}</span>
                <span>·</span>
                <span>{fmt(l.created_at)}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="rounded-xl border border-base-200 bg-base-100 py-10 text-center text-sm text-base-content/50">
            ไม่มี lead
          </p>
        )}
      </div>

      {/* Table — md and up */}
      <div className="hidden overflow-x-auto rounded-xl border border-base-200 bg-base-100 md:block">
        <table className="table">
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>ทรัพย์</th>
              <th>ช่องทาง</th>
              <th>สถานะ</th>
              <th>ผู้รับ</th>
              <th>วันที่</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-base-content/60">{l.phone}</div>
                  </td>
                  <td className="text-sm text-base-content/70">{l.property ? l.property.title : <span className="text-base-content/40">—</span>}</td>
                  <td className="text-sm text-base-content/60">{l.source}</td>
                  <td>
                    <span className={`badge badge-sm whitespace-nowrap ${BADGE[l.status]}`}>{LABEL[l.status]}</span>
                  </td>
                  <td className="text-sm text-base-content/70">{l.handled_by ? l.handled_by.name : <span className="text-base-content/40">—</span>}</td>
                  <td className="text-sm text-base-content/60">{fmt(l.created_at)}</td>
                  <td className="text-right">
                    <Link href={`/admin/leads/${l.id}`} className="btn btn-ghost btn-xs">ดู</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-base-content/50">ไม่มี lead</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="flex justify-center">
          <div className="join">
            {current > 1 ? (
              <Link href={`/admin/leads?page=${current - 1}`} className="btn btn-sm join-item">ก่อนหน้า</Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ก่อนหน้า</button>
            )}
            <button className="btn btn-sm join-item pointer-events-none">{current} / {pages}</button>
            {current < pages ? (
              <Link href={`/admin/leads?page=${current + 1}`} className="btn btn-sm join-item">ถัดไป</Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ถัดไป</button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
