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

  await prisma.feedback.create({
    data: parsed.data,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
