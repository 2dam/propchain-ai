"use client";

import { useState } from "react";

export function CheckoutButton({ propertyId }: { propertyId: string }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function pay() {
    setIsSubmitting(true);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });

    setIsPaid(response.ok);
    setIsSubmitting(false);
  }

  if (isPaid) {
    return (
      <a
        href={`/api/reports/${propertyId}/pdf`}
        className="inline-flex w-full justify-center rounded-md bg-teal-400 px-4 py-3 font-semibold text-zinc-950"
      >
        PDF 리포트 다운로드
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={pay}
      disabled={isSubmitting}
      className="w-full rounded-md bg-teal-400 px-4 py-3 font-semibold text-zinc-950 disabled:opacity-70"
    >
      {isSubmitting ? "결제 처리 중" : "유료 리포트 결제 9,900원"}
    </button>
  );
}
