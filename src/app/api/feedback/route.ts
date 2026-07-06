import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureDatabase, prisma } from "@/lib/prisma";

const feedbackSchema = z.object({
  analysisId: z.string().min(1),
  value: z.enum(["helpful", "neutral", "not_helpful"]),
});

export async function POST(request: Request) {
  await ensureDatabase();

  const body = await request.json();
  const parsed = feedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "피드백 값을 다시 확인해주세요." }, { status: 400 });
  }

  const analysis = await prisma.analysis.findUnique({
    where: { id: parsed.data.analysisId },
    select: { id: true },
  });

  if (!analysis) {
    return NextResponse.json({ message: "분석 리포트를 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.feedback.create({
    data: parsed.data,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
