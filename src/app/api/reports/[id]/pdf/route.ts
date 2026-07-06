import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await ensureDatabase();

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { analysis: true },
  });

  if (!property || !property.analysis) {
    return NextResponse.json({ message: "리포트를 찾을 수 없습니다." }, { status: 404 });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      propertyId: property.id,
      status: "PAID",
    },
    select: { id: true },
  });

  if (!payment) {
    return NextResponse.json({ message: "유료 리포트 결제가 필요합니다." }, { status: 402 });
  }

  const buffer = await createPdfBuffer({ ...property, analysis: property.analysis });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="propchain-${property.id}.pdf"`,
    },
  });
}

type ReportProperty = NonNullable<Awaited<ReturnType<typeof prisma.property.findUnique>>> & {
  analysis: NonNullable<Awaited<ReturnType<typeof prisma.analysis.findFirst>>>;
};

async function createPdfBuffer(property: ReportProperty) {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks: Buffer[] = [];
    const fontPath = "C:/Windows/Fonts/malgun.ttf";

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    if (existsSync(fontPath)) {
      doc.font(fontPath);
    }

    doc.fontSize(22).text("PropChain AI 투자 리포트");
    doc.moveDown();
    doc.fontSize(15).text(property.name);
    doc.fontSize(10).fillColor("#555555").text(property.address);
    doc.moveDown();

    doc.fillColor("#111111").fontSize(12);
    doc.text(`매물 유형: ${property.type}`);
    doc.text(`매매가: ${formatCurrency(property.price)}`);
    doc.text(`면적: ${property.area.toLocaleString("ko-KR")} m2`);
    doc.text(`준공연도: ${property.builtYear}년`);
    doc.text(`월 임대수익: ${formatCurrency(property.monthlyRent)}`);
    doc.text(`관리비: ${formatCurrency(property.maintenanceFee)}`);
    doc.moveDown();

    doc.fontSize(14).text(`투자 매력도: ${property.analysis.score}/100`);
    doc.text(`리스크 점수: ${property.analysis.riskScore}/100`);
    doc.moveDown();

    addSection(doc, "요약", property.analysis.summary);
    addSection(doc, "시세 분석", property.analysis.marketAnalysis);
    addSection(doc, "투자 리포트", property.analysis.investmentReport);
    addSection(doc, "리스크 분석", property.analysis.riskAnalysis);

    doc.end();
  });
}

function addSection(doc: PDFKit.PDFDocument, title: string, body: string) {
  doc.moveDown();
  doc.fontSize(14).fillColor("#111111").text(title);
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#333333").text(body, { lineGap: 4 });
}
