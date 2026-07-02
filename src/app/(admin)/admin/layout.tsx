import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
