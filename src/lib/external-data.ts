type PropertyDataInput = {
  address: string;
  type: string;
  price: number;
  builtYear: number;
};

export async function getMarketAndPublicData(property: PropertyDataInput) {
  const [transactions, building] = await Promise.all([
    fetchRealTransactions(property),
    fetchBuildingRegister(property),
  ]);

  return {
    transactions,
    building,
    lifestyle: getSchoolTransportData(property.address),
  };
}

async function fetchRealTransactions(property: PropertyDataInput) {
  if (!process.env.PUBLIC_DATA_API_KEY || !process.env.REAL_ESTATE_API_URL) {
    return {
      source: "MVP 추정 데이터",
      status: "API 키 미설정",
      items: [
        { label: "최근 유사 매매가", value: `${Math.round(property.price * 0.96).toLocaleString("ko-KR")}원` },
        { label: "상단 참고가", value: `${Math.round(property.price * 1.08).toLocaleString("ko-KR")}원` },
        { label: "가격 적정성", value: "입력가 기준 보수 검토 필요" },
      ],
    };
  }

  try {
    const url = new URL(process.env.REAL_ESTATE_API_URL);
    url.searchParams.set("serviceKey", process.env.PUBLIC_DATA_API_KEY);
    url.searchParams.set("address", property.address);
    url.searchParams.set("type", property.type);

    const response = await fetch(url, { next: { revalidate: 60 * 60 } });
    return {
      source: "실거래가 API",
      status: response.ok ? "연동됨" : "응답 확인 필요",
      items: [{ label: "API 응답", value: response.ok ? "수신 완료" : `HTTP ${response.status}` }],
    };
  } catch {
    return {
      source: "실거래가 API",
      status: "연동 실패",
      items: [{ label: "상태", value: "환경변수와 API URL을 확인하세요" }],
    };
  }
}

async function fetchBuildingRegister(property: PropertyDataInput) {
  if (!process.env.PUBLIC_DATA_API_KEY || !process.env.BUILDING_REGISTER_API_URL) {
    const age = new Date().getFullYear() - property.builtYear;
    return {
      source: "MVP 추정 데이터",
      status: "API 키 미설정",
      items: [
        { label: "건축 연한", value: `${Math.max(age, 0)}년` },
        { label: "노후도", value: age > 20 ? "정밀 점검 권장" : "일반 점검" },
        { label: "대장 확인", value: "용도/위반건축물 여부 확인 필요" },
      ],
    };
  }

  try {
    const url = new URL(process.env.BUILDING_REGISTER_API_URL);
    url.searchParams.set("serviceKey", process.env.PUBLIC_DATA_API_KEY);
    url.searchParams.set("address", property.address);

    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    return {
      source: "건축물대장 API",
      status: response.ok ? "연동됨" : "응답 확인 필요",
      items: [{ label: "API 응답", value: response.ok ? "수신 완료" : `HTTP ${response.status}` }],
    };
  } catch {
    return {
      source: "건축물대장 API",
      status: "연동 실패",
      items: [{ label: "상태", value: "환경변수와 API URL을 확인하세요" }],
    };
  }
}

function getSchoolTransportData(address: string) {
  const isSeoul = address.includes("서울");
  const isStationArea = /역|강남|성수|잠실|여의도|마포|판교/.test(address);

  return {
    source: "MVP 생활권 추정",
    status: "기초 분석",
    items: [
      { label: "교통", value: isStationArea ? "역세권 가능성 높음" : "교통 접근성 추가 확인" },
      { label: "학군", value: isSeoul ? "학교/학원 접근성 확인 권장" : "지역 학군 데이터 연동 필요" },
      { label: "생활권", value: "상권, 병원, 공원 접근성을 현장 확인하세요" },
    ],
  };
}
