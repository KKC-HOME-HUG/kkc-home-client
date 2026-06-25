import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="navbar border-b border-base-200 bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            🏠 KKC Home Hug
          </Link>
        </div>
        <div className="flex-none gap-1">
          <Link href="/admin" className="btn btn-ghost btn-sm">
            ผู้ดูแล
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="footer footer-center bg-base-200 p-4 text-base-content">
        <p>© KKC Home Hug — อสังหาริมทรัพย์ขอนแก่น</p>
      </footer>
    </div>
  );
}
