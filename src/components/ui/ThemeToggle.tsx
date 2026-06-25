"use client";

import { useState } from "react";

type Theme = "light" | "dark";

// Reads the theme already applied to <html> by the inline script in layout.tsx
// (so no setState-in-effect is needed). SSR falls back to "light".
function initialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.getAttribute("data-theme") as Theme) || "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  return (
    <button
      type="button"
      suppressHydrationWarning
      className="btn btn-ghost btn-sm"
      onClick={toggle}
      aria-label="สลับธีมสว่าง/มืด"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
