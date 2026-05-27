// v0.3.x — daily LLM 출력 zod 스키마.
//
// monthly/schemas.ts 1:1 미러. 차이 없음 — 분량 가이드(800~1200자)는
// prompts.ts 가 자연어로 유도하고, schema 의 narrativeText min/max 는 monthly와 동일.
//
// SchoolSpecific 4학파 union 은 lifetime/monthly/yearly 와 동일 재사용.
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

// daily sectionsSchema 는 monthly 와 동일 수치.
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

export const DAILY_SCHOOL_SCHEMAS = {
  ko: koSchema,
  "cn-ziping": zipingSchema,
  "cn-mangpai": mangpaiSchema,
  jp: jpSchema,
} satisfies Record<NarrativeSchool, z.ZodType>;

export type DailyNarrativeOutput = {
  narrativeText: string;
  sections: MonthlyNarrativeSections;
  schoolSpecific: SchoolSpecific;
  citations: string[];
};
