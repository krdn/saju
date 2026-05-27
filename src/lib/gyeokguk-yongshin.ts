import type { SajuChart } from "../types";
import type { Element } from "../hanja";
import { STEM_ELEMENT } from "../hanja";
import type { ShenStrengthResult, Role } from "./shen-strength";
import { roleToElement } from "./element-relations";

export type GyeokgukPattern =
  | "傷官生財" | "傷官佩印"
  | "官印相生" | "財官相生"
  | "比劫制財" | "食傷生財"
  | "食神制偏印" | "印比相生"
  | "기타";

export interface GyeokgukYongshin {
  primary: Element;
  gisin: Element[];
  pattern: GyeokgukPattern;
  rationale: string;
}

interface RuleEntry {
  primary: Role;
  gisin: Role[];
  pattern: GyeokgukPattern;
  rationale: string;
}

const GYEOKGUK_RULES: Record<string, Record<"신강" | "신약", RuleEntry>> = {
  "傷官格": {
    "신강": { primary: "재성", gisin: ["인성", "비겁"], pattern: "傷官生財", rationale: "신강 상관격 — 재성으로 상관을 흘려 보냄" },
    "신약": { primary: "인성", gisin: ["식상", "재성"], pattern: "傷官佩印", rationale: "신약 상관격 — 인성으로 상관을 제어" },
  },
  "正官格": {
    "신강": { primary: "재성", gisin: ["비겁"], pattern: "財官相生", rationale: "신강 정관격 — 재성이 관성을 생함" },
    "신약": { primary: "인성", gisin: ["재성", "식상"], pattern: "官印相生", rationale: "신약 정관격 — 관성이 인성을 생함" },
  },
  "財格": {
    "신강": { primary: "식상", gisin: ["인성", "비겁"], pattern: "食傷生財", rationale: "신강 재성격 — 식상이 재성을 생함" },
    "신약": { primary: "비겁", gisin: ["재성", "관성"], pattern: "比劫制財", rationale: "신약 재성격 — 비겁으로 재성을 다스림" },
  },
  "偏印格": {
    "신강": { primary: "식상", gisin: ["인성", "비겁"], pattern: "食神制偏印", rationale: "신강 편인격 — 식신으로 편인을 제어" },
    "신약": { primary: "비겁", gisin: ["재성", "식상"], pattern: "印比相生", rationale: "신약 편인격 — 인성과 비겁이 상생" },
  },
};

export function buildGyeokgukYongshin(
  chart: SajuChart,
  shen: ShenStrengthResult,
  gyeokguk: string,
): GyeokgukYongshin | null {
  if (shen.jonggyeokKind) return null;
  if (shen.verdict !== "신강" && shen.verdict !== "신약") return null;

  const rules = GYEOKGUK_RULES[gyeokguk];
  if (!rules) return null;

  const dayEl = STEM_ELEMENT[chart.pillars.day.stem];
  const entry = rules[shen.verdict];

  return {
    primary: roleToElement(dayEl, entry.primary),
    gisin: entry.gisin.map((r) => roleToElement(dayEl, r)),
    pattern: entry.pattern,
    rationale: entry.rationale,
  };
}
