import OpenAI from "openai";

type PropertyInput = {
  name: string;
  address: string;
  type: string;
  price: number;
  area: number;
  builtYear: number;
  monthlyRent: number;
  maintenanceFee: number;
  neighborhood: string;
};

type AnalysisResult = {
  score: number;
  summary: string;
  marketAnalysis: string;
  investmentReport: string;
  riskAnalysis: string;
};

export async function generatePropertyAnalysis(property: PropertyInput): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    return createFallbackAnalysis(property);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a Korean real estate investment analyst. Return only valid JSON with keys score, summary, marketAnalysis, investmentReport, riskAnalysis. score must be 0-100.",
        },
        {
          role: "user",
          content: JSON.stringify(property),
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return createFallbackAnalysis(property);
    }

    const parsed = JSON.parse(content) as AnalysisResult;
    return {
      score: clampScore(parsed.score),
      summary: parsed.summary,
      marketAnalysis: parsed.marketAnalysis,
      investmentReport: parsed.investmentReport,
      riskAnalysis: parsed.riskAnalysis,
    };
  } catch {
    return createFallbackAnalysis(property);
  }
}

function createFallbackAnalysis(property: PropertyInput): AnalysisResult {
  const annualRent = property.monthlyRent * 12;
  const netAnnualRent = Math.max(annualRent - property.maintenanceFee * 12, 0);
  const capRate = property.price > 0 ? (netAnnualRent / property.price) * 100 : 0;
  const age = new Date().getFullYear() - property.builtYear;
  const score = clampScore(Math.round(58 + capRate * 5 - Math.max(age - 15, 0) * 0.6));

  return {
    score,
    summary: `${property.name}은 예상 순임대수익률 ${capRate.toFixed(
      2,
    )}% 수준의 ${property.type} 매물입니다. 입력 정보 기준으로 수익성과 입지 메모를 함께 검토할 필요가 있습니다.`,
    marketAnalysis: `매매가 ${property.price.toLocaleString(
      "ko-KR",
    )}원, 면적 ${property.area.toLocaleString("ko-KR")}m2 기준입니다. 주변 정보: ${property.neighborhood}`,
    investmentReport: `월 임대수익과 관리비를 반영한 연 순수익은 약 ${netAnnualRent.toLocaleString(
      "ko-KR",
    )}원입니다. 토큰화 전 단계에서는 임대차 계약 조건, 권리관계, 실제 거래 사례 확인이 필요합니다.`,
    riskAnalysis: `준공 후 약 ${Math.max(age, 0)}년 경과했습니다. 공실 가능성, 관리비 변동, 주변 공급량, 상권 변화, 법적 권리관계를 핵심 리스크로 점검하세요.`,
  };
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Number.isFinite(score) ? score : 50));
}
