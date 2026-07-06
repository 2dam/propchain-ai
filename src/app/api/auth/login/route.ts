import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession, verifyPassword } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  await ensureDatabase();

  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "이메일과 비밀번호를 확인해주세요." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ message: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
  }

  setSession(user.id);
  return NextResponse.json({ ok: true });
}
