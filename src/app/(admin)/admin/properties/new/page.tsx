import Link from "next/link";
import { getAdminMeta } from "@/lib/admin-properties";
import PropertyCreateForm from "@/components/admin/PropertyCreateForm";

export const metadata = { title: "เพิ่มทรัพย์" };

export default async function NewPropertyPage() {
  const meta = await getAdminMeta();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/properties" className="text-sm text-base-content/50 hover:text-primary">← ทรัพย์</Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">เพิ่มทรัพย์</h1>
        <p className="mt-1 text-sm text-base-content/60">สร้างแบบร่างก่อน แล้วค่อยกรอกข้อเสนอ/รูป/รายละเอียด</p>
      </div>
      <div className="card border border-base-200 bg-base-100">
        <div className="card-body">
          {meta ? (
            <PropertyCreateForm meta={meta} />
          ) : (
            <p className="text-error">โหลดข้อมูลตัวเลือกไม่สำเร็จ (API ไม่พร้อม)</p>
          )}
        </div>
      </div>
    </div>
  );
}
