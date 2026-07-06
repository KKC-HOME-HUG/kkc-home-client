"use client";

import { useFormStatus } from "react-dom";

// A submit button that shows a pending state during its enclosing <form> action.
export default function SubmitButton({
  children,
  pendingLabel = "กำลัง…",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}
