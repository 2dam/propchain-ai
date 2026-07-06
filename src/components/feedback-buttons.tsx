"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp, Waves } from "lucide-react";

const options = [
  { value: "helpful", label: "도움됨", icon: ThumbsUp },
  { value: "neutral", label: "애매함", icon: Waves },
  { value: "not_helpful", label: "별로예요", icon: ThumbsDown },
];

export function FeedbackButtons({ analysisId }: { analysisId: string }) {
  const [selected, setSelected] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submitFeedback(value: string) {
    setSelected(value);
    setIsSaving(true);

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisId, value }),
    });

    setIsSaving(false);
  }

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">사용자 반응</h2>
          <p className="mt-2 text-sm text-zinc-400">AI 분석 결과가 의사결정에 도움이 되었나요?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => submitFeedback(option.value)}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-teal-300 bg-teal-300 text-zinc-950"
                    : "border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      {selected ? <p className="mt-4 text-sm text-teal-200">피드백이 저장되었습니다.</p> : null}
    </article>
  );
}
