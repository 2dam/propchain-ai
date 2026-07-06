import { PropertyForm } from "@/components/property-form";

export default function NewPropertyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-50 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-teal-300">Property Intake</p>
          <h1 className="mt-2 text-4xl font-semibold">매물 등록 및 AI 분석</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            매물의 가격, 수익, 입지 정보를 입력하면 AI가 투자 리포트와 핵심 리스크를 생성합니다.
          </p>
        </div>
        <PropertyForm />
      </div>
    </main>
  );
}
