import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, requireAdmin, type AdminUser } from "@/lib/session";
import UserEditForm from "@/components/admin/UserEditForm";

export const metadata = { title: "แก้ไขผู้ใช้" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  let user: AdminUser | null = null;
  try {
    user = await apiGet<AdminUser>(`/api/users/${id}`);
  } catch {
    user = null;
  }
  if (!user) notFound();

  return (
    <div className="max-w-md space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm text-base-content/50 hover:text-primary">
          ← ผู้ใช้งาน
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{user.displayName}</h1>
      </div>
      <div className="card border border-base-200 bg-base-100">
        <div className="card-body">
          <UserEditForm user={user} />
        </div>
      </div>
    </div>
  );
}
