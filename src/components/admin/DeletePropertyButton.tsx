"use client";

import { useRef, useState, useTransition } from "react";
import { LuTrash2 } from "react-icons/lu";
import { deleteProperty } from "@/lib/property-actions";

// Confirm-then-delete with progress + surfaced error. On success the action
// redirects to the list (?deleted=1) and this component unmounts.
export default function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function open() {
    setError("");
    dialogRef.current?.showModal();
  }

  function confirm() {
    setError("");
    start(async () => {
      const r = await deleteProperty(id);
      if (r?.error) setError(r.error); // success → redirect (no return)
    });
  }

  return (
    <>
      <button type="button" onClick={open} className="btn btn-outline btn-error btn-sm gap-1">
        <LuTrash2 size={14} /> ลบทรัพย์
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-semibold">ลบทรัพย์นี้?</h3>
          <p className="mt-2 text-sm text-base-content/70">
            กำลังจะลบ <span className="font-medium">“{title}”</span> — จะไม่แสดงบนเว็บอีก
          </p>
          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={pending}>ยกเลิก</button>
            </form>
            <button type="button" onClick={confirm} disabled={pending} className="btn btn-error btn-sm">
              {pending ? "กำลังลบ…" : "ลบทรัพย์"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="ปิด">close</button>
        </form>
      </dialog>
    </>
  );
}
