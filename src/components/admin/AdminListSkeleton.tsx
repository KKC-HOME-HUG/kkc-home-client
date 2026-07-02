// Loading skeleton for the admin lists — matches admin-responsive:
// stacked cards below `md`, table-like rows at/above `md`.

export default function AdminListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      {/* header (title + action) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="skeleton h-7 w-40" />
          <div className="skeleton h-4 w-28" />
        </div>
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>

      {/* Cards — phone (< md) */}
      <div className="space-y-3 md:hidden">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="rounded-xl border border-base-200 bg-base-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-full space-y-2">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-2/3" />
              </div>
              <div className="skeleton h-6 w-10 rounded-full" />
            </div>
            <div className="mt-3 flex justify-between">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-5 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Table — md and up */}
      <div className="hidden overflow-hidden rounded-xl border border-base-200 bg-base-100 md:block">
        <div className="border-b border-base-200 p-4">
          <div className="skeleton h-4 w-1/3" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-base-200 p-4 last:border-0">
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-5 w-16" />
            <div className="skeleton h-5 w-16" />
            <div className="skeleton h-6 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
