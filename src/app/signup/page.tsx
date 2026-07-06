import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-zinc-50">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-medium text-teal-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold">회원가입</h1>
        <p className="mt-3 text-zinc-400">분석 기록과 유료 리포트 구매 내역을 관리합니다.</p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <Link href="/login" className="mt-4 inline-block text-sm text-teal-300">
          이미 계정이 있나요?
        </Link>
      </div>
    </main>
  );
}
