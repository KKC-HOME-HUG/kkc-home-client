"use client";

import { LuMoon, LuSun } from "react-icons/lu";

// No React state: both icons are always rendered (so SSR and client markup
// match — no hydration mismatch); CSS shows the right one based on data-theme.
export default function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "business" ? "corporate" : "business";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      className="btn btn-circle btn-ghost btn-sm"
      onClick={toggle}
      aria-label="สลับธีมสว่าง/มืด"
    >
      <LuMoon size={18} className="theme-icon-moon" />
      <LuSun size={18} className="theme-icon-sun" />
    </button>
  );
}
