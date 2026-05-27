import type { SajuChart, MajorFortune } from "../types";
import type { TriNationMonthly } from "../types/monthly";
import type { Result } from "../core/extendedTypes";
import { buildYongshinKo } from "../adapters/ko/yongshin";
import { buildMonthlyKo } from "../adapters/ko/monthly";
import { buildYongshinCnZiping } from "../adapters/cn-ziping/yongshin";
import { buildMonthlyCnZiping } from "../adapters/cn-ziping/monthly";
import { buildYongshinCnMangpai } from "../adapters/cn-mangpai/yongshin";
import { buildMonthlyCnMangpai } from "../adapters/cn-mangpai/monthly";
import { buildYongshinJp } from "../adapters/jp/yongshin";
import { buildMonthlyJp } from "../adapters/jp/monthly";
import type { BirthInputResolved } from "./lifetime";
import { resolveChartContext } from "./resolveChartContext";

function evaluateAgreement(frames: TriNationMonthly["frames"]): {
  agreement: "high" | "medium" | "low";
  notes: string[];
} {
  // yearly evaluateAgreement 와 동일 로직 — 결정형 학파 3개의 netVerdict 합의.
  const verdicts = [
    frames.ko.yongShinDelta.netVerdict,
    frames.cnZiping.yongShinDelta.netVerdict,
    frames.cnMangpai.yongShinDelta.netVerdict,
  ];
  const favorableCount = verdicts.filter((v) => v === "favorable").length;
  const unfavorableCount = verdicts.filter((v) => v === "unfavorable").length;

  const notes: string[] = [];
  if (favorableCount === 3) {
    notes.push("KO·CN자평·CN맹파 3학파가 favorable 합의");
    return { agreement: "high", notes };
  }
  if (unfavorableCount === 3) {
    notes.push("KO·CN자평·CN맹파 3학파가 unfavorable 합의");
    return { agreement: "high", notes };
  }
  if (favorableCount === 2 || unfavorableCount === 2) {
    notes.push(`3학파 중 2학파 동의 (favorable=${favorableCount}, unfavorable=${unfavorableCount})`);
    return { agreement: "medium", notes };
  }
  notes.push("학파별 판단 분기 — LLM narrative 로 학파별 입장 확인 권장");
  return { agreement: "low", notes };
}

export function buildTriNationMonthly(args: {
  chart: SajuChart;
  daeun: MajorFortune[];
  targetYear: number;
  targetMonth: number;
  currentAge: number;
}): TriNationMonthly {
  const { chart, daeun, targetYear, targetMonth, currentAge } = args;

  const yongKo = buildYongshinKo(chart);
  const yongCz = buildYongshinCnZiping(chart);
  const yongCm = buildYongshinCnMangpai(chart);
  const yongJp = buildYongshinJp(chart);

  const frames: TriNationMonthly["frames"] = {
    ko: buildMonthlyKo({ chart, daeun, targetYear, targetMonth, yongShin: yongKo, currentAge }),
    cnZiping: buildMonthlyCnZiping({ chart, daeun, targetYear, targetMonth, yongShin: yongCz, currentAge }),
    cnMangpai: buildMonthlyCnMangpai({ chart, daeun, targetYear, targetMonth, yongShin: yongCm, currentAge }),
    jp: buildMonthlyJp({ chart, daeun, targetYear, targetMonth, yongShin: yongJp, currentAge }),
  };

  return {
    targetYear,
    targetMonth,
    frames,
    crossCheck: evaluateAgreement(frames),
  };
}

export function buildTriNationMonthlyFromBirth(args: {
  input: BirthInputResolved;
  targetYear: number;
  targetMonth: number;
  currentAge: number;
}): Result<TriNationMonthly> {
  const ctx = resolveChartContext(args.input);
  if (!ctx.ok) return ctx;

  return {
    ok: true,
    value: buildTriNationMonthly({
      chart: ctx.value.chart,
      daeun: ctx.value.daeun,
      targetYear: args.targetYear,
      targetMonth: args.targetMonth,
      currentAge: args.currentAge,
    }),
  };
}
