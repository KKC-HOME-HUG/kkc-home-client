import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/admin-leads";
import { getCurrentUser } from "@/lib/session";
import LeadControls from "@/components/admin/LeadControls";

export const metadata = { title: "Lead" };

const BADGE: Record<string, string> = { NEW: "badge-info", CONTACTED: "badge-warning", CLOSED: "badge-ghost" };
const LABEL: Record<string, string> = { NEW: "ใหม่", CONTACTED: "ติดต่อแล้ว", CLOSED: "ปิด" };
const fmt = (s: string) => new Date(s).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 shrink-0 text-base-content/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, me] = await Promise.all([getLead(id), getCurrentUser()]);
  if (!lead) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/leads" className="text-sm text-base-content/50 hover:text-primary">← Leads</Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <span className={`badge ${BADGE[lead.status]}`}>{LABEL[lead.status]}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card border border-base-200 bg-base-100">
            <div className="card-body space-y-2">
              <h2 className="font-semibold">ข้อมูลลูกค้า</h2>
              <Info label="เบอร์โทร"><a href={`tel:${lead.phone}`} className="link link-primary">{lead.phone}</a></Info>
              {lead.email ? <Info label="อีเมล">{lead.email}</Info> : null}
              <Info label="ช่องทาง">{lead.source}</Info>
              <Info label="ทรัพย์">
                {lead.property ? (
                  <Link href={`/properties/${lead.property.slug}`} className="link link-primary">{lead.property.title}</Link>
                ) : (
                  <span className="text-base-content/40">— ไม่ระบุ —</span>
                )}
              </Info>
              {lead.message ? <Info label="ข้อความ"><span className="whitespace-pre-wrap">{lead.message}</span></Info> : null}
              <Info label="เข้ามาเมื่อ">{fmt(lead.created_at)}</Info>
            </div>
          </div>

          <div className="card border border-base-200 bg-base-100">
            <div className="card-body">
              <h2 className="font-semibold">ไทม์ไลน์</h2>
              <div className="mt-2 space-y-3">
                {lead.notes.length ? (
                  lead.notes.map((n) =>
                    n.is_system ? (
                      <div key={n.id} className="text-sm text-base-content/50">
                        · {n.body} <span className="text-xs">({fmt(n.created_at)})</span>
                      </div>
                    ) : (
                      <div key={n.id} className="rounded-lg border border-base-200 p-3">
                        <div className="whitespace-pre-wrap text-sm">{n.body}</div>
                        <div className="mt-1 text-xs text-base-content/50">
                          {n.author ?? "—"} · {fmt(n.created_at)}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-base-content/50">ยังไม่มีบันทึก</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card h-fit border border-base-200 bg-base-100">
          <div className="card-body">
            <LeadControls lead={lead} meId={me?.id ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
