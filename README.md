# PropChain AI

부동산 토큰 거래 전에 매물 정보를 등록하고 AI가 시세 분석, 투자 리포트, 리스크 분석을 제공하는 MVP 웹앱입니다.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- OpenAI API
- shadcn/ui 스타일의 다크 테마 컴포넌트

## Getting Started

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env` and set `OPENAI_API_KEY` to enable live AI analysis.
If no key is provided, the app uses a deterministic fallback analysis so the MVP remains usable.

The development SQLite tables are created automatically on first app use.
