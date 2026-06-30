"use client";

import { useState, useTransition } from "react";
import { LuTrash2 } from "react-icons/lu";
import { updateLead, addLeadNote, deleteLead } from "@/lib/lead-actions";
import type { LeadDetail } from "@/lib/admin-leads";

const STATUSES: { v: "NEW" | "CONTACTED" | "CLOSED"; label: string }[] = [
  { v: "NEW", label: "ใหม่" },
  { v: "CONTACTED", label: "ติดต่อแล้ว" },
  { v: "CLOSED", label: "ปิด" },
];

export default function LeadControls({ lead, meId }: { lead: LeadDetail; meId: string }) {
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const mine = lead.handled_by?.id === meId;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 text-sm font-medium">สถานะ</div>
        <div className="join">
          {STATUSES.map((s) => (
            <button
              key={s.v}
              type="button"
              disabled={pending}
              onClick={() => start(() => updateLead(lead.id, { status: s.v }))}
              className={`btn btn-sm join-item ${lead.status === s.v ? "btn-primary" : "btn-outline"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-sm font-medium">ผู้รับเคส</div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{lead.handled_by ? lead.handled_by.name : "ยังไม่มีคนรับ"}</span>
          {mine ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => updateLead(lead.id, { handledByUserId: null }))}
              className="btn btn-ghost btn-xs"
            >
              ปล่อยเคส
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => updateLead(lead.id, { handledByUserId: meId }))}
              className="btn btn-outline btn-xs"
            >
              รับเคสเอง
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">เพิ่มโน้ต</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="textarea textarea-bordered w-full"
          placeholder="บันทึกการติดต่อ…"
        />
        <button
          type="button"
          disabled={pending || !note.trim()}
          onClick={() => {
            const body = note;
            setNote("");
            start(() => addLeadNote(lead.id, body));
          }}
          className="btn btn-primary btn-sm"
        >
          บันทึกโน้ต
        </button>
      </div>

      <div className="border-t border-base-200 pt-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => deleteLead(lead.id))}
          className="btn btn-outline btn-error btn-sm gap-1"
        >
          <LuTrash2 size={14} /> ลบ (สแปม)
        </button>
      </div>
    </div>
  );
}
