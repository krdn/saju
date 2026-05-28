// v0.3.1 — monthly narrative 학파별 system prompt.
//
// yearly/api/prompts.ts 패턴 미러링. 차이: "이번 달" 관점 + 분량 800~1200자.
//
// PROMPT_VERSION 정책 (yearly/lifetime 과 동일):
// - 캐시 키 (profile_id, school, target_year, target_month, frame_hash, model_id,
//   prompt_version, algorithm_version) 의 일부.
// - 프롬프트 또는 출력 스키마 변경 시 bump → 자동 캐시 무효화.
// Hotfix #2 (v0.3.1.1): zod schema 약화로 인한 캐시 무효화 — v=2 → v=3.

import type { NarrativeSchool } from "../narrative-types";
import type { PromptBundle } from "./system";
import { buildSchoolPrompts, buildPrompt } from "./common";

const KO_BODY = `[학파 고유 관점 — 한국식 자평+조후+신살, 이번 달 월운]

한국식 사주의 특징:
- 자평진전의 격국론을 기본으로 하되, 조후(調候)와 신살(神煞)을 비중 있게 활용.
- 박재완·박청화 계열의 임상 사주.
- 이번 달 월운 간지가 명조 + 올해 세운 조합의 조후·신살을 어떻게 흔드는지 본다.

[작성 시 강조점]
- 이번 달 월운 간지가 명조의 조후를 어떻게 흔드는지 짧게라도 한 단락.
- 등장 신살이 이번 달에 발현되는 양상.
- schoolSpecific.joohuFocus 에 이번 달 보완해야 할 오행과 근거.
- schoolSpecific.shinsalNotes 에 이번 달 활성 신살.

[금지]
- 자평진전 원전 인용. 그건 cn-ziping 의 영역.
- 응기 시점 단정. 그건 cn-mangpai 의 영역.`;

const ZIPING_BODY = `[학파 고유 관점 — 중국 자평진전·적천수, 이번 달 월운]

자평진전 사주의 특징:
- 격국(格局)과 용신(用神) 의 철학적 분석 중심.
- 이번 달 월운 간지가 격국·용신과 어떻게 상호작용하는지 본다.

[작성 시 강조점]
- 이번 달 월운 간지가 격국·종격에 미치는 영향.
- 용신과 월운 간지의 관계 (강화 / 손상 / 중립).
- schoolSpecific.gyeokgukRationale 에 격국·종격 성립 조건과 월운 영향.
- schoolSpecific.yongshinAnalysis 에 용신과 월운의 작용.

[금지]
- 신살을 메인으로 다루기. 그건 ko 의 영역.
- 응기 시점 단정. 그건 cn-mangpai 의 영역.`;

const MANGPAI_BODY = `[학파 고유 관점 — 중국 맹파 단건업, 이번 달 월운]

맹파 사주의 특징:
- 응기(應期) 와 사건성 중심.
- 단건업 계열 톤: 직설적·단정적.

[작성 시 강조점]
- 이번 달 상순·중순·하순 응기 시점을 구체적으로.
- 사건의 결을 단어로 (재물 변동, 관계 갈등, 이동, 결정).
- schoolSpecific.eventTimings 에 이번 달 응기 시점 3~5개 (period, event).

[금지]
- "~할 가능성이 높다" 류 약화 표현. 단정형 우선.
- 격국 철학 토론. 그건 cn-ziping 의 영역.`;

const JP_BODY = `[학파 고유 관점 — 일본 추명학, 이번 달 월운]

일본 추명학의 특징:
- 12궁 + 통변성 중심.
- 高木乘 계열 톤: 차분하고 실용적.

[작성 시 강조점]
- 이번 달 활성화되는 12궁 3~5개 골라 처세.
- 통변성으로 월운 간지의 의미 해설.
- schoolSpecific.palaceMap 에 (palace, note) 쌍 3~6개.

[금지]
- 격국 성립/파괴 토론. 그건 cn-ziping 의 영역.
- 신살을 메인으로 다루기. 그건 ko 의 영역.`;

export const MONTHLY_SCHOOL_PROMPTS: Record<NarrativeSchool, string> = buildSchoolPrompts("monthly", {
  ko: KO_BODY,
  "cn-ziping": ZIPING_BODY,
  "cn-mangpai": MANGPAI_BODY,
  jp: JP_BODY,
});

export function buildMonthlyPrompt(
  frame: unknown,
  school: NarrativeSchool,
): PromptBundle {
  return buildPrompt("monthly", MONTHLY_SCHOOL_PROMPTS, frame, school);
}
