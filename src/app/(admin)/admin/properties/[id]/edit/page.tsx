import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProperty, getAdminMeta, getTambons } from "@/lib/admin-properties";
import PropertyEditForm from "@/components/admin/PropertyEditForm";

export const metadata = { title: "แก้ไขทรัพย์" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, meta] = await Promise.all([getAdminProperty(id), getAdminMeta()]);
  if (!detail || !meta) notFound();

  const tambons = await getTambons(detail.amphoe_code);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/properties" className="text-sm text-base-content/50 hover:text-primary">← ทรัพย์</Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{detail.title}</h1>
        <p className="mt-1 font-mono text-sm text-base-content/50">{detail.slug}</p>
      </div>
      <PropertyEditForm detail={detail} meta={meta} tambons={tambons} />
    </div>
  );
}
