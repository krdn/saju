import type { NarrativeSchool } from "../narrative-types";
import type { PromptBundle } from "./system";

export type TimeAxis = "lifetime" | "yearly" | "monthly" | "daily";

interface AxisSpec {
  perspective: string;
  narrativeLength: string;
  sectionLength: string;
  exampleTerms: string;
  sectionDescs: {
    personality: string;
    career: string;
    health: string;
    daeunSummary: string;
  };
  actionSuffix: string;
  userSuffixNarrative: string;
}

const AXIS_SPECS: Record<TimeAxis, AxisSpec> = {
  lifetime: {
    perspective: "자신의 명조를 깊이 이해시키는",
    narrativeLength: "1500~2000자 (5문단)",
    sectionLength: "200~350자",
    exampleTerms: "傷官格(상관격 — 자신의 재능을 밖으로 표출하려는 기질), 怪罡(괴강 — 강한 자존심과 결단력을 가진 살)",
    sectionDescs: {
      personality: "경향성·기질 (일반론, \"당신은 ~한 사람입니다\")",
      career: "직업 장면 구체 행동 (\"회의에서 ~할 때 ~하세요\")",
      health: "건강 관리 구체 행동·계절성·식단",
      daeunSummary: "대운 흐름의 시간대별 타이밍",
    },
    actionSuffix: "상황·시간·대상을 명시",
    userSuffixNarrative: "1500~2000자 5문단",
  },
  yearly: {
    perspective: "올해 한 해의 흐름을 깊이 이해시키는",
    narrativeLength: "1200~1600자 (4~5문단)",
    sectionLength: "200~280자",
    exampleTerms: "종아격(從兒格 — 일간이 식상에 종속하는 격국), 식상생재(食傷生財 — 식상이 재성을 생하는 흐름), 세운(歲運 — 올해 한 해의 운)",
    sectionDescs: {
      personality: "올해 드러나는 기질·태도 (일반론, \"당신은 올해 ~한 태도로\")",
      career: "직업·재물 장면 구체 행동 (\"Q3 분기 회의에서 ~할 때 ~하세요\")",
      health: "건강 관리 구체 행동·계절성·식단",
      daeunSummary: "현 대운 구간이 올해에 미치는 영향과 분기별 타이밍",
    },
    actionSuffix: "상황·시간·대상을 명시",
    userSuffixNarrative: "1200~1600자 4~5문단",
  },
  monthly: {
    perspective: "이번 달 한 달의 흐름을 깊이 이해시키는",
    narrativeLength: "800~1200자 (3문단)",
    sectionLength: "150~200자",
    exampleTerms: "월운(月運 — 이번 달 한 달의 운), 응기(應期 — 사건이 일어나는 시점)",
    sectionDescs: {
      personality: "이번 달 드러나는 기질·태도",
      career: "직업·재물 장면 구체 행동 (\"이번 달 중순 회의에서 ~할 때 ~하세요\")",
      health: "건강 관리 구체 행동·계절성",
      daeunSummary: "현 대운 + 올해 세운이 이번 달에 미치는 영향과 상순·중순·하순 타이밍",
    },
    actionSuffix: "상황·시간·대상을 명시",
    userSuffixNarrative: "800~1200자 3문단",
  },
  daily: {
    perspective: "오늘 하루의 흐름을 깊이 이해시키는",
    narrativeLength: "800~1200자 (3문단)",
    sectionLength: "150~200자",
    exampleTerms: "일운(日運 — 오늘 하루의 운), 일진(日辰 — 오늘 하루의 간지)",
    sectionDescs: {
      personality: "오늘 드러나는 기질·태도",
      career: "직업·재물 장면 구체 행동 (\"오늘 오전 회의에서 ~할 때 ~하세요\")",
      health: "건강 관리 구체 행동·계절성",
      daeunSummary: "오늘 흐름 요약 — 일진 간지가 명조 + 현재 대운/세운/월운과 어떻게 호응·충돌하는지",
    },
    actionSuffix: "시간대·상황·대상을 명시",
    userSuffixNarrative: "800~1200자 3문단",
  },
};

export function buildCommonHeader(axis: TimeAxis): string {
  const s = AXIS_SPECS[axis];
  return `당신은 30년 경력의 사주 명리학 전문가입니다. 비전문가 사용자에게 ${s.perspective} 것이 목표입니다.

[작성 원칙]
1. 분량: narrativeText 전체 ${s.narrativeLength}. 각 sections 필드는 ${s.sectionLength}.
2. 용어 풀이: 한자 용어·명리 전문어가 처음 등장할 때 인라인 괄호로 풀어 설명. 예: ${s.exampleTerms}. 두 번째 등장부터는 풀이 생략.
3. 섹션별 3층 구조:
   - personality: ${s.sectionDescs.personality}
   - career: ${s.sectionDescs.career}
   - relationship: 관계 장면 구체 행동
   - health: ${s.sectionDescs.health}
   - daeunSummary: ${s.sectionDescs.daeunSummary}
4. 행동 지침은 "그래서 어떻게" 의 수준까지. 추상적 조언("균형 잡으세요") 금지. ${s.actionSuffix}.
5. citations: 인용한 고전/전적의 편명까지 명시. 최소 2개.`;
}

export function buildUserSuffix(axis: TimeAxis): string {
  const s = AXIS_SPECS[axis];
  return `위 명조를 다음 JSON 스키마로만 답하세요. 마크다운 헤더, 펜스, prose 설명, 인사말 모두 금지. '{' 로 시작해서 '}' 로 끝나는 JSON 본문만 출력:
{"narrativeText":"${s.userSuffixNarrative}","sections":{"personality":"...","career":"...","relationship":"...","health":"...","daeunSummary":"...","keyTerms":[{"term":"...","gloss":"..."}],"cautions":["..."]},"schoolSpecific":{...학파별...},"citations":["출처1","출처2"]}`;
}

export function buildSchoolPrompts(
  axis: TimeAxis,
  schoolBodies: Record<NarrativeSchool, string>,
): Record<NarrativeSchool, string> {
  const header = buildCommonHeader(axis);
  return {
    ko: `${header}\n\n${schoolBodies.ko}`,
    "cn-ziping": `${header}\n\n${schoolBodies["cn-ziping"]}`,
    "cn-mangpai": `${header}\n\n${schoolBodies["cn-mangpai"]}`,
    jp: `${header}\n\n${schoolBodies.jp}`,
  };
}

export function buildPrompt(
  axis: TimeAxis,
  schoolPrompts: Record<NarrativeSchool, string>,
  frame: unknown,
  school: NarrativeSchool,
): PromptBundle {
  const suffix = buildUserSuffix(axis);
  return {
    system: schoolPrompts[school],
    user: `명조 분석:\n${JSON.stringify(frame, null, 2)}\n\n${suffix}`,
  };
}
