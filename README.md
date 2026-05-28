# @krdn/saju

> Four Pillars of Destiny (사주명리) — TypeScript 멀티 학파 computation 엔진 + LLM 프롬프트 + Zod 스키마

생년월일시를 입력받아 사주 명식(SajuChart)을 계산하고, 4개 학파(한국 / 중국 자평 / 중국 맹파 / 일본 추명학) × 4개 시간축(평생운 / 년운 / 월운 / 일진)으로 해석을 제공합니다. LLM narrative 생성을 위한 프롬프트 템플릿과 응답 검증용 Zod 스키마도 함께 포함됩니다.

## Install

```bash
pnpm add @krdn/saju
# or
npm install @krdn/saju
```

요구사항: Node.js ≥ 20, ESM only.

## Quick Start

### 1. 사주 명식 계산

```typescript
import { computeSajuChart } from "@krdn/saju";

const chart = computeSajuChart({
  birthDate: "1967-03-29",
  birthTime: "05:30",
  calendar: "solar",
  gender: "male",
});

console.log(chart.pillars);   // { year, month, day, hour }
console.log(chart.strength);  // "신강" | "신약" | "균형" | "종아" | "종재" | "종살"
console.log(chart.pattern);   // "傷官格" 등
console.log(chart.yongSin);   // 용신 오행 배열
```

### 2. 4학파 평생운 compose

```typescript
import { buildTriNationLifetime, resolveChartContext } from "@krdn/saju";

const ctx = resolveChartContext({
  birthDate: "1967-03-29",
  birthTime: "05:30",
  calendar: "solar",
  gender: "male",
  cityKey: "seoul",
});

const lifetime = buildTriNationLifetime(ctx);
if (lifetime.ok) {
  lifetime.value.frames.forEach((frame) => {
    console.log(frame.school, frame.yongshin, frame.summary);
  });
}
```

### 3. 년운 / 월운 / 일진

```typescript
import {
  buildTriNationYearlyFromBirth,
  buildTriNationMonthlyFromBirth,
  buildTriNationDailyLiteFromBirth,
} from "@krdn/saju";

const birth = { birthDate: "1967-03-29", birthTime: "05:30",
                calendar: "solar", gender: "male", cityKey: "seoul" } as const;

const yearly  = buildTriNationYearlyFromBirth(birth, { targetYear: 2026 });
const monthly = buildTriNationMonthlyFromBirth(birth, { targetYear: 2026, targetMonth: 5 });
const daily   = buildTriNationDailyLiteFromBirth(birth, { targetDate: "2026-05-28" });
```

### 4. LLM 프롬프트 + 스키마

```typescript
import {
  buildLifetimePrompt,
  LIFETIME_SCHOOL_SCHEMAS,
} from "@krdn/saju";

const prompt = buildLifetimePrompt({ school: "ko", frame: lifetime.value.frames[0] });
// → { system, user } 프롬프트 번들

const schema = LIFETIME_SCHOOL_SCHEMAS.ko;
const parsed = schema.parse(llmResponseJson); // 검증된 narrative 객체
```

## 아키텍처

3개 레이어로 구성되며, 각 레이어는 아래 레이어에만 의존합니다.

### 1. Core Computation

`computeSajuChart` 는 동기 파이프라인입니다:

```
computePillars → computeElements → computeShenStrength → computeTenGods → computePattern → computeMajorFortunes
```

- `time/trueSolar.ts` — 진태양시 보정 + 시주 모호성 처리
- `consensus/` — lunar-javascript ↔ korean-lunar-calendar 일주(日柱) 합의 검증
- `hanja.ts` — 천간/지지 상수 + 오행/십신 매핑
- `lib/element-relations.ts` — 오행 상생/상극 관계 단일 진실 공급원

### 2. Adapters + Compose

학파별 어댑터 (`adapters/ko/`, `adapters/cn-ziping/`, `adapters/cn-mangpai/`, `adapters/jp/`) 가 각 시간축에 대해 frame 을 구성하고, `compose/` 가 4학파 fan-out + cross-check 을 수행합니다.

`resolveChartContext` 는 모든 `*FromBirth` 래퍼의 공통 진입점으로, 진태양시 보정 → 합의 검증 → 차트 + 대운까지 한 번에 해결합니다.

### 3. LLM Integration

- `prompts/` — 학파별 system prompt + 시간축별 narrative 템플릿
- `schemas/` — 시간축별 Zod 응답 스키마. LLM 분산 정규화는 `schemas/common.ts` 에 위치

## 주요 설계 결정

- **모든 계산은 동기.** `lunar-javascript` 와 `korean-lunar-calendar` 가 sync 이므로 async 를 도입하지 않음.
- **`Result<T>` 로 compose 오류 표현.** `{ ok: true, value } | { ok: false, error }`. 개별 어댑터 실패는 `safeFrame()` 으로 격리되어 한 학파가 실패해도 전체가 무너지지 않음.
- **만세력 합의 검증.** `verifyConsensus()` 가 두 라이브러리의 일주를 비교. 불일치 시 `LIBRARY_MISMATCH` 오류 반환.

## 스크립트

```bash
pnpm test         # vitest run
pnpm typecheck    # tsc --noEmit
pnpm build        # tsup → dist/
```

## 도메인 용어집

핵심 도메인 용어 정의는 [`CONTEXT.md`](./CONTEXT.md) 에 있습니다.

## License

MIT
