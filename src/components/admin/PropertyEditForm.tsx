"use client";

import { useActionState } from "react";
import {
  updateProperty,
  saveOffers,
  publishProperty,
  unpublishProperty,
  deleteProperty,
  type PropFormState,
} from "@/lib/property-actions";
import LocationSelect from "./LocationSelect";
import AttributesEditor from "./AttributesEditor";
import type { AdminDetail, AdminMeta, Tambon } from "@/lib/admin-properties";

const FG: Record<string, string> = {
  IN_UNIT: "ในที่พัก",
  COMMON: "ส่วนกลาง",
  SECURITY: "ความปลอดภัย",
  NEARBY: "ใกล้เคียง",
};
const STATUS = ["AVAILABLE", "RESERVED", "CLOSED"];

export default function PropertyEditForm({
  detail,
  meta,
  tambons,
}: {
  detail: AdminDetail;
  meta: AdminMeta;
  tambons: Tambon[];
}) {
  const [main, mainAction, savingMain] = useActionState<PropFormState, FormData>(updateProperty, {});
  const [offers, offersAction, savingOffers] = useActionState<PropFormState, FormData>(saveOffers, {});
  const [pub, pubAction] = useActionState<PropFormState, FormData>(publishProperty, {});

  const sale = detail.offers.find((o) => o.kind === "SALE");
  const rent = detail.offers.find((o) => o.kind === "RENT");
  const num = (v: number | null) => (v == null ? "" : String(v));

  return (
    <div className="space-y-6">
      {/* main: core / location / specs / facilities / attributes */}
      <form action={mainAction} className="card border border-base-200 bg-base-100">
        <div className="card-body space-y-5">
          <input type="hidden" name="id" value={detail.id} />

          <section className="space-y-3">
            <h2 className="font-semibold">ข้อมูลหลัก</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ประเภททรัพย์</span>
                <select name="typeCode" defaultValue={detail.type_code} className="select select-bordered w-full">
                  {meta.types.map((t) => (
                    <option key={t.code} value={t.code}>{t.nameTh}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">สภาพ</span>
                <select name="condition" defaultValue={detail.condition ?? ""} className="select select-bordered w-full">
                  <option value="">— ไม่ระบุ —</option>
                  <option value="NEW_PROJECT">โครงการใหม่</option>
                  <option value="SECOND_HAND">มือสอง</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">ชื่อประกาศ</span>
              <input name="title" defaultValue={detail.title} required className="input input-bordered w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">รายละเอียด</span>
              <textarea name="description" defaultValue={detail.description ?? ""} className="textarea textarea-bordered w-full" rows={3} />
            </label>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">ทำเล</h2>
            <LocationSelect meta={meta} amphoe={detail.amphoe_code} tambon={detail.tambon_code} zone={detail.zone_id} tambons={tambons} />
            <label className="block">
              <span className="mb-1 block text-xs text-base-content/60">ที่อยู่</span>
              <input name="addressText" defaultValue={detail.address_text ?? ""} className="input input-bordered w-full" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">Latitude (พิกัด)</span>
                <input name="latitude" type="number" step="any" defaultValue={num(detail.latitude)} className="input input-bordered w-full" placeholder="16.43" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">Longitude (พิกัด)</span>
                <input name="longitude" type="number" step="any" defaultValue={num(detail.longitude)} className="input input-bordered w-full" placeholder="102.83" />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">สเปก</h2>
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ห้องนอน</span>
                <input name="bedrooms" type="number" defaultValue={num(detail.bedrooms)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ห้องน้ำ</span>
                <input name="bathrooms" type="number" defaultValue={num(detail.bathrooms)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">พื้นที่ใช้สอย (ตร.ม.)</span>
                <input name="usableAreaSqm" type="number" step="any" defaultValue={num(detail.usable_area_sqm)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">เนื้อที่ดิน (ตร.ว.)</span>
                <input name="landAreaSqw" type="number" step="any" defaultValue={num(detail.land_area_sqw)} className="input input-bordered w-full" />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">สิ่งอำนวยความสะดวก</h2>
            {Object.keys(FG).map((g) => {
              const items = meta.facilities.filter((f) => f.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <div className="mb-1 text-sm text-base-content/60">{FG[g]}</div>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {items.map((f) => (
                      <label key={f.code} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="facilities" value={f.code} defaultChecked={detail.facilities.includes(f.code)} className="checkbox checkbox-sm" />
                        {f.nameTh}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">ข้อมูลเพิ่มเติม</h2>
            <AttributesEditor initial={detail.attributes} />
          </section>

          {main.error ? <p className="text-sm text-error">{main.error}</p> : null}
          {main.ok ? <p className="text-sm text-success">บันทึกแล้ว</p> : null}
          <button type="submit" className="btn btn-primary" disabled={savingMain}>
            {savingMain ? "กำลังบันทึก…" : "บันทึกรายละเอียด"}
          </button>
        </div>
      </form>

      {/* offers */}
      <form action={offersAction} className="card border border-base-200 bg-base-100">
        <div className="card-body space-y-4">
          <input type="hidden" name="id" value={detail.id} />
          <h2 className="font-semibold">ข้อเสนอ</h2>

          <div className="rounded-lg border border-base-200 p-3">
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" name="sale_on" defaultChecked={!!sale} className="toggle toggle-success toggle-sm" /> ขาย
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ราคาขาย (บาท)</span>
                <input name="sale_price" type="number" defaultValue={num(sale?.price ?? null)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">สถานะ</span>
                <select name="sale_status" defaultValue={sale?.status ?? "AVAILABLE"} className="select select-bordered w-full">
                  {STATUS.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-base-200 p-3">
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" name="rent_on" defaultChecked={!!rent} className="toggle toggle-success toggle-sm" /> เช่า
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ค่าเช่า/เดือน (บาท)</span>
                <input name="rent_price" type="number" defaultValue={num(rent?.price ?? null)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">เงินมัดจำ (บาท)</span>
                <input name="rent_deposit" type="number" defaultValue={num(rent?.deposit ?? null)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">เช่าขั้นต่ำ (เดือน)</span>
                <input name="rent_min_lease" type="number" defaultValue={num(rent?.min_lease_months ?? null)} className="input input-bordered w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">สถานะ</span>
                <select name="rent_status" defaultValue={rent?.status ?? "AVAILABLE"} className="select select-bordered w-full">
                  {STATUS.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </label>
            </div>
          </div>

          {offers.error ? <p className="text-sm text-error">{offers.error}</p> : null}
          {offers.ok ? <p className="text-sm text-success">บันทึกข้อเสนอแล้ว</p> : null}
          <button type="submit" className="btn btn-primary" disabled={savingOffers}>
            {savingOffers ? "กำลังบันทึก…" : "บันทึกข้อเสนอ"}
          </button>
        </div>
      </form>

      {/* publish / delete */}
      <div className="card border border-base-200 bg-base-100">
        <div className="card-body space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">สถานะ:</span>
            <span className={`badge ${detail.is_published ? "badge-success" : "badge-ghost"}`}>
              {detail.is_published ? "เผยแพร่" : "แบบร่าง"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {detail.is_published ? (
              <form action={unpublishProperty}>
                <input type="hidden" name="id" value={detail.id} />
                <button type="submit" className="btn btn-outline btn-sm">ยกเลิกเผยแพร่</button>
              </form>
            ) : (
              <form action={pubAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={detail.id} />
                <button type="submit" className="btn btn-primary btn-sm">เผยแพร่</button>
                {pub.error ? <span className="text-sm text-error">{pub.error}</span> : null}
              </form>
            )}
            <form action={deleteProperty} className="ml-auto">
              <input type="hidden" name="id" value={detail.id} />
              <button type="submit" className="btn btn-outline btn-error btn-sm">ลบทรัพย์</button>
            </form>
          </div>
          <p className="text-xs text-base-content/50">เผยแพร่ได้ต้องมีข้อเสนอ (AVAILABLE) อย่างน้อย 1 รายการ — บันทึกข้อเสนอก่อน</p>
        </div>
      </div>
    </div>
  );
}
