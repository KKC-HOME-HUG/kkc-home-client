import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/ui/Logo";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-sm flex-col justify-center px-4">
      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body">
          <Logo size={36} />
          <h1 className="mt-2 text-xl font-semibold tracking-tight">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="text-sm text-base-content/50">ใช้บัญชีทีมงานเพื่อจัดการทรัพย์และผู้ใช้</p>
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
      <Link href="/" className="mt-5 text-center text-sm text-base-content/50 hover:text-primary">
        ← กลับหน้าแรก
      </Link>
    </div>
  );
}
