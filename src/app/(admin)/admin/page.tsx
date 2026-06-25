const STATS = [
  { label: "ทรัพย์ทั้งหมด", value: "—" },
  { label: "เผยแพร่อยู่", value: "—" },
  { label: "Leads ใหม่", value: "—" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-base-content/60">ภาพรวมระบบจัดการทรัพย์</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-base-200 bg-base-100 p-5">
            <div className="text-sm text-base-content/60">{s.label}</div>
            <div className="mt-1 text-3xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-base-200 bg-base-100 p-6 text-sm text-base-content/60">
        โครงผู้ดูแล — การจัดการทรัพย์ / Leads (login, CRUD, อัปรูป, inbox)
        จะถูกเพิ่มในขั้นตอน <code>admin-portal</code> และ <code>lead-inbox</code>
      </div>
    </div>
  );
}
