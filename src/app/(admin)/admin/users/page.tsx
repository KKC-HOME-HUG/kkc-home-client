import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { apiGet, requireAdmin, type AdminUser } from "@/lib/session";
import UserActiveToggle from "@/components/admin/UserActiveToggle";

type UserList = { items: AdminUser[]; total: number; page: number; per_page: number };

export const metadata = { title: "ผู้ใช้งาน" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const me = await requireAdmin();
  const { page = "1" } = await searchParams;

  let data: UserList | null = null;
  try {
    data = await apiGet<UserList>(`/api/users?page=${page}&per_page=20`);
  } catch {
    data = null;
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const current = data?.page ?? 1;
  const perPage = data?.per_page ?? 20;
  const pages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ผู้ใช้งาน</h1>
          <p className="mt-1 text-sm text-base-content/60">จัดการทีมงาน ({total.toLocaleString("th-TH")} คน)</p>
        </div>
        <Link href="/admin/users/new" className="btn btn-primary btn-sm gap-1">
          <LuPlus size={16} /> เพิ่มผู้ใช้
        </Link>
      </div>

      {/* Cards — phone (< md) */}
      <div className="space-y-3 md:hidden">
        {items.length ? (
          items.map((u) => (
            <div
              key={u.id}
              className={`rounded-xl border border-base-200 bg-base-100 p-4 ${u.id === me.id ? "ring-1 ring-accent/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="truncate">{u.displayName}</span>
                    {u.id === me.id ? <span className="badge badge-accent badge-sm font-semibold">คุณ</span> : null}
                  </div>
                  <div className="truncate text-sm text-base-content/60">{u.email}</div>
                </div>
                <UserActiveToggle id={u.id} isActive={u.isActive} self={u.id === me.id} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`badge badge-sm ${u.role === "ADMIN" ? "badge-primary" : "badge-ghost"}`}>{u.role}</span>
                  <span className={`badge badge-sm badge-outline ${u.isActive ? "badge-success" : "badge-error"}`}>
                    {u.isActive ? "ใช้งาน" : "ปิด"}
                  </span>
                </div>
                <Link href={`/admin/users/${u.id}`} className="btn btn-ghost btn-xs">
                  แก้ไข
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-base-200 bg-base-100 py-10 text-center text-sm text-base-content/50">
            ไม่มีผู้ใช้ หรือไม่มีสิทธิ์เข้าถึง
          </p>
        )}
      </div>

      {/* Table — md and up */}
      <div className="hidden overflow-x-auto rounded-xl border border-base-200 bg-base-100 md:block">
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th className="text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((u) => (
                <tr key={u.id} className={u.id === me.id ? "bg-accent/5" : undefined}>
                  <td className="font-medium">
                    {u.displayName}
                    {u.id === me.id ? (
                      <span className="badge badge-accent ml-2 align-middle font-semibold">
                        คุณ
                      </span>
                    ) : null}
                  </td>
                  <td className="text-base-content/70">{u.email}</td>
                  <td>
                    <span className={`badge badge-sm ${u.role === "ADMIN" ? "badge-primary" : "badge-ghost"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-sm ${u.isActive ? "badge-success" : "badge-error"} badge-outline`}>
                      {u.isActive ? "ใช้งาน" : "ปิด"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/users/${u.id}`} className="btn btn-ghost btn-xs">
                        แก้ไข
                      </Link>
                      <UserActiveToggle id={u.id} isActive={u.isActive} self={u.id === me.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-base-content/50">
                  ไม่มีผู้ใช้ หรือไม่มีสิทธิ์เข้าถึง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="flex justify-center">
          <div className="join">
            {current > 1 ? (
              <Link href={`/admin/users?page=${current - 1}`} className="btn btn-sm join-item">
                ก่อนหน้า
              </Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ก่อนหน้า</button>
            )}
            <button className="btn btn-sm join-item pointer-events-none">
              {current} / {pages}
            </button>
            {current < pages ? (
              <Link href={`/admin/users?page=${current + 1}`} className="btn btn-sm join-item">
                ถัดไป
              </Link>
            ) : (
              <button className="btn btn-sm join-item btn-disabled">ถัดไป</button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
