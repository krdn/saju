import type { Element } from "../hanja";
import type { ShenStrengthResult } from "./shen-strength";
import { PRODUCED_BY, roleToElement } from "./element-relations";

export interface JonggyeokYongshin {
  primary: Element;
  gisin: Element[];
  rationale: string;
}

export function buildJonggyeokYongshin(
  shen: ShenStrengthResult,
): JonggyeokYongshin | null {
  if (!shen.jonggyeokKind || !shen.jonggyeokRole) return null;

  const primary = roleToElement(shen.dayElement, shen.jonggyeokRole);
  const insungEl = PRODUCED_BY[shen.dayElement];
  const gisin = [shen.dayElement, insungEl];

  const verdictKor =
    shen.verdict === "종아" ? "종아격" :
    shen.verdict === "종재" ? "종재격" : "종살격";

  const r = shen.roleCountExtended;
  const rationale = `인성 ${r.인성}·비겁 ${r.비겁} 약함, ${shen.jonggyeokRole} ${r[shen.jonggyeokRole]} 우세 — ${shen.jonggyeokKind} ${verdictKor}으로 ${shen.jonggyeokRole}의 흐름을 따른다`;

  return { primary, gisin, rationale };
}
