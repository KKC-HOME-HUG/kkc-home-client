"use client";

import { QRCodeSVG } from "qrcode.react";
import { FaLine } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";

// Inbound contact for a property: chat on LINE (tap on mobile) + a QR generated
// from the add-friend link (scan on desktop) + a tel: call. Hidden when unconfigured.
export default function LineContactCard({ lineUrl, phone }: { lineUrl: string; phone: string }) {
  if (!lineUrl && !phone) return null;

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-5">
      <h3 className="mb-3 font-semibold">ติดต่อสอบถาม</h3>

      {lineUrl ? (
        <div className="space-y-3">
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full gap-2 border-none bg-[#06C755] text-white hover:bg-[#05b34c]"
          >
            <FaLine size={20} /> แชทผ่าน LINE
          </a>
          <div className="flex flex-col items-center gap-1 rounded-xl bg-base-200/50 p-3">
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG value={lineUrl} size={128} />
            </div>
            <span className="text-xs text-base-content/50">สแกนเพื่อเพิ่มเพื่อน LINE</span>
          </div>
        </div>
      ) : null}

      {phone ? (
        <a href={`tel:${phone}`} className={`btn btn-outline w-full gap-2 ${lineUrl ? "mt-3" : ""}`}>
          <LuPhone size={18} /> โทร {phone}
        </a>
      ) : null}
    </div>
  );
}
