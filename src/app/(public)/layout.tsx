import Link from "next/link";
import { FaLine, FaFacebook, FaTiktok } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  const hasSocial = s.line_url || s.facebook_url || s.tiktok_url || s.phone;
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
          {hasSocial ? (
            <div className="mt-5 flex items-center gap-2">
              {s.line_url ? (
                <a href={s.line_url} target="_blank" rel="noopener noreferrer" aria-label="LINE" className="btn btn-ghost btn-sm btn-square">
                  <FaLine size={20} />
                </a>
              ) : null}
              {s.facebook_url ? (
                <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="btn btn-ghost btn-sm btn-square">
                  <FaFacebook size={20} />
                </a>
              ) : null}
              {s.tiktok_url ? (
                <a href={s.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="btn btn-ghost btn-sm btn-square">
                  <FaTiktok size={18} />
                </a>
              ) : null}
              {s.phone ? (
                <a href={`tel:${s.phone}`} aria-label="โทร" className="btn btn-ghost btn-sm btn-square">
                  <LuPhone size={18} />
                </a>
              ) : null}
            </div>
          ) : null}
          <p className="mt-6 text-base-content/40">© 2026 KKC Home Hug Property</p>
        </div>
      </footer>
    </div>
  );
}
