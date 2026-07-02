import { PropertyGridSkeleton } from "@/components/property/PropertySkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="skeleton h-8 w-56" />
      <div className="skeleton mt-4 h-14 w-full rounded-xl" />
      <div className="skeleton mb-5 mt-4 h-4 w-32" />
      <PropertyGridSkeleton />
    </div>
  );
}
