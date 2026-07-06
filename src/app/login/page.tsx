import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-zinc-50">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-medium text-teal-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold">로그인</h1>
        <p className="mt-3 text-zinc-400">리포트 구매와 다운로드를 이어서 사용합니다.</p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <Link href="/signup" className="mt-4 inline-block text-sm text-teal-300">
          새 계정을 만들까요?
        </Link>
      </div>
    </main>
  );
}
