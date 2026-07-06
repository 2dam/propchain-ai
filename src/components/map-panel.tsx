export function MapPanel({ address }: { address: string }) {
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
      <div className="p-6">
        <h2 className="text-xl font-semibold">지도</h2>
        <p className="mt-2 text-sm text-zinc-400">{address}</p>
      </div>
      <iframe
        title="property map"
        src={mapUrl}
        className="h-72 w-full border-0 grayscale invert"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </article>
  );
}
