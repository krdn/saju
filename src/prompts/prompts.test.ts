import { describe, expect, it } from "vitest";
import { LIFETIME_SCHOOL_PROMPTS, buildLifetimePrompt } from "./lifetime";
import { YEARLY_SCHOOL_PROMPTS, buildYearlyPrompt } from "./yearly";
import { MONTHLY_SCHOOL_PROMPTS, buildMonthlyPrompt } from "./monthly";
import { DAILY_SCHOOL_PROMPTS, buildDailyPrompt } from "./daily";
import type { NarrativeSchool } from "../narrative-types";

const SCHOOLS: NarrativeSchool[] = ["ko", "cn-ziping", "cn-mangpai", "jp"];
const DUMMY_FRAME = { test: true };

describe("SCHOOL_PROMPTS snapshot", () => {
  for (const school of SCHOOLS) {
    it(`lifetime/${school}`, () => {
      expect(LIFETIME_SCHOOL_PROMPTS[school]).toMatchSnapshot();
    });
    it(`yearly/${school}`, () => {
      expect(YEARLY_SCHOOL_PROMPTS[school]).toMatchSnapshot();
    });
    it(`monthly/${school}`, () => {
      expect(MONTHLY_SCHOOL_PROMPTS[school]).toMatchSnapshot();
    });
    it(`daily/${school}`, () => {
      expect(DAILY_SCHOOL_PROMPTS[school]).toMatchSnapshot();
    });
  }
});

describe("buildPrompt snapshot", () => {
  for (const school of SCHOOLS) {
    it(`buildLifetimePrompt/${school}`, () => {
      expect(buildLifetimePrompt(DUMMY_FRAME, school)).toMatchSnapshot();
    });
    it(`buildYearlyPrompt/${school}`, () => {
      expect(buildYearlyPrompt(DUMMY_FRAME, school)).toMatchSnapshot();
    });
    it(`buildMonthlyPrompt/${school}`, () => {
      expect(buildMonthlyPrompt(DUMMY_FRAME, school)).toMatchSnapshot();
    });
    it(`buildDailyPrompt/${school}`, () => {
      expect(buildDailyPrompt(DUMMY_FRAME, school)).toMatchSnapshot();
    });
  }
});
