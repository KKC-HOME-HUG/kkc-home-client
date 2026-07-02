import { PropertyDetailSkeleton } from "@/components/property/PropertySkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="skeleton mb-4 h-4 w-40" />
      <PropertyDetailSkeleton />
    </div>
  );
}
