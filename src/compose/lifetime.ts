import { computeShensha } from "../core/shensha";
import { computeInteractions } from "../core/interactions";
import { buildLifetimeKo } from "../adapters/ko/lifetime";
import { buildLifetimeCnZiping } from "../adapters/cn-ziping/lifetime";
import { buildLifetimeCnMangpai } from "../adapters/cn-mangpai/lifetime";
import { buildLifetimeJp } from "../adapters/jp/lifetime";
import { STEMS } from "../hanja";
import type { Stem } from "../hanja";
import type { MajorFortune } from "../types";
import type {
  Conflict,
  ExtendedChart,
  LifetimeFrame,
  Result,
  School,
  TriNationLifetime,
  TrueSolarMeta,
} from "../core/extendedTypes";
import { resolveChartContext } from "./resolveChartContext";

/** buildTriNationLifetime 입력 — 출생 정보 + 성별. */
export interface BirthInputResolved {
  birthDateLocal: string;
  birthTimeLocal: string;
  timezone: string;
  longitudeDeg: number;
  calendar: "solar" | "lunar";
  gender: "male" | "female";
}

/**
 * 양간(陽干): 甲丙戊庚壬 (index 짝수), 음간(陰干): 乙丁己辛癸 (index 홀수).
 *
 * 명리학 규칙:
 * - 양간 + 男 → 순행(forward)
 * - 양간 + 女 → 역행(backward)
 * - 음간 + 男 → 역행(backward)
 * - 음간 + 女 → 순행(forward)
 */
export function deriveDaeunDirection(yearStem: Stem, gender: "male" | "female"): "forward" | "backward" {
  const stemIndex = STEMS.indexOf(yearStem);
  const isYang = stemIndex % 2 === 0;
  const forwardConditions = (isYang && gender === "male") || (!isYang && gender === "female");
  return forwardConditions ? "forward" : "backward";
}

function safeFrame(fn: () => LifetimeFrame, school: School): LifetimeFrame {
  try {
    return fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      school,
      pillarsAnnotated: [],
      formatGyeokguk: { name: "분석 실패", reasoning: message },
      yongshin: undefined,
      daeunHighlights: [],
      careerHints: [],
      relationshipHints: [],
      healthHints: [],
      cautions: ["이 학파 분석에 실패했습니다."],
      schoolSpecific: { error: message },
    };
  }
}

/**
 * Phase 5 compose — 4 학파 어댑터 통합 + 만세력 합의 검증 + crossCheck.
 *
 * 입력은 `BirthInputResolved`(생일/생시/타임존/경도/달력/성별). 출력은 `Result<TriNationLifetime>`
 * — 만세력 라이브러리 불일치 시 `error.code = "LIBRARY_MISMATCH"`. 그 외 어댑터별 예외는
 * `safe()` 폴백으로 흡수해 4 frame 항상 노출 (single-school failure 가 전체 응답을 막지 않음).
 *
 * 설계 결정:
 * - **sync 함수**: 하부 모듈(resolveTrueSolar/verifyConsensus/computeSajuChart/어댑터 4종) 모두
 *   sync. async 래핑은 불필요 — KISS.
 * - **`TriNationLifetime.chart` = `ExtendedChart` 4 필드만**: plan 의 chart spread 패턴은
 *   typed contract 위배. shensha/interactions/trueSolarMinutesOffset/hourAmbiguity 만 구성.
 *   Phase 6 API serialization 단계에서 raw chart(pillars/elements/...) 노출 필요 시 별도 필드 추가.
 * - **daeun.direction**: `computeMajorFortunes` 가 direction 을 반환하지 않으므로 연간 stem 양음
 *   + 성별로 derive (`daeun/extended.test.ts` 의 "음년(丁未) 男 → 역행" 규칙 일치).
 * - **yongshinConflicts**: v0.1 의 4 어댑터 모두 `yongshin: undefined` (3개 학파는 미구현,
 *   jp 학파는 본래 미사용) → trivial 빈 배열. Phase 6+ 어댑터 본격 구현 시 실 비교 필요.
 * - **pillarsAgree**: v0.1 의 4 어댑터 모두 `pillarsAnnotated: []` (미구현) → trivial true.
 *   Phase 6+ 어댑터 본격 구현 시 실 비교 필요.
 *
 * @throws verifyConsensus 내부에서 throw 발생 가능 (예: lunar calendar 입력 처리 중). LIBRARY_MISMATCH는 throw 가 아닌 Result.error로 반환된다.
 */
export function buildTriNationLifetime(input: BirthInputResolved): Result<TriNationLifetime> {
  const ctx = resolveChartContext(input);
  if (!ctx.ok) return ctx;

  const { chart, daeun: daeunRaw, trueSolar } = ctx.value;

  // 신살 + 합충형
  const shensha = computeShensha(chart.pillars);
  const interactions = computeInteractions(chart.pillars);

  const extendedChart: ExtendedChart = {
    shensha,
    interactions,
    trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset,
    ...(trueSolar.ambiguityWindow
      ? {
          hourAmbiguity: {
            boundaryHour: trueSolar.ambiguityWindow.boundaryHour,
            candidateBranches: trueSolar.ambiguityWindow.candidateBranches,
          },
        }
      : {}),
  };

  const direction = deriveDaeunDirection(chart.pillars.year.stem, input.gender);
  const daeun: TriNationLifetime["daeun"] = {
    startAge: daeunRaw[0]?.startAge ?? 0,
    direction,
  };

  const ctxShared: Readonly<{ daeun: MajorFortune[]; trueSolar: TrueSolarMeta }> = {
    daeun: daeunRaw,
    trueSolar: { trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset, hourKnown: trueSolar.hourKnown },
  };
  const frames = {
    ko: safeFrame(() => buildLifetimeKo(chart, ctxShared), "ko"),
    cnZiping: safeFrame(() => buildLifetimeCnZiping(chart, ctxShared), "cn-ziping"),
    cnMangpai: safeFrame(() => buildLifetimeCnMangpai(chart, ctxShared), "cn-mangpai"),
    jp: safeFrame(() => buildLifetimeJp(chart, ctxShared), "jp"),
  };

  const gyeokgukSchools: Partial<Record<School, string>> = {
    ko: frames.ko.formatGyeokguk.name,
    "cn-ziping": frames.cnZiping.formatGyeokguk.name,
    "cn-mangpai": frames.cnMangpai.formatGyeokguk.name,
    jp: frames.jp.formatGyeokguk.name,
  };
  const gyeokgukConsensus = new Set(Object.values(gyeokgukSchools)).size === 1;

  const yongshinConflicts: Conflict[] = [];

  return {
    ok: true,
    value: {
      chart: extendedChart,
      rawChart: chart,
      daeun,
      trueSolar: {
        trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset,
        hourKnown: trueSolar.hourKnown,
      },
      frames,
      crossCheck: {
        pillarsAgree: true,
        gyeokgukConsensus: { consensus: gyeokgukConsensus, schools: gyeokgukSchools },
        yongshinConflicts,
      },
    },
  };
}
