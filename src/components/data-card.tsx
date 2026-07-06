type DataCardProps = {
  title: string;
  source: string;
  status: string;
  items: Array<{ label: string; value: string }>;
};

export function DataCard({ title, source, status, items }: DataCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{source}</p>
        </div>
        <span className="w-fit rounded-full bg-white/[0.06] px-3 py-1 text-xs text-zinc-300">{status}</span>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="flex justify-between gap-4 rounded-md bg-white/[0.04] p-3">
            <span className="text-zinc-400">{item.label}</span>
            <span className="text-right font-medium text-zinc-100">{item.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
