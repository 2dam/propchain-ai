import Link from "next/link";
import { ArrowRight, BarChart3, Building2, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "시세 분석",
    description: "입력한 매물 정보와 수익 데이터를 기반으로 예상 가격 적정성과 수익률을 요약합니다.",
  },
  {
    icon: Sparkles,
    title: "AI 투자 리포트",
    description: "입지, 현금흐름, 보유 리스크를 한 번에 읽을 수 있는 투자 관점 리포트를 생성합니다.",
  },
  {
    icon: ShieldCheck,
    title: "리스크 진단",
    description: "공실, 노후도, 관리비, 주변 인프라 불확실성 등 의사결정 전 확인할 요소를 정리합니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,184,166,0.18),transparent_35%,rgba(59,130,246,0.16)_70%,transparent)]" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl content-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-sm text-teal-200">
              <Building2 className="h-4 w-4" />
              부동산 토큰화 전 AI 실사 MVP
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
              PropChain AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              실제 부동산 토큰 거래 전에 매물 정보를 등록하고, AI가 시세 분석과 투자 리포트,
              리스크 분석을 제공하는 부동산 정보 플랫폼입니다.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties/new"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-teal-300"
              >
                매물 분석 시작
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-3 font-semibold text-zinc-100 transition hover:bg-white/10"
              >
                분석 기록 보기
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-zinc-400">AI 분석 샘플</p>
                  <h2 className="mt-1 text-2xl font-semibold">성수 프라임 빌딩</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">
                  매력도 82
                </span>
              </div>
              <div className="grid gap-3 py-5 sm:grid-cols-3">
                {["예상 cap rate 4.8%", "공실 리스크 중간", "입지 점수 높음"].map((item) => (
                  <div key={item} className="rounded-md bg-white/[0.04] p-4 text-sm text-zinc-200">
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-3 rounded-md bg-black/30 p-4 text-sm leading-6 text-zinc-300">
                <p>
                  준공연도와 임대수익 대비 매매가를 기준으로 수익성은 양호하지만, 관리비와
                  주변 상권 변동성을 추가 확인해야 합니다.
                </p>
                <p className="text-teal-200">권장: 임대차 계약 만기와 주변 신규 공급량 검토</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-teal-300">MVP Scope</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">거래 전 판단을 빠르게 만듭니다</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-white/10 bg-zinc-900 p-6">
              <feature.icon className="h-6 w-6 text-teal-300" />
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
