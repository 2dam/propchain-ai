import Link from "next/link";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  await ensureDatabase();

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { analysis: true },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-50 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-teal-300">Analysis History</p>
            <h1 className="mt-2 text-4xl font-semibold">분석 기록</h1>
          </div>
          <Link href="/properties/new" className="rounded-md bg-teal-400 px-4 py-2 font-semibold text-zinc-950">
            새 매물 분석
          </Link>
        </div>

        <div className="grid gap-4">
          {properties.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-zinc-900 p-8 text-zinc-300">
              아직 등록된 매물이 없습니다.
            </div>
          ) : (
            properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="rounded-lg border border-white/10 bg-zinc-900 p-5 transition hover:border-teal-300/50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{property.name}</h2>
                    <p className="mt-1 text-sm text-zinc-400">{property.address}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-teal-200">{formatCurrency(property.price)}</p>
                    <p className="mt-1 text-sm text-zinc-400">{property.type}</p>
                  </div>
                </div>
                {property.analysis ? (
                  <p className="mt-4 text-sm text-zinc-300">{property.analysis.summary}</p>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
