import { describe, it, expect } from "vitest";
import { LIFETIME_SCHOOL_SCHEMAS } from "./lifetime";

describe("LIFETIME_SCHOOL_SCHEMAS", () => {
  const validKoOutput = {
    narrativeText: "A".repeat(500),
    sections: {
      personality: "A".repeat(80),
      career: "A".repeat(80),
      relationship: "A".repeat(80),
      health: "A".repeat(80),
      daeunSummary: "A".repeat(80),
    },
    schoolSpecific: { joohuFocus: "A".repeat(30), shinsalNotes: ["note1"] },
    citations: ["citation1"],
  };

  it("parses valid ko output", () => {
    const result = LIFETIME_SCHOOL_SCHEMAS.ko.safeParse(validKoOutput);
    expect(result.success).toBe(true);
  });

  it("rejects too-short narrativeText", () => {
    const result = LIFETIME_SCHOOL_SCHEMAS.ko.safeParse({
      ...validKoOutput,
      narrativeText: "short",
    });
    expect(result.success).toBe(false);
  });

  it("normalizes string shinsalNotes to array", () => {
    const input = {
      ...validKoOutput,
      schoolSpecific: { joohuFocus: "A".repeat(30), shinsalNotes: "괴강, 도화" },
    };
    const result = LIFETIME_SCHOOL_SCHEMAS.ko.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(Array.isArray(result.data.schoolSpecific.shinsalNotes)).toBe(true);
    }
  });
});
