import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col gap-1 bg-base-200 p-4">
        <Link href="/admin" className="px-2 text-lg font-semibold">
          KKC Admin
        </Link>
        <div className="divider my-1" />
        <Link href="/admin" className="btn btn-ghost btn-sm justify-start">
          แดชบอร์ด
        </Link>
        <Link
          href="/admin/properties"
          className="btn btn-ghost btn-sm justify-start"
        >
          ทรัพย์
        </Link>
        <Link
          href="/admin/leads"
          className="btn btn-ghost btn-sm justify-start"
        >
          Leads
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <Link href="/" className="btn btn-ghost btn-xs">
            ← เว็บไซต์
          </Link>
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
