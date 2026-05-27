// v0.3.1 — monthly LLM 출력 zod 스키마.
//
// yearly/schemas.ts 미러링. 차이:
//  - narrativeText min 200 (yearly 300)
//  - sections.* min 30 (yearly 50)
//  - keyTerms max 6 (yearly max 8)
//  - eventTimings max 5 (yearly max 6)
//  - palaceMap 3~6 (yearly 5~8)
//
// SchoolSpecificKo/Ziping/Mangpai/Jp 는 lifetime 과 동일 union 재사용.
import { z } from "zod";
import type {
  NarrativeSchool,
  MonthlyNarrativeSections,
  SchoolSpecific,
  SchoolSpecificKo,
  SchoolSpecificZiping,
  SchoolSpecificMangpai,
  SchoolSpecificJp,
} from "../narrative-types";
import { normalizeStringArray, normalizeEventTiming } from "./common";

// Hotfix #2 (v0.3.1.1): yearly 와 같은 방향으로 약화 — LLM variance 흡수.
// Hotfix #5 (v0.3.2.1): Gemini 가 keyTerms/cautions 빠뜨리는 경우 optional() 약화.
const sectionsSchema = z.object({
  personality: z.string().min(30),
  career: z.string().min(30),
  relationship: z.string().min(30),
  health: z.string().min(30),
  daeunSummary: z.string().min(30),
  keyTerms: z
    .array(
      z.object({
        term: z.string().min(1),
        gloss: z.string().min(1),
      }),
    )
    .max(6)
    .optional()
    .default([]),
  cautions: z.preprocess(
    (v) => (Array.isArray(v) && v.length > 5 ? v.slice(0, 5) : v),
    z.array(z.string().min(1)).max(5).optional().default([]),
  ),
}) satisfies z.ZodType<MonthlyNarrativeSections, z.ZodTypeDef, unknown>;

const baseOutputSchema = z.object({
  narrativeText: z.string().min(200).max(1500),
  sections: sectionsSchema,
  citations: z.array(z.string().min(1)).min(1),
});

// Hotfix #4 (v0.3.1.2): LLM 이 array 대신 string 으로 응답하는 경우 자동 wrap.
// preprocess input 이 unknown 이므로 satisfies generic 도 unknown.
const koSpecificSchema = z.object({
  joohuFocus: z.string().min(20),
  shinsalNotes: z.preprocess(normalizeStringArray, z.array(z.string().min(1)).min(1)),
}) satisfies z.ZodType<SchoolSpecificKo, z.ZodTypeDef, unknown>;

const zipingSpecificSchema = z.object({
  gyeokgukRationale: z.string().min(30),
  yongshinAnalysis: z.string().min(30),
}) satisfies z.ZodType<SchoolSpecificZiping>;

const mangpaiSpecificSchema = z.object({
  eventTimings: z
    .array(
      z.preprocess(
        normalizeEventTiming,
        z.object({
          period: z.string().min(1),
          event: z.string().min(1),
        }),
      ),
    )
    .min(3)
    .max(5),
}) satisfies z.ZodType<SchoolSpecificMangpai, z.ZodTypeDef, unknown>;

const jpSpecificSchema = z.object({
  palaceMap: z
    .array(
      z.object({
        palace: z.string().min(1),
        note: z.string().min(1),
      }),
    )
    .min(3)
    .max(6),
}) satisfies z.ZodType<SchoolSpecificJp>;

const koSchema = baseOutputSchema.extend({ schoolSpecific: koSpecificSchema });
const zipingSchema = baseOutputSchema.extend({
  schoolSpecific: zipingSpecificSchema,
});
const mangpaiSchema = baseOutputSchema.extend({
  schoolSpecific: mangpaiSpecificSchema,
});
const jpSchema = baseOutputSchema.extend({ schoolSpecific: jpSpecificSchema });

export const MONTHLY_SCHOOL_SCHEMAS = {
  ko: koSchema,
  "cn-ziping": zipingSchema,
  "cn-mangpai": mangpaiSchema,
  jp: jpSchema,
} satisfies Record<NarrativeSchool, z.ZodType>;

export type MonthlyNarrativeOutput = {
  narrativeText: string;
  sections: MonthlyNarrativeSections;
  schoolSpecific: SchoolSpecific;
  citations: string[];
};
