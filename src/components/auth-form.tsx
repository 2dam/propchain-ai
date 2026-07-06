"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? "요청을 처리하지 못했습니다.");
      setIsSubmitting(false);
      return;
    }

    router.push("/properties");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-white/10 bg-zinc-900 p-6">
      <div className="space-y-4">
        {mode === "signup" ? <Input label="이름" name="name" placeholder="Mo La" /> : null}
        <Input label="이메일" name="email" type="email" placeholder="you@example.com" />
        <Input label="비밀번호" name="password" type="password" placeholder="8자 이상" />
      </div>
      {error ? <p className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-teal-400 px-4 py-3 font-semibold text-zinc-950 disabled:opacity-70"
      >
        {mode === "signup" ? "회원가입" : "로그인"}
      </button>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="h-11 rounded-md border border-white/10 bg-zinc-950 px-3 text-zinc-100 outline-none ring-teal-300 transition placeholder:text-zinc-600 focus:ring-2"
      />
    </label>
  );
}
