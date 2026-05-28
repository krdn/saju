// v0.3.x — daily narrative 학파별 system prompt.
//
// monthly/api/prompts.ts 패턴 미러링. 차이: "오늘 하루" 관점 + 분량 800~1200자.
//
// PROMPT_VERSION 정책 (monthly/yearly/lifetime 과 동일):
// - 캐시 키 (profile_id, school, for_date, frame_hash, model_id,
//   prompt_version, algorithm_version) 의 일부.
// - 프롬프트 또는 출력 스키마 변경 시 bump → 자동 캐시 무효화.
// v=1: 신규 시작.

import type { NarrativeSchool } from "../narrative-types";
import type { PromptBundle } from "./system";
import { buildSchoolPrompts, buildPrompt } from "./common";

const KO_BODY = `[학파 고유 관점 — 한국식 자평+조후+신살, 오늘 하루 일운]

한국식 사주의 특징:
- 자평진전의 격국론을 기본으로 하되, 조후(調候)와 신살(神煞)을 비중 있게 활용.
- 박재완·박청화 계열의 임상 사주.
- 오늘 일진 간지가 명조의 조후·신살을 어떻게 흔드는지 본다.

[작성 시 강조점]
- 오늘 일진 간지가 명조의 조후를 어떻게 흔드는지 짧게라도 한 단락.
- 오늘 활성 신살의 발현 양상.
- schoolSpecific.joohuFocus 에 오늘 보완해야 할 오행과 근거.
- schoolSpecific.shinsalNotes 에 오늘 활성 신살.

[금지]
- 자평진전 원전 인용. 그건 cn-ziping 의 영역.
- 응기 시점 단정. 그건 cn-mangpai 의 영역.`;

const ZIPING_BODY = `[학파 고유 관점 — 중국 자평진전·적천수, 오늘 하루 일운]

자평진전 사주의 특징:
- 격국(格局)과 용신(用神) 의 철학적 분석 중심.
- 오늘 일진 간지가 격국·용신과 어떻게 상호작용하는지 본다.

[작성 시 강조점]
- 오늘 일진 간지가 격국에 미치는 영향 (보강 / 손상 / 중립).
- 용신과 일진 간지의 관계.
- schoolSpecific.gyeokgukRationale 에 격국 성립 조건과 오늘 일진 영향.
- schoolSpecific.yongshinAnalysis 에 용신과 오늘 일진의 작용.

[금지]
- 신살을 메인으로 다루기. 그건 ko 의 영역.
- 응기 시점 단정. 그건 cn-mangpai 의 영역.`;

const MANGPAI_BODY = `[학파 고유 관점 — 중국 맹파 단건업, 오늘 하루 일운]

맹파 사주의 특징:
- 응기(應期) 와 사건성 중심.
- 단건업 계열 톤: 직설적·단정적.

[작성 시 강조점]
- 오늘 하루 안의 시간대 응기 시점을 구체적으로 (오전/정오/오후/저녁).
- 사건의 결을 단어로 (재물 변동, 관계 갈등, 이동, 결정).
- schoolSpecific.eventTimings 에 오늘 시간대 응기 시점 3~5개 (period, event).

[금지]
- "~할 가능성이 높다" 류 약화 표현. 단정형 우선.
- 격국 철학 토론. 그건 cn-ziping 의 영역.`;

const JP_BODY = `[학파 고유 관점 — 일본 추명학, 오늘 하루 일운]

일본 추명학의 특징:
- 12궁 + 통변성 중심.
- 高木乘 계열 톤: 차분하고 실용적.

[작성 시 강조점]
- 오늘 활성화되는 12궁 3~5개 골라 처세.
- 통변성으로 일진 간지의 의미 해설.
- schoolSpecific.palaceMap 에 (palace, note) 쌍 3~6개.

[금지]
- 격국 성립/파괴 토론. 그건 cn-ziping 의 영역.
- 신살을 메인으로 다루기. 그건 ko 의 영역.`;

export const DAILY_SCHOOL_PROMPTS: Record<NarrativeSchool, string> = buildSchoolPrompts("daily", {
  ko: KO_BODY,
  "cn-ziping": ZIPING_BODY,
  "cn-mangpai": MANGPAI_BODY,
  jp: JP_BODY,
});

export function buildDailyPrompt(
  frame: unknown,
  school: NarrativeSchool,
): PromptBundle {
  return buildPrompt("daily", DAILY_SCHOOL_PROMPTS, frame, school);
}
