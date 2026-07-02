import { PropertyGridSkeleton } from "@/components/property/PropertySkeletons";

export default function Loading() {
  return (
    <div>
      <div className="skeleton h-[320px] w-full rounded-none" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="skeleton h-7 w-48" />
        <div className="mt-6">
          <PropertyGridSkeleton />
        </div>
      </div>
    </div>
  );
}
