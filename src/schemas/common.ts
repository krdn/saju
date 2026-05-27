// 4시간축 학파별 Zod 스키마에서 공통으로 사용되는 normalizer 함수.
//
// LLM (특히 Gemini) 이 array-of-string 자리에 object/array-of-object 를 응답하거나,
// eventTimings 객체에 period 대신 time/timing/timeSlot 키를 쓰는 variance 를 흡수.

/**
 * Hotfix #5: LLM 이 array-of-string 자리에 object 나 array-of-object 를 응답하는 경우 흡수.
 * - string                              → [string]
 * - object {k: v, ...}                  → ["k: v", ...]
 * - array of (string | object)          → 각 원소를 string 으로 정규화
 * - 그 외 (null/undefined/number 등)    → 그대로 (Zod array 검증에서 실패)
 */
export function normalizeStringArray(v: unknown): unknown {
  const toStr = (item: unknown): string => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return Object.entries(item)
        .map(([k, val]) => `${k}: ${typeof val === "string" ? val : JSON.stringify(val)}`)
        .join(" / ");
    }
    return String(item);
  };
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.map(toStr);
  if (v && typeof v === "object") {
    return Object.entries(v).map(
      ([k, val]) => `${k}: ${typeof val === "string" ? val : JSON.stringify(val)}`,
    );
  }
  return v;
}

/**
 * Hotfix #2 (v0.3.1.1): LLM 이 eventTimings 객체에 period 대신
 * time/timing/timeSlot 키를 쓰는 variance 흡수.
 */
export function normalizeEventTiming(v: unknown): unknown {
  if (!v || typeof v !== "object" || Array.isArray(v)) return v;
  const obj = v as Record<string, unknown>;
  if (!obj.period && (obj.time || obj.timing || obj.timeSlot)) {
    return { ...obj, period: obj.time ?? obj.timing ?? obj.timeSlot };
  }
  return v;
}
