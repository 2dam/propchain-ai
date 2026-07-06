import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import { ensureDatabase, prisma } from "@/lib/prisma";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  await ensureDatabase();

  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-zinc-50">
      <div className="mx-auto max-w-lg">
        <Link href={`/properties/${property.id}`} className="text-sm text-teal-300">
          리포트로 돌아가기
        </Link>
        <section className="mt-6 rounded-lg border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-teal-300">Paid Report</p>
          <h1 className="mt-2 text-3xl font-semibold">{property.name}</h1>
          <p className="mt-3 leading-7 text-zinc-400">
            PDF 리포트 다운로드, 실거래가/건축물대장/생활권 요약, AI 투자 리포트를 포함합니다.
          </p>
          <div className="mt-6 rounded-md bg-white/[0.04] p-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">리포트 이용권</span>
              <span className="font-semibold">9,900원</span>
            </div>
          </div>
          <div className="mt-6">
            <CheckoutButton propertyId={property.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
