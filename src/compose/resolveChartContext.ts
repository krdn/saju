import { resolveTrueSolar } from "../time/trueSolar";
import type { ResolvedMoment } from "../time/trueSolar";
import { verifyConsensus } from "../consensus";
import { computeSajuChart } from "../computeSajuChart";
import { computeMajorFortunes } from "../majorFortune";
import type { SajuChart, MajorFortune } from "../types";
import type { Result, SajuError } from "../core/extendedTypes";
import type { BirthInputResolved } from "./lifetime";

export interface ChartContext {
  chart: SajuChart;
  daeun: MajorFortune[];
  trueSolar: ResolvedMoment;
}

/**
 * 출생 정보 → 검증된 차트 컨텍스트.
 *
 * 4개 시간축(lifetime/yearly/monthly/daily) FromBirth wrapper 가 공유하는
 * 파이프라인: resolveTrueSolar → verifyConsensus → computeSajuChart + computeMajorFortunes.
 * 만세력 라이브러리 불일치 시 LIBRARY_MISMATCH Result.error 반환.
 */
export function resolveChartContext(input: BirthInputResolved): Result<ChartContext> {
  const trueSolar = resolveTrueSolar(input);

  const consensus = verifyConsensus({
    birthDateLocal: input.birthDateLocal,
    calendar: input.calendar,
  });
  if (!consensus.ok) {
    const error: SajuError = {
      code: "LIBRARY_MISMATCH",
      message: "만세력 라이브러리 결과 불일치",
      details: { libA: consensus.libA, libB: consensus.libB },
    };
    return { ok: false, error };
  }

  const chart = computeSajuChart({
    birthDate: input.birthDateLocal,
    birthTime: input.birthTimeLocal,
    calendar: input.calendar,
    gender: input.gender,
    birthCity: null,
  });
  const daeun = computeMajorFortunes({
    birthDate: input.birthDateLocal,
    birthTime: input.birthTimeLocal,
    calendar: input.calendar,
    gender: input.gender,
  });

  return { ok: true, value: { chart, daeun, trueSolar } };
}
