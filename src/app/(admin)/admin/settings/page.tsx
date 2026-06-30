import Link from "next/link";
import { getZones, getTypes, getFacilities, getAmphoes } from "@/lib/admin-settings";
import MasterListEditor from "@/components/admin/MasterListEditor";
import {
  createZone,
  updateZone,
  reorderZones,
  createType,
  updateType,
  reorderTypes,
  createFacility,
  updateFacility,
  reorderFacilities,
  loadTambons,
} from "@/lib/settings-actions";

export const metadata = { title: "ตั้งค่า" };

const CATEGORY = [
  { value: "RESIDENTIAL", label: "ที่อยู่อาศัย" },
  { value: "COMMERCIAL", label: "พาณิชย์" },
  { value: "LAND", label: "ที่ดิน" },
];
const GROUP = [
  { value: "IN_UNIT", label: "ในที่พัก" },
  { value: "COMMON", label: "ส่วนกลาง" },
  { value: "SECURITY", label: "ความปลอดภัย" },
  { value: "NEARBY", label: "ใกล้เคียง" },
];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "zones" } = await searchParams;

  let content: React.ReactNode;
  if (tab === "types") {
    const types = await getTypes();
    content = (
      <MasterListEditor
        key="types"
        initial={types.map((t) => ({ key: t.code, nameTh: t.nameTh, nameEn: t.nameEn, meta: t.category, isActive: t.isActive }))}
        metaLabel="หมวด"
        metaOptions={CATEGORY}
        identMode="code"
        identLabel="code"
        onCreate={createType}
        onUpdate={updateType}
        onReorder={reorderTypes}
      />
    );
  } else if (tab === "facilities") {
    const facilities = await getFacilities();
    content = (
      <MasterListEditor
        key="facilities"
        initial={facilities.map((f) => ({ key: f.code, nameTh: f.nameTh, nameEn: f.nameEn, meta: f.group, isActive: f.isActive }))}
        metaLabel="กลุ่ม"
        metaOptions={GROUP}
        identMode="code"
        identLabel="code"
        onCreate={createFacility}
        onUpdate={updateFacility}
        onReorder={reorderFacilities}
      />
    );
  } else {
    const [zones, amphoes] = await Promise.all([getZones(), getAmphoes()]);
    content = (
      <MasterListEditor
        key="zones"
        initial={zones.map((z) => ({
          key: z.id,
          nameTh: z.nameTh,
          nameEn: z.nameEn,
          meta: String(z.amphoeCode),
          meta2: z.tambonCode ? String(z.tambonCode) : undefined,
          meta2Text: z.tambon,
          isActive: z.isActive,
        }))}
        metaLabel="อำเภอ"
        metaOptions={amphoes.map((a) => ({ value: String(a.code), label: a.nameTh }))}
        identMode="slug-auto"
        identLabel="slug"
        meta2Label="ตำบล"
        meta2Optional
        loadMeta2={loadTambons}
        onCreate={createZone}
        onUpdate={updateZone}
        onReorder={reorderZones}
      />
    );
  }

  const tabEl = (k: string, label: string) => (
    <Link href={`/admin/settings?tab=${k}`} className={`tab ${(tab || "zones") === k ? "tab-active" : ""}`}>
      {label}
    </Link>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ตั้งค่า · ข้อมูลหลัก</h1>
        <p className="mt-1 text-sm text-base-content/60">จัดการตัวเลือกที่ใช้ตอนลงทรัพย์และค้นหา (ปิดแล้วยังแสดงในทรัพย์เดิม)</p>
      </div>
      <div role="tablist" className="tabs tabs-bordered w-fit">
        {tabEl("zones", "ย่าน")}
        {tabEl("types", "ประเภททรัพย์")}
        {tabEl("facilities", "สิ่งอำนวยฯ")}
      </div>
      {content}
    </div>
  );
}
