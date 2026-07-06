import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { generatePropertyAnalysis } from "@/lib/ai";

const propertySchema = z.object({
  name: z.string().min(2),
  address: z.string().min(4),
  type: z.enum(["아파트", "오피스텔", "상가", "토지", "빌딩"]),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  builtYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5),
  monthlyRent: z.coerce.number().min(0),
  maintenanceFee: z.coerce.number().min(0),
  neighborhood: z.string().min(5),
});

export async function POST(request: Request) {
  await ensureDatabase();

  const body = await request.json();
  const parsed = propertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "입력값을 다시 확인해주세요." }, { status: 400 });
  }

  const property = await prisma.property.create({
    data: parsed.data,
  });

  const analysis = await generatePropertyAnalysis(parsed.data);

  await prisma.analysis.create({
    data: {
      propertyId: property.id,
      ...analysis,
    },
  });

  return NextResponse.json({ id: property.id }, { status: 201 });
}
