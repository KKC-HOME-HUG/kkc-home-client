export default function MapEmbed({
  lat,
  lng,
  title,
}: {
  lat: number | null;
  lng: number | null;
  title: string;
}) {
  if (lat == null || lng == null) return null;
  // Keyless Google Maps embed (no API key). For production, switch to the
  // official Maps Embed API with a key.
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=th&output=embed`;
  const gmap = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="space-y-2">
      <iframe
        src={src}
        title={`แผนที่ ${title}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full rounded-lg border border-base-300"
      />
      <a href={gmap} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
        🗺️ เปิดใน Google Maps
      </a>
    </div>
  );
}
