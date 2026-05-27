import { describe, expect, it, vi } from "vitest";
import { resolveChartContext } from "./resolveChartContext";
import type { BirthInputResolved } from "./lifetime";

vi.mock("../consensus", { spy: true });
import * as consensusMod from "../consensus";

const canonical1967Input: BirthInputResolved = {
  birthDateLocal: "1967-03-29",
  birthTimeLocal: "05:30",
  timezone: "Asia/Seoul",
  longitudeDeg: 127,
  calendar: "solar",
  gender: "male",
};

describe("resolveChartContext", () => {
  it("정상 입력 → ok=true + chart/daeun/trueSolar 포함", () => {
    const result = resolveChartContext(canonical1967Input);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");

    expect(result.value.chart.pillars.day.stem).toBe("壬");
    expect(result.value.chart.pillars.day.branch).toBe("辰");
    expect(result.value.daeun.length).toBeGreaterThan(0);
    expect(result.value.daeun[0]?.startAge).toBe(8);
    expect(result.value.trueSolar.hourKnown).toBe(true);
    expect(result.value.trueSolar.trueSolarMinutesOffset).toBe(-32);
  });

  it("verifyConsensus ok=false → LIBRARY_MISMATCH", () => {
    vi.mocked(consensusMod.verifyConsensus).mockReturnValueOnce({
      ok: false,
      libA: { stem: "壬", branch: "辰" },
      libB: { stem: "癸", branch: "巳" },
    });

    const result = resolveChartContext(canonical1967Input);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected error");
    expect(result.error.code).toBe("LIBRARY_MISMATCH");
    expect(result.error.details).toEqual({
      libA: { stem: "壬", branch: "辰" },
      libB: { stem: "癸", branch: "巳" },
    });
  });

  it("lunar input → throw (consensus 미지원)", () => {
    expect(() =>
      resolveChartContext({ ...canonical1967Input, calendar: "lunar" }),
    ).toThrow();
  });
});
