"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const propertyTypes = ["아파트", "오피스텔", "상가", "토지", "빌딩"];

export function PropertyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? "분석 생성 중 문제가 발생했습니다.");
      setIsSubmitting(false);
      return;
    }

    const data = await response.json();
    router.push(`/properties/${data.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-white/10 bg-zinc-900 p-5 shadow-2xl shadow-black/20">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="매물명" name="name" placeholder="성수 프라임 빌딩" required />
        <Field label="주소" name="address" placeholder="서울 성동구 성수동..." required />
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-200">매물 유형</span>
          <select
            name="type"
            className="h-11 rounded-md border border-white/10 bg-zinc-950 px-3 text-zinc-100 outline-none ring-teal-300 transition focus:ring-2"
            required
          >
            {propertyTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <Field label="매매가" name="price" type="number" placeholder="1500000000" required />
        <Field label="면적(m2)" name="area" type="number" placeholder="240" required />
        <Field label="준공연도" name="builtYear" type="number" placeholder="2018" required />
        <Field label="월세/임대수익" name="monthlyRent" type="number" placeholder="8500000" required />
        <Field label="관리비" name="maintenanceFee" type="number" placeholder="900000" required />
      </div>

      <label className="mt-5 grid gap-2">
        <span className="text-sm font-medium text-zinc-200">주변 인프라/입지 메모</span>
        <textarea
          name="neighborhood"
          rows={5}
          placeholder="역세권, 상권, 학군, 공실률, 개발 호재, 우려 사항 등을 입력하세요."
          className="rounded-md border border-white/10 bg-zinc-950 px-3 py-3 text-zinc-100 outline-none ring-teal-300 transition placeholder:text-zinc-600 focus:ring-2"
          required
        />
      </label>

      {error ? <p className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          AI 분석 생성
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? 0 : undefined}
        className="h-11 rounded-md border border-white/10 bg-zinc-950 px-3 text-zinc-100 outline-none ring-teal-300 transition placeholder:text-zinc-600 focus:ring-2"
      />
    </label>
  );
}
