"use client";

import { useOptimistic, useTransition } from "react";
import { setUserActive } from "@/lib/user-actions";

// daisyUI switch for a user's active state. Uses useOptimistic so the switch
// flips instantly, then re-syncs to the real server value after revalidation —
// even when the change is blocked (self / last-admin) and isActive is unchanged,
// optimistic state reverts to the truth (a plain controlled checkbox would not).
export default function UserActiveToggle({
  id,
  isActive,
  self = false,
}: {
  id: string;
  isActive: boolean;
  self?: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(isActive);
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      className="toggle toggle-success"
      checked={optimistic}
      disabled={pending || self}
      title={self ? "ปิดบัญชีตัวเองไม่ได้" : undefined}
      aria-label={optimistic ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
      onChange={() => {
        const next = !isActive;
        startTransition(async () => {
          setOptimistic(next);
          const fd = new FormData();
          fd.set("id", id);
          fd.set("isActive", String(next));
          await setUserActive(fd);
        });
      }}
    />
  );
}
