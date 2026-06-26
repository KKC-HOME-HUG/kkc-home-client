import Link from "next/link";
import UserCreateForm from "@/components/admin/UserCreateForm";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "เพิ่มผู้ใช้" };

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <div className="max-w-md space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm text-base-content/50 hover:text-primary">
          ← ผู้ใช้งาน
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">เพิ่มผู้ใช้</h1>
      </div>
      <div className="card border border-base-200 bg-base-100">
        <div className="card-body">
          <UserCreateForm />
        </div>
      </div>
    </div>
  );
}
