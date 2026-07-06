import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  await ensureDatabase();

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { analysis: true },
  });

  if (!property) {
    notFound();
  }

  const metrics = [
    ["매매가", formatCurrency(property.price)],
    ["면적", `${formatNumber(property.area)} m2`],
    ["준공연도", `${property.builtYear}년`],
    ["월세/임대수익", formatCurrency(property.monthlyRent)],
    ["관리비", formatCurrency(property.maintenanceFee)],
  ];

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-50 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/properties" className="text-sm text-teal-300 hover:text-teal-200">
          분석 기록으로 돌아가기
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-lg border border-white/10 bg-zinc-900 p-6">
            <p className="text-sm text-teal-300">{property.type}</p>
            <h1 className="mt-2 text-3xl font-semibold">{property.name}</h1>
            <p className="mt-3 leading-7 text-zinc-400">{property.address}</p>
            <div className="mt-6 grid gap-3">
              {metrics.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-md bg-white/[0.04] p-3">
                  <span className="text-zinc-400">{label}</span>
                  <span className="font-medium text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-md border border-white/10 p-4">
              <h2 className="font-semibold">주변/메모</h2>
              <p className="mt-2 leading-7 text-zinc-400">{property.neighborhood}</p>
            </div>
          </section>

          <section className="space-y-4">
            {property.analysis ? (
              <>
                <article className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-6">
                  <p className="text-sm text-teal-200">AI 투자 매력도</p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-5xl font-semibold">{property.analysis.score}</span>
                    <span className="pb-2 text-zinc-300">/ 100</span>
                  </div>
                  <p className="mt-4 leading-7 text-zinc-200">{property.analysis.summary}</p>
                </article>
                <ReportCard title="시세 분석" body={property.analysis.marketAnalysis} />
                <ReportCard title="투자 리포트" body={property.analysis.investmentReport} />
                <ReportCard title="리스크 분석" body={property.analysis.riskAnalysis} />
              </>
            ) : (
              <div className="rounded-lg border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                분석 리포트가 아직 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ReportCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 whitespace-pre-line leading-7 text-zinc-300">{body}</p>
    </article>
  );
}
