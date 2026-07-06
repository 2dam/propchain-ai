import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";

const paymentSchema = z.object({
  propertyId: z.string().min(1),
});

export async function POST(request: Request) {
  await ensureDatabase();

  const parsed = paymentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "결제 대상 리포트를 확인해주세요." }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id: parsed.data.propertyId },
    select: { id: true },
  });

  if (!property) {
    return NextResponse.json({ message: "매물을 찾을 수 없습니다." }, { status: 404 });
  }

  const payment = await prisma.payment.create({
    data: {
      propertyId: property.id,
      userId: getSessionUserId(),
      amount: 9900,
      status: "PAID",
      provider: "MVP_MOCK",
    },
  });

  return NextResponse.json({ ok: true, paymentId: payment.id });
}
