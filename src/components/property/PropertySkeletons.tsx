// Loading skeletons for the public property views — mirror the real layouts
// (card grid, detail gallery + info) using daisyUI's `skeleton` shimmer.

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-200 bg-base-100">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-1/3" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="skeleton aspect-[4/3] w-full rounded-2xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-16 w-20 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-base-200 p-5">
          <div className="skeleton h-7 w-2/3" />
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}
