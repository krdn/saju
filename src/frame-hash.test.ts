import { describe, it, expect } from "vitest";
import { computeFrameHash } from "./frame-hash";

describe("computeFrameHash", () => {
  it("returns 64-char hex string", () => {
    const frame = { school: "ko", pillars: { year: "甲子" } };
    const hash = computeFrameHash(frame);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is deterministic", () => {
    const frame = { a: 1, b: "test" };
    expect(computeFrameHash(frame)).toBe(computeFrameHash(frame));
  });

  it("differs for different input", () => {
    expect(computeFrameHash({ a: 1 })).not.toBe(computeFrameHash({ a: 2 }));
  });
});
