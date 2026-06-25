import Link from "next/link";
import { LuLayoutDashboard, LuBuilding2, LuInbox } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV = [
  { href: "/admin", label: "แดชบอร์ด", icon: <LuLayoutDashboard size={18} /> },
  { href: "/admin/properties", label: "ทรัพย์", icon: <LuBuilding2 size={18} /> },
  { href: "/admin/leads", label: "Leads", icon: <LuInbox size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base-200/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-base-200 bg-base-100 p-4 md:flex">
        <div className="px-2 py-1">
          <Logo size={30} />
        </div>
        <nav className="mt-5 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/80 transition hover:bg-base-200"
            >
              {n.icon}
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between px-1">
          <Link href="/" className="text-xs text-base-content/50 hover:text-primary">
            ← เว็บไซต์
          </Link>
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
