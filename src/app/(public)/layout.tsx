import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" aria-label="KKC Home Hug Property">
            <Logo size={38} />
          </Link>
          <nav className="ml-8 hidden gap-1 md:flex">
            <Link href="/properties?kind=sale" className="btn btn-ghost btn-sm">ซื้อ</Link>
            <Link href="/properties?kind=rent" className="btn btn-ghost btn-sm">เช่า</Link>
            <Link href="/properties" className="btn btn-ghost btn-sm">ทรัพย์ทั้งหมด</Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link href="/admin" className="btn btn-primary btn-sm">ผู้ดูแล</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-base-200 bg-base-200">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
          <Logo size={34} />
          <p className="mt-3 max-w-md text-base-content/60">
            แพลตฟอร์มอสังหาริมทรัพย์ขอนแก่น — ซื้อ ขาย เช่า บ้าน คอนโด ที่ดิน และอาคารพาณิชย์
          </p>
          <p className="mt-6 text-base-content/40">© 2026 KKC Home Hug Property</p>
        </div>
      </footer>
    </div>
  );
}
