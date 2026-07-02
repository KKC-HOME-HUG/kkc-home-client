"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard, LuBuilding2, LuInbox, LuUsers, LuSettings, LuLogOut, LuMenu } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { logoutAction } from "@/lib/auth-actions";

type NavItem = { href: string; label: string; icon: React.ReactNode; adminOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/admin", label: "แดชบอร์ด", icon: <LuLayoutDashboard size={18} /> },
  { href: "/admin/properties", label: "ทรัพย์", icon: <LuBuilding2 size={18} /> },
  { href: "/admin/leads", label: "Leads", icon: <LuInbox size={18} /> },
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: <LuUsers size={18} />, adminOnly: true },
  { href: "/admin/settings", label: "ตั้งค่า", icon: <LuSettings size={18} /> },
];

type ShellUser = { displayName: string; email: string; role: string } | null;

export default function AdminShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = NAV.filter((n) => !n.adminOnly || user?.role === "ADMIN");
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="drawer min-h-screen lg:drawer-open">
      <input
        id="admin-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={(e) => setOpen(e.target.checked)}
      />

      <div className="drawer-content flex min-h-screen flex-col bg-base-200/40">
        {/* mobile / tablet top bar — hidden on desktop where the sidebar is fixed */}
        <header className="flex items-center gap-2 border-b border-base-200 bg-base-100 px-3 py-2 lg:hidden">
          <label htmlFor="admin-drawer" className="btn btn-ghost btn-sm btn-square" aria-label="เปิดเมนู">
            <LuMenu size={20} />
          </label>
          <Logo size={26} />
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" aria-label="ปิดเมนู" className="drawer-overlay"></label>
        <aside className="flex min-h-full w-60 flex-col border-r border-base-200 bg-base-100 p-4">
          <div className="px-2 py-1">
            <Logo size={30} />
          </div>
          <nav className="mt-5 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive(n.href)
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-base-content/80 hover:bg-base-200"
                }`}
              >
                {n.icon}
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-2">
            {user ? (
              <div className="rounded-lg bg-base-200/60 px-3 py-2">
                <div className="truncate text-sm font-medium">{user.displayName}</div>
                <div className="truncate text-xs text-base-content/50">
                  {user.email} · {user.role}
                </div>
              </div>
            ) : null}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/70 transition hover:bg-base-200"
              >
                <LuLogOut size={18} />
                ออกจากระบบ
              </button>
            </form>
            <div className="flex items-center justify-between px-1">
              <Link href="/" className="text-xs text-base-content/50 hover:text-primary">
                ← เว็บไซต์
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
