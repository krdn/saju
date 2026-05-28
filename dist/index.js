// src/pillars.ts
import { Solar, Lunar } from "lunar-javascript";
function computePillars(input) {
  const [y, m, d] = input.birthDate.split("-").map(Number);
  const [hh, mm] = (input.birthTime ?? "12:00").split(":").map(Number);
  const solar = input.calendar === "solar" ? Solar.fromYmdHms(y, m, d, hh, mm, 0) : Lunar.fromYmdHms(y, m, d, hh, mm, 0).getSolar();
  const eightChar = solar.getLunar().getEightChar();
  return {
    year: { stem: eightChar.getYearGan(), branch: eightChar.getYearZhi() },
    month: { stem: eightChar.getMonthGan(), branch: eightChar.getMonthZhi() },
    day: { stem: eightChar.getDayGan(), branch: eightChar.getDayZhi() },
    hour: input.birthTime ? { stem: eightChar.getTimeGan(), branch: eightChar.getTimeZhi() } : null
  };
}

// src/hanja.ts
var STEMS = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"];
var BRANCHES = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
var STEM_KO = {
  \u7532: "\uAC11",
  \u4E59: "\uC744",
  \u4E19: "\uBCD1",
  \u4E01: "\uC815",
  \u620A: "\uBB34",
  \u5DF1: "\uAE30",
  \u5E9A: "\uACBD",
  \u8F9B: "\uC2E0",
  \u58EC: "\uC784",
  \u7678: "\uACC4"
};
var BRANCH_KO = {
  \u5B50: "\uC790",
  \u4E11: "\uCD95",
  \u5BC5: "\uC778",
  \u536F: "\uBB18",
  \u8FB0: "\uC9C4",
  \u5DF3: "\uC0AC",
  \u5348: "\uC624",
  \u672A: "\uBBF8",
  \u7533: "\uC2E0",
  \u9149: "\uC720",
  \u620C: "\uC220",
  \u4EA5: "\uD574"
};
var ELEMENT_KO = {
  wood: "\uBAA9(\u6728)",
  fire: "\uD654(\u706B)",
  earth: "\uD1A0(\u571F)",
  metal: "\uAE08(\u91D1)",
  water: "\uC218(\u6C34)"
};
var ELEMENT_HANJA = {
  wood: "\u6728",
  fire: "\u706B",
  earth: "\u571F",
  metal: "\u91D1",
  water: "\u6C34"
};
var STEM_ELEMENT = {
  \u7532: "wood",
  \u4E59: "wood",
  \u4E19: "fire",
  \u4E01: "fire",
  \u620A: "earth",
  \u5DF1: "earth",
  \u5E9A: "metal",
  \u8F9B: "metal",
  \u58EC: "water",
  \u7678: "water"
};
var STEM_YIN_YANG = {
  \u7532: "yang",
  \u4E59: "yin",
  \u4E19: "yang",
  \u4E01: "yin",
  \u620A: "yang",
  \u5DF1: "yin",
  \u5E9A: "yang",
  \u8F9B: "yin",
  \u58EC: "yang",
  \u7678: "yin"
};
var BRANCH_ELEMENT = {
  \u5B50: "water",
  \u4E11: "earth",
  \u5BC5: "wood",
  \u536F: "wood",
  \u8FB0: "earth",
  \u5DF3: "fire",
  \u5348: "fire",
  \u672A: "earth",
  \u7533: "metal",
  \u9149: "metal",
  \u620C: "earth",
  \u4EA5: "water"
};
var BRANCH_MAIN_STEM = {
  \u5B50: "\u7678",
  \u4E11: "\u5DF1",
  \u5BC5: "\u7532",
  \u536F: "\u4E59",
  \u8FB0: "\u620A",
  \u5DF3: "\u4E19",
  \u5348: "\u4E01",
  \u672A: "\u5DF1",
  \u7533: "\u5E9A",
  \u9149: "\u8F9B",
  \u620C: "\u620A",
  \u4EA5: "\u58EC"
};
var TEN_GOD_KO = {
  \u6BD4\u80A9: "\uBE44\uACAC",
  \u52AB\u8CA1: "\uAC81\uC7AC",
  \u98DF\u795E: "\uC2DD\uC2E0",
  \u50B7\u5B98: "\uC0C1\uAD00",
  \u504F\u8CA1: "\uD3B8\uC7AC",
  \u6B63\u8CA1: "\uC815\uC7AC",
  \u504F\u5B98: "\uD3B8\uAD00",
  \u6B63\u5B98: "\uC815\uAD00",
  \u504F\u5370: "\uD3B8\uC778",
  \u6B63\u5370: "\uC815\uC778"
};

// src/tenGods.ts
var ELEMENT_GEN_NEXT = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};
var ELEMENT_CTRL_NEXT = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood"
};
function tenGodOfStem(dayStem, other) {
  const dayEl = STEM_ELEMENT[dayStem];
  const dayYy = STEM_YIN_YANG[dayStem];
  const otherEl = STEM_ELEMENT[other];
  const otherYy = STEM_YIN_YANG[other];
  const sameYy = dayYy === otherYy;
  if (otherEl === dayEl) return sameYy ? "\u6BD4\u80A9" : "\u52AB\u8CA1";
  if (otherEl === ELEMENT_GEN_NEXT[dayEl]) return sameYy ? "\u98DF\u795E" : "\u50B7\u5B98";
  if (otherEl === ELEMENT_CTRL_NEXT[dayEl]) return sameYy ? "\u504F\u8CA1" : "\u6B63\u8CA1";
  if (ELEMENT_CTRL_NEXT[otherEl] === dayEl) return sameYy ? "\u504F\u5B98" : "\u6B63\u5B98";
  if (ELEMENT_GEN_NEXT[otherEl] === dayEl) return sameYy ? "\u504F\u5370" : "\u6B63\u5370";
  throw new Error(`tenGodOfStem: unreachable for ${dayStem} vs ${other}`);
}
function tenGodOfBranch(dayStem, branch) {
  return tenGodOfStem(dayStem, BRANCH_MAIN_STEM[branch]);
}
function computeTenGods(pillars) {
  const dayStem = pillars.day.stem;
  return {
    yearStem: tenGodOfStem(dayStem, pillars.year.stem),
    yearBranch: tenGodOfBranch(dayStem, pillars.year.branch),
    monthStem: tenGodOfStem(dayStem, pillars.month.stem),
    monthBranch: tenGodOfBranch(dayStem, pillars.month.branch),
    dayBranch: tenGodOfBranch(dayStem, pillars.day.branch),
    hourStem: pillars.hour ? tenGodOfStem(dayStem, pillars.hour.stem) : null,
    hourBranch: pillars.hour ? tenGodOfBranch(dayStem, pillars.hour.branch) : null
  };
}

// src/elements.ts
function computeElements(pillars) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const bump = (el) => {
    counts[el] += 1;
  };
  bump(STEM_ELEMENT[pillars.year.stem]);
  bump(BRANCH_ELEMENT[pillars.year.branch]);
  bump(STEM_ELEMENT[pillars.month.stem]);
  bump(BRANCH_ELEMENT[pillars.month.branch]);
  bump(STEM_ELEMENT[pillars.day.stem]);
  bump(BRANCH_ELEMENT[pillars.day.branch]);
  if (pillars.hour) {
    bump(STEM_ELEMENT[pillars.hour.stem]);
    bump(BRANCH_ELEMENT[pillars.hour.branch]);
  }
  return counts;
}

// src/lib/branchHiddenStems.ts
var BRANCH_HIDDEN_STEMS = {
  \u5B50: ["\u7678"],
  \u4E11: ["\u5DF1", "\u7678", "\u8F9B"],
  \u5BC5: ["\u7532", "\u4E19", "\u620A"],
  \u536F: ["\u4E59"],
  \u8FB0: ["\u620A", "\u4E59", "\u7678"],
  \u5DF3: ["\u4E19", "\u620A", "\u5E9A"],
  \u5348: ["\u4E01", "\u5DF1"],
  \u672A: ["\u5DF1", "\u4E01", "\u4E59"],
  \u7533: ["\u5E9A", "\u58EC", "\u620A"],
  \u9149: ["\u8F9B"],
  \u620C: ["\u620A", "\u8F9B", "\u4E01"],
  \u4EA5: ["\u58EC", "\u7532"]
};

// src/lib/element-relations.ts
var PRODUCES = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};
var PRODUCED_BY = {
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
  wood: "water"
};
var CONTROLS = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"
};
var CONTROLLED_BY = {
  wood: "metal",
  fire: "water",
  earth: "wood",
  metal: "fire",
  water: "earth"
};
function classifyRole(dayEl, target) {
  if (target === dayEl) return "\uBE44\uAC81";
  if (target === PRODUCED_BY[dayEl]) return "\uC778\uC131";
  if (target === PRODUCES[dayEl]) return "\uC2DD\uC0C1";
  if (target === CONTROLS[dayEl]) return "\uC7AC\uC131";
  return "\uAD00\uC131";
}
function roleToElement(dayEl, role) {
  switch (role) {
    case "\uBE44\uAC81":
      return dayEl;
    case "\uC778\uC131":
      return PRODUCED_BY[dayEl];
    case "\uC2DD\uC0C1":
      return PRODUCES[dayEl];
    case "\uC7AC\uC131":
      return CONTROLS[dayEl];
    case "\uAD00\uC131":
      return CONTROLLED_BY[dayEl];
  }
}

// src/lib/shen-strength.ts
function emptyRoleCount() {
  return { \uBE44\uAC81: 0, \uC778\uC131: 0, \uC2DD\uC0C1: 0, \uC7AC\uC131: 0, \uAD00\uC131: 0 };
}
function detectJonggyeok(roleCount) {
  const { \uBE44\uAC81, \uC778\uC131, \uC2DD\uC0C1, \uC7AC\uC131, \uAD00\uC131 } = roleCount;
  const dayHelperScore = \uBE44\uAC81 + \uC778\uC131;
  const candidates = [
    { role: "\uC2DD\uC0C1", count: \uC2DD\uC0C1 },
    { role: "\uC7AC\uC131", count: \uC7AC\uC131 },
    { role: "\uAD00\uC131", count: \uAD00\uC131 }
  ];
  const dominant = candidates.reduce((max, c) => c.count > max.count ? c : max);
  if (\uC778\uC131 === 0 && \uBE44\uAC81 <= 1 && dominant.count >= 6) {
    return { kind: "\uC644\uC804\uC885", role: dominant.role };
  }
  if (\uC778\uC131 <= 1 && dominant.count >= dayHelperScore * 1.3 && dominant.count >= 4) {
    return { kind: "\uAC00\uC885", role: dominant.role };
  }
  return null;
}
function computeShenStrength(chart) {
  const { year, month, day, hour } = chart.pillars;
  const dayElement = STEM_ELEMENT[day.stem];
  const stems = [year.stem, month.stem, day.stem];
  const branches = [year.branch, month.branch, day.branch];
  if (hour) {
    stems.push(hour.stem);
    branches.push(hour.branch);
  }
  const roleCount = emptyRoleCount();
  for (const s of stems) {
    const el = STEM_ELEMENT[s];
    roleCount[classifyRole(dayElement, el)]++;
  }
  for (const b of branches) {
    const el = BRANCH_ELEMENT[b];
    roleCount[classifyRole(dayElement, el)]++;
  }
  const supportScore = roleCount["\uBE44\uAC81"] + roleCount["\uC778\uC131"];
  const drainScore = roleCount["\uC2DD\uC0C1"] + roleCount["\uC7AC\uC131"] + roleCount["\uAD00\uC131"];
  const roleCountExtended = { ...roleCount };
  for (const b of branches) {
    const hidden = BRANCH_HIDDEN_STEMS[b];
    for (const hs of hidden) {
      const el = STEM_ELEMENT[hs];
      roleCountExtended[classifyRole(dayElement, el)]++;
    }
  }
  const jong = detectJonggyeok(roleCountExtended);
  if (jong) {
    const verdict2 = jong.role === "\uC2DD\uC0C1" ? "\uC885\uC544" : jong.role === "\uC7AC\uC131" ? "\uC885\uC7AC" : "\uC885\uC0B4";
    return {
      dayElement,
      supportScore,
      drainScore,
      roleCount,
      roleCountExtended,
      verdict: verdict2,
      jonggyeokKind: jong.kind,
      jonggyeokRole: jong.role
    };
  }
  const diff = supportScore - drainScore;
  const verdict = diff >= 2 ? "\uC2E0\uAC15" : diff <= -2 ? "\uC2E0\uC57D" : "\uADE0\uD615";
  return {
    dayElement,
    supportScore,
    drainScore,
    roleCount,
    roleCountExtended,
    verdict,
    jonggyeokKind: null,
    jonggyeokRole: null
  };
}

// src/pattern.ts
var ELEMENT_CTRL_NEXT2 = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood"
};
var ELEMENT_CTRL_PREV = {
  water: "earth",
  fire: "water",
  metal: "fire",
  wood: "metal",
  earth: "wood"
};
var ELEMENT_GEN_PREV = {
  wood: "water",
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal"
};
var TEN_GOD_TO_PATTERN = {
  \u6BD4\u80A9: "\u6BD4\u80A9\u683C",
  \u52AB\u8CA1: "\u52AB\u8CA1\u683C",
  \u98DF\u795E: "\u98DF\u795E\u683C",
  \u50B7\u5B98: "\u50B7\u5B98\u683C",
  \u504F\u8CA1: "\u504F\u8CA1\u683C",
  \u6B63\u8CA1: "\u6B63\u8CA1\u683C",
  \u504F\u5B98: "\u504F\u5B98\u683C",
  \u6B63\u5B98: "\u6B63\u5B98\u683C",
  \u504F\u5370: "\u504F\u5370\u683C",
  \u6B63\u5370: "\u6B63\u5370\u683C"
};
function computePattern(input) {
  const { pillars, strength } = input;
  const dayStem = pillars.day.stem;
  const monthBranchMainStem = BRANCH_MAIN_STEM[pillars.month.branch];
  const monthTenGod = tenGodOfStem(dayStem, monthBranchMainStem);
  const pattern = TEN_GOD_TO_PATTERN[monthTenGod] ?? "\u672A\u5B9A\u683C";
  const dayEl = STEM_ELEMENT[dayStem];
  const strongLike = strength === "\uC2E0\uAC15";
  const yongSin = strongLike ? [
    ELEMENT_CTRL_NEXT2[dayEl],
    // 일간이 극하는 (財)
    ELEMENT_CTRL_PREV[dayEl]
    // 일간을 극하는 (官)
  ] : [
    ELEMENT_GEN_PREV[dayEl],
    // 일간을 생하는 (印)
    dayEl
    // 비겁 (자체 보강)
  ];
  const giSin = yongSin.map((e) => ELEMENT_CTRL_NEXT2[e]);
  return { pattern, yongSin, giSin };
}

// src/majorFortune.ts
import { Solar as Solar2, Lunar as Lunar2 } from "lunar-javascript";
function computeMajorFortunes(input) {
  const [y, m, d] = input.birthDate.split("-").map(Number);
  const [hh, mm] = (input.birthTime ?? "12:00").split(":").map(Number);
  const solar = input.calendar === "solar" ? Solar2.fromYmdHms(y, m, d, hh, mm, 0) : Lunar2.fromYmdHms(y, m, d, hh, mm, 0).getSolar();
  const eightChar = solar.getLunar().getEightChar();
  const yun = eightChar.getYun(input.gender === "male" ? 1 : 0);
  const daYunList = yun.getDaYun(11).slice(1);
  return daYunList.map((dy) => ({
    startAge: dy.getStartAge(),
    startYear: dy.getStartYear(),
    stem: dy.getGanZhi().charAt(0),
    branch: dy.getGanZhi().charAt(1)
  }));
}

// src/hashProfile.ts
import { createHash } from "crypto";
function hashProfile(input) {
  const normalized = [
    input.birthDate,
    input.birthTime ?? "",
    input.calendar,
    input.gender,
    (input.birthCity ?? "").trim().toLowerCase()
  ].join("|");
  return createHash("sha256").update(normalized).digest("hex");
}

// src/computeSajuChart.ts
function computeSajuChart(input) {
  const pillars = computePillars(input);
  const elements = computeElements(pillars);
  const partialChart = {
    pillars,
    elements,
    strength: "\uC2E0\uC57D",
    tenGods: {},
    pattern: "",
    yongSin: [],
    giSin: [],
    majorFortunes: [],
    inputHash: ""
  };
  const strength = computeShenStrength(partialChart).verdict;
  const tenGods = computeTenGods(pillars);
  const { pattern, yongSin, giSin } = computePattern({ pillars, strength });
  const majorFortunes = computeMajorFortunes(input);
  return {
    pillars,
    elements,
    strength,
    tenGods,
    pattern,
    yongSin,
    giSin,
    majorFortunes,
    inputHash: hashProfile(input)
  };
}

// src/yearPillar.ts
import { Solar as Solar3 } from "lunar-javascript";
function computeYearPillar(year) {
  return computeYearPillarFromDate(`${year}-06-01`);
}
function computeYearPillarFromDate(date) {
  const [y, m, d] = date.split("-").map(Number);
  const solar = Solar3.fromYmdHms(y, m, d, 12, 0, 0);
  const ec = solar.getLunar().getEightChar();
  return {
    stem: ec.getYearGan(),
    branch: ec.getYearZhi()
  };
}

// src/monthPillars.ts
import { Solar as Solar4 } from "lunar-javascript";
function computeMonthPillars(year) {
  const result = [];
  for (let m = 1; m <= 12; m++) {
    const solar = Solar4.fromYmdHms(year, m, 15, 12, 0, 0);
    const ec = solar.getLunar().getEightChar();
    const endMonth = m === 12 ? `${year + 1}-01-14` : `${year}-${String(m + 1).padStart(2, "0")}-14`;
    result.push({
      monthIndex: m,
      pillar: {
        stem: ec.getMonthGan(),
        branch: ec.getMonthZhi()
      },
      startSolarDate: `${year}-${String(m).padStart(2, "0")}-15`,
      endSolarDate: endMonth
    });
  }
  return result;
}

// src/dayPillar.ts
import { Solar as Solar5 } from "lunar-javascript";
function computeDayPillar(date) {
  const [y, m, d] = date.split("-").map(Number);
  const solar = Solar5.fromYmdHms(y, m, d, 12, 0, 0);
  const ec = solar.getLunar().getEightChar();
  return {
    stem: ec.getDayGan(),
    branch: ec.getDayZhi()
  };
}

// src/tenGodsFor.ts
function tenGodsForPillar(dayStem, pillar) {
  return {
    stemTenGod: tenGodOfStem(dayStem, pillar.stem),
    branchTenGod: tenGodOfBranch(dayStem, pillar.branch)
  };
}

// src/dailyFortune.ts
import { z } from "zod";
var dailyFortuneScoreSchema = z.object({
  label: z.string(),
  score: z.number().int().min(1).max(5),
  note: z.string()
});
var dailyFortuneHourSlotSchema = z.object({
  range: z.string(),
  vibe: z.string(),
  isGolden: z.boolean().optional()
});
var dailyFortuneRemedySchema = z.object({
  colors: z.array(z.string()),
  directions: z.array(z.string()),
  foods: z.array(z.string()),
  items: z.array(z.string())
});
var dailyFortunePayloadSchema = z.object({
  forDate: z.string(),
  dayPillar: z.string(),
  summary: z.string(),
  overallScore: z.number().int().min(1).max(5),
  scores: z.array(dailyFortuneScoreSchema).length(5),
  hourly: z.array(dailyFortuneHourSlotSchema).min(7).max(12),
  recommendations: z.array(z.string()).min(1),
  cautions: z.array(z.string()).min(1),
  remedy: dailyFortuneRemedySchema,
  closing: z.string()
});

// src/time/cities.json
var cities_default = [
  { name: "\uC11C\uC6B8", nameKo: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC", country: "KR", longitudeDeg: 126.98, timezone: "Asia/Seoul" },
  { name: "\uBD80\uC0B0", nameKo: "\uBD80\uC0B0\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 129.08, timezone: "Asia/Seoul" },
  { name: "\uB300\uAD6C", nameKo: "\uB300\uAD6C\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 128.6, timezone: "Asia/Seoul" },
  { name: "\uC778\uCC9C", nameKo: "\uC778\uCC9C\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 126.71, timezone: "Asia/Seoul" },
  { name: "\uAD11\uC8FC", nameKo: "\uAD11\uC8FC\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 126.85, timezone: "Asia/Seoul" },
  { name: "\uB300\uC804", nameKo: "\uB300\uC804\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 127.38, timezone: "Asia/Seoul" },
  { name: "\uC6B8\uC0B0", nameKo: "\uC6B8\uC0B0\uAD11\uC5ED\uC2DC", country: "KR", longitudeDeg: 129.31, timezone: "Asia/Seoul" },
  { name: "\uC138\uC885", nameKo: "\uC138\uC885\uD2B9\uBCC4\uC790\uCE58\uC2DC", country: "KR", longitudeDeg: 127.29, timezone: "Asia/Seoul" },
  { name: "\uC218\uC6D0", nameKo: "\uC218\uC6D0\uC2DC", country: "KR", longitudeDeg: 127.03, timezone: "Asia/Seoul" },
  { name: "\uC131\uB0A8", nameKo: "\uC131\uB0A8\uC2DC", country: "KR", longitudeDeg: 127.14, timezone: "Asia/Seoul" },
  { name: "\uACE0\uC591", nameKo: "\uACE0\uC591\uC2DC", country: "KR", longitudeDeg: 126.83, timezone: "Asia/Seoul" },
  { name: "\uC6A9\uC778", nameKo: "\uC6A9\uC778\uC2DC", country: "KR", longitudeDeg: 127.18, timezone: "Asia/Seoul" },
  { name: "\uBD80\uCC9C", nameKo: "\uBD80\uCC9C\uC2DC", country: "KR", longitudeDeg: 126.78, timezone: "Asia/Seoul" },
  { name: "\uC548\uC0B0", nameKo: "\uC548\uC0B0\uC2DC", country: "KR", longitudeDeg: 126.83, timezone: "Asia/Seoul" },
  { name: "\uC548\uC591", nameKo: "\uC548\uC591\uC2DC", country: "KR", longitudeDeg: 126.95, timezone: "Asia/Seoul" },
  { name: "\uB0A8\uC591\uC8FC", nameKo: "\uB0A8\uC591\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.22, timezone: "Asia/Seoul" },
  { name: "\uD654\uC131", nameKo: "\uD654\uC131\uC2DC", country: "KR", longitudeDeg: 126.83, timezone: "Asia/Seoul" },
  { name: "\uD3C9\uD0DD", nameKo: "\uD3C9\uD0DD\uC2DC", country: "KR", longitudeDeg: 127.11, timezone: "Asia/Seoul" },
  { name: "\uC758\uC815\uBD80", nameKo: "\uC758\uC815\uBD80\uC2DC", country: "KR", longitudeDeg: 127.05, timezone: "Asia/Seoul" },
  { name: "\uC2DC\uD765", nameKo: "\uC2DC\uD765\uC2DC", country: "KR", longitudeDeg: 126.8, timezone: "Asia/Seoul" },
  { name: "\uD30C\uC8FC", nameKo: "\uD30C\uC8FC\uC2DC", country: "KR", longitudeDeg: 126.78, timezone: "Asia/Seoul" },
  { name: "\uAE40\uD3EC", nameKo: "\uAE40\uD3EC\uC2DC", country: "KR", longitudeDeg: 126.72, timezone: "Asia/Seoul" },
  { name: "\uAD11\uBA85", nameKo: "\uAD11\uBA85\uC2DC", country: "KR", longitudeDeg: 126.86, timezone: "Asia/Seoul" },
  { name: "\uAD11\uC8FC(\uACBD\uAE30)", nameKo: "\uAD11\uC8FC\uC2DC(\uACBD\uAE30)", country: "KR", longitudeDeg: 127.26, timezone: "Asia/Seoul" },
  { name: "\uAD70\uD3EC", nameKo: "\uAD70\uD3EC\uC2DC", country: "KR", longitudeDeg: 126.93, timezone: "Asia/Seoul" },
  { name: "\uD558\uB0A8", nameKo: "\uD558\uB0A8\uC2DC", country: "KR", longitudeDeg: 127.21, timezone: "Asia/Seoul" },
  { name: "\uC624\uC0B0", nameKo: "\uC624\uC0B0\uC2DC", country: "KR", longitudeDeg: 127.07, timezone: "Asia/Seoul" },
  { name: "\uC774\uCC9C", nameKo: "\uC774\uCC9C\uC2DC", country: "KR", longitudeDeg: 127.44, timezone: "Asia/Seoul" },
  { name: "\uC548\uC131", nameKo: "\uC548\uC131\uC2DC", country: "KR", longitudeDeg: 127.27, timezone: "Asia/Seoul" },
  { name: "\uAD6C\uB9AC", nameKo: "\uAD6C\uB9AC\uC2DC", country: "KR", longitudeDeg: 127.13, timezone: "Asia/Seoul" },
  { name: "\uD3EC\uCC9C", nameKo: "\uD3EC\uCC9C\uC2DC", country: "KR", longitudeDeg: 127.2, timezone: "Asia/Seoul" },
  { name: "\uC591\uC8FC", nameKo: "\uC591\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.05, timezone: "Asia/Seoul" },
  { name: "\uB3D9\uB450\uCC9C", nameKo: "\uB3D9\uB450\uCC9C\uC2DC", country: "KR", longitudeDeg: 127.06, timezone: "Asia/Seoul" },
  { name: "\uC5EC\uC8FC", nameKo: "\uC5EC\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.64, timezone: "Asia/Seoul" },
  { name: "\uACFC\uCC9C", nameKo: "\uACFC\uCC9C\uC2DC", country: "KR", longitudeDeg: 126.99, timezone: "Asia/Seoul" },
  { name: "\uCD98\uCC9C", nameKo: "\uCD98\uCC9C\uC2DC", country: "KR", longitudeDeg: 127.73, timezone: "Asia/Seoul" },
  { name: "\uC6D0\uC8FC", nameKo: "\uC6D0\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.95, timezone: "Asia/Seoul" },
  { name: "\uAC15\uB989", nameKo: "\uAC15\uB989\uC2DC", country: "KR", longitudeDeg: 128.88, timezone: "Asia/Seoul" },
  { name: "\uB3D9\uD574", nameKo: "\uB3D9\uD574\uC2DC", country: "KR", longitudeDeg: 129.11, timezone: "Asia/Seoul" },
  { name: "\uD0DC\uBC31", nameKo: "\uD0DC\uBC31\uC2DC", country: "KR", longitudeDeg: 128.99, timezone: "Asia/Seoul" },
  { name: "\uC18D\uCD08", nameKo: "\uC18D\uCD08\uC2DC", country: "KR", longitudeDeg: 128.59, timezone: "Asia/Seoul" },
  { name: "\uC0BC\uCC99", nameKo: "\uC0BC\uCC99\uC2DC", country: "KR", longitudeDeg: 129.17, timezone: "Asia/Seoul" },
  { name: "\uD64D\uCC9C", nameKo: "\uD64D\uCC9C\uAD70", country: "KR", longitudeDeg: 127.89, timezone: "Asia/Seoul" },
  { name: "\uD6A1\uC131", nameKo: "\uD6A1\uC131\uAD70", country: "KR", longitudeDeg: 127.99, timezone: "Asia/Seoul" },
  { name: "\uD3C9\uCC3D", nameKo: "\uD3C9\uCC3D\uAD70", country: "KR", longitudeDeg: 128.39, timezone: "Asia/Seoul" },
  { name: "\uC815\uC120", nameKo: "\uC815\uC120\uAD70", country: "KR", longitudeDeg: 128.66, timezone: "Asia/Seoul" },
  { name: "\uCCA0\uC6D0", nameKo: "\uCCA0\uC6D0\uAD70", country: "KR", longitudeDeg: 127.31, timezone: "Asia/Seoul" },
  { name: "\uC591\uC591", nameKo: "\uC591\uC591\uAD70", country: "KR", longitudeDeg: 128.62, timezone: "Asia/Seoul" },
  { name: "\uCCAD\uC8FC", nameKo: "\uCCAD\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.49, timezone: "Asia/Seoul" },
  { name: "\uCDA9\uC8FC", nameKo: "\uCDA9\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.93, timezone: "Asia/Seoul" },
  { name: "\uC81C\uCC9C", nameKo: "\uC81C\uCC9C\uC2DC", country: "KR", longitudeDeg: 128.19, timezone: "Asia/Seoul" },
  { name: "\uBCF4\uC740", nameKo: "\uBCF4\uC740\uAD70", country: "KR", longitudeDeg: 127.73, timezone: "Asia/Seoul" },
  { name: "\uC625\uCC9C", nameKo: "\uC625\uCC9C\uAD70", country: "KR", longitudeDeg: 127.57, timezone: "Asia/Seoul" },
  { name: "\uC601\uB3D9", nameKo: "\uC601\uB3D9\uAD70", country: "KR", longitudeDeg: 127.78, timezone: "Asia/Seoul" },
  { name: "\uC9C4\uCC9C", nameKo: "\uC9C4\uCC9C\uAD70", country: "KR", longitudeDeg: 127.44, timezone: "Asia/Seoul" },
  { name: "\uAD34\uC0B0", nameKo: "\uAD34\uC0B0\uAD70", country: "KR", longitudeDeg: 127.79, timezone: "Asia/Seoul" },
  { name: "\uC74C\uC131", nameKo: "\uC74C\uC131\uAD70", country: "KR", longitudeDeg: 127.69, timezone: "Asia/Seoul" },
  { name: "\uB2E8\uC591", nameKo: "\uB2E8\uC591\uAD70", country: "KR", longitudeDeg: 128.37, timezone: "Asia/Seoul" },
  { name: "\uCC9C\uC548", nameKo: "\uCC9C\uC548\uC2DC", country: "KR", longitudeDeg: 127.15, timezone: "Asia/Seoul" },
  { name: "\uACF5\uC8FC", nameKo: "\uACF5\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.12, timezone: "Asia/Seoul" },
  { name: "\uBCF4\uB839", nameKo: "\uBCF4\uB839\uC2DC", country: "KR", longitudeDeg: 126.61, timezone: "Asia/Seoul" },
  { name: "\uC544\uC0B0", nameKo: "\uC544\uC0B0\uC2DC", country: "KR", longitudeDeg: 127, timezone: "Asia/Seoul" },
  { name: "\uC11C\uC0B0", nameKo: "\uC11C\uC0B0\uC2DC", country: "KR", longitudeDeg: 126.45, timezone: "Asia/Seoul" },
  { name: "\uB17C\uC0B0", nameKo: "\uB17C\uC0B0\uC2DC", country: "KR", longitudeDeg: 127.1, timezone: "Asia/Seoul" },
  { name: "\uACC4\uB8E1", nameKo: "\uACC4\uB8E1\uC2DC", country: "KR", longitudeDeg: 127.25, timezone: "Asia/Seoul" },
  { name: "\uB2F9\uC9C4", nameKo: "\uB2F9\uC9C4\uC2DC", country: "KR", longitudeDeg: 126.65, timezone: "Asia/Seoul" },
  { name: "\uAE08\uC0B0", nameKo: "\uAE08\uC0B0\uAD70", country: "KR", longitudeDeg: 127.49, timezone: "Asia/Seoul" },
  { name: "\uBD80\uC5EC", nameKo: "\uBD80\uC5EC\uAD70", country: "KR", longitudeDeg: 126.91, timezone: "Asia/Seoul" },
  { name: "\uC11C\uCC9C", nameKo: "\uC11C\uCC9C\uAD70", country: "KR", longitudeDeg: 126.69, timezone: "Asia/Seoul" },
  { name: "\uCCAD\uC591", nameKo: "\uCCAD\uC591\uAD70", country: "KR", longitudeDeg: 126.8, timezone: "Asia/Seoul" },
  { name: "\uD64D\uC131", nameKo: "\uD64D\uC131\uAD70", country: "KR", longitudeDeg: 126.66, timezone: "Asia/Seoul" },
  { name: "\uC608\uC0B0", nameKo: "\uC608\uC0B0\uAD70", country: "KR", longitudeDeg: 126.85, timezone: "Asia/Seoul" },
  { name: "\uD0DC\uC548", nameKo: "\uD0DC\uC548\uAD70", country: "KR", longitudeDeg: 126.3, timezone: "Asia/Seoul" },
  { name: "\uC804\uC8FC", nameKo: "\uC804\uC8FC\uC2DC", country: "KR", longitudeDeg: 127.15, timezone: "Asia/Seoul" },
  { name: "\uAD70\uC0B0", nameKo: "\uAD70\uC0B0\uC2DC", country: "KR", longitudeDeg: 126.74, timezone: "Asia/Seoul" },
  { name: "\uC775\uC0B0", nameKo: "\uC775\uC0B0\uC2DC", country: "KR", longitudeDeg: 126.96, timezone: "Asia/Seoul" },
  { name: "\uC815\uC74D", nameKo: "\uC815\uC74D\uC2DC", country: "KR", longitudeDeg: 126.86, timezone: "Asia/Seoul" },
  { name: "\uB0A8\uC6D0", nameKo: "\uB0A8\uC6D0\uC2DC", country: "KR", longitudeDeg: 127.39, timezone: "Asia/Seoul" },
  { name: "\uAE40\uC81C", nameKo: "\uAE40\uC81C\uC2DC", country: "KR", longitudeDeg: 126.88, timezone: "Asia/Seoul" },
  { name: "\uC644\uC8FC", nameKo: "\uC644\uC8FC\uAD70", country: "KR", longitudeDeg: 127.16, timezone: "Asia/Seoul" },
  { name: "\uC9C4\uC548", nameKo: "\uC9C4\uC548\uAD70", country: "KR", longitudeDeg: 127.42, timezone: "Asia/Seoul" },
  { name: "\uBB34\uC8FC", nameKo: "\uBB34\uC8FC\uAD70", country: "KR", longitudeDeg: 127.66, timezone: "Asia/Seoul" },
  { name: "\uC7A5\uC218", nameKo: "\uC7A5\uC218\uAD70", country: "KR", longitudeDeg: 127.52, timezone: "Asia/Seoul" },
  { name: "\uC784\uC2E4", nameKo: "\uC784\uC2E4\uAD70", country: "KR", longitudeDeg: 127.29, timezone: "Asia/Seoul" },
  { name: "\uC21C\uCC3D", nameKo: "\uC21C\uCC3D\uAD70", country: "KR", longitudeDeg: 127.14, timezone: "Asia/Seoul" },
  { name: "\uACE0\uCC3D", nameKo: "\uACE0\uCC3D\uAD70", country: "KR", longitudeDeg: 126.7, timezone: "Asia/Seoul" },
  { name: "\uBD80\uC548", nameKo: "\uBD80\uC548\uAD70", country: "KR", longitudeDeg: 126.73, timezone: "Asia/Seoul" },
  { name: "\uBAA9\uD3EC", nameKo: "\uBAA9\uD3EC\uC2DC", country: "KR", longitudeDeg: 126.39, timezone: "Asia/Seoul" },
  { name: "\uC5EC\uC218", nameKo: "\uC5EC\uC218\uC2DC", country: "KR", longitudeDeg: 127.66, timezone: "Asia/Seoul" },
  { name: "\uC21C\uCC9C", nameKo: "\uC21C\uCC9C\uC2DC", country: "KR", longitudeDeg: 127.49, timezone: "Asia/Seoul" },
  { name: "\uB098\uC8FC", nameKo: "\uB098\uC8FC\uC2DC", country: "KR", longitudeDeg: 126.71, timezone: "Asia/Seoul" },
  { name: "\uAD11\uC591", nameKo: "\uAD11\uC591\uC2DC", country: "KR", longitudeDeg: 127.7, timezone: "Asia/Seoul" },
  { name: "\uB2F4\uC591", nameKo: "\uB2F4\uC591\uAD70", country: "KR", longitudeDeg: 126.99, timezone: "Asia/Seoul" },
  { name: "\uACE1\uC131", nameKo: "\uACE1\uC131\uAD70", country: "KR", longitudeDeg: 127.29, timezone: "Asia/Seoul" },
  { name: "\uAD6C\uB840", nameKo: "\uAD6C\uB840\uAD70", country: "KR", longitudeDeg: 127.46, timezone: "Asia/Seoul" },
  { name: "\uACE0\uD765", nameKo: "\uACE0\uD765\uAD70", country: "KR", longitudeDeg: 127.28, timezone: "Asia/Seoul" },
  { name: "\uBCF4\uC131", nameKo: "\uBCF4\uC131\uAD70", country: "KR", longitudeDeg: 127.08, timezone: "Asia/Seoul" },
  { name: "\uD654\uC21C", nameKo: "\uD654\uC21C\uAD70", country: "KR", longitudeDeg: 126.99, timezone: "Asia/Seoul" },
  { name: "\uC7A5\uD765", nameKo: "\uC7A5\uD765\uAD70", country: "KR", longitudeDeg: 126.91, timezone: "Asia/Seoul" },
  { name: "\uAC15\uC9C4", nameKo: "\uAC15\uC9C4\uAD70", country: "KR", longitudeDeg: 126.77, timezone: "Asia/Seoul" },
  { name: "\uD574\uB0A8", nameKo: "\uD574\uB0A8\uAD70", country: "KR", longitudeDeg: 126.6, timezone: "Asia/Seoul" },
  { name: "\uC601\uC554", nameKo: "\uC601\uC554\uAD70", country: "KR", longitudeDeg: 126.7, timezone: "Asia/Seoul" },
  { name: "\uBB34\uC548", nameKo: "\uBB34\uC548\uAD70", country: "KR", longitudeDeg: 126.48, timezone: "Asia/Seoul" },
  { name: "\uD568\uD3C9", nameKo: "\uD568\uD3C9\uAD70", country: "KR", longitudeDeg: 126.52, timezone: "Asia/Seoul" },
  { name: "\uC601\uAD11", nameKo: "\uC601\uAD11\uAD70", country: "KR", longitudeDeg: 126.51, timezone: "Asia/Seoul" },
  { name: "\uC7A5\uC131", nameKo: "\uC7A5\uC131\uAD70", country: "KR", longitudeDeg: 126.78, timezone: "Asia/Seoul" },
  { name: "\uC644\uB3C4", nameKo: "\uC644\uB3C4\uAD70", country: "KR", longitudeDeg: 126.75, timezone: "Asia/Seoul" },
  { name: "\uC9C4\uB3C4", nameKo: "\uC9C4\uB3C4\uAD70", country: "KR", longitudeDeg: 126.26, timezone: "Asia/Seoul" },
  { name: "\uC2E0\uC548", nameKo: "\uC2E0\uC548\uAD70", country: "KR", longitudeDeg: 126.1, timezone: "Asia/Seoul" },
  { name: "\uD3EC\uD56D", nameKo: "\uD3EC\uD56D\uC2DC", country: "KR", longitudeDeg: 129.34, timezone: "Asia/Seoul" },
  { name: "\uACBD\uC8FC", nameKo: "\uACBD\uC8FC\uC2DC", country: "KR", longitudeDeg: 129.22, timezone: "Asia/Seoul" },
  { name: "\uAE40\uCC9C", nameKo: "\uAE40\uCC9C\uC2DC", country: "KR", longitudeDeg: 128.11, timezone: "Asia/Seoul" },
  { name: "\uC548\uB3D9", nameKo: "\uC548\uB3D9\uC2DC", country: "KR", longitudeDeg: 128.73, timezone: "Asia/Seoul" },
  { name: "\uAD6C\uBBF8", nameKo: "\uAD6C\uBBF8\uC2DC", country: "KR", longitudeDeg: 128.34, timezone: "Asia/Seoul" },
  { name: "\uC601\uC8FC", nameKo: "\uC601\uC8FC\uC2DC", country: "KR", longitudeDeg: 128.62, timezone: "Asia/Seoul" },
  { name: "\uC601\uCC9C", nameKo: "\uC601\uCC9C\uC2DC", country: "KR", longitudeDeg: 128.94, timezone: "Asia/Seoul" },
  { name: "\uC0C1\uC8FC", nameKo: "\uC0C1\uC8FC\uC2DC", country: "KR", longitudeDeg: 128.16, timezone: "Asia/Seoul" },
  { name: "\uBB38\uACBD", nameKo: "\uBB38\uACBD\uC2DC", country: "KR", longitudeDeg: 128.19, timezone: "Asia/Seoul" },
  { name: "\uACBD\uC0B0", nameKo: "\uACBD\uC0B0\uC2DC", country: "KR", longitudeDeg: 128.74, timezone: "Asia/Seoul" },
  { name: "\uAD70\uC704", nameKo: "\uAD70\uC704\uAD70", country: "KR", longitudeDeg: 128.57, timezone: "Asia/Seoul" },
  { name: "\uC758\uC131", nameKo: "\uC758\uC131\uAD70", country: "KR", longitudeDeg: 128.7, timezone: "Asia/Seoul" },
  { name: "\uCCAD\uC1A1", nameKo: "\uCCAD\uC1A1\uAD70", country: "KR", longitudeDeg: 129.06, timezone: "Asia/Seoul" },
  { name: "\uC601\uC591", nameKo: "\uC601\uC591\uAD70", country: "KR", longitudeDeg: 129.11, timezone: "Asia/Seoul" },
  { name: "\uC601\uB355", nameKo: "\uC601\uB355\uAD70", country: "KR", longitudeDeg: 129.37, timezone: "Asia/Seoul" },
  { name: "\uCCAD\uB3C4", nameKo: "\uCCAD\uB3C4\uAD70", country: "KR", longitudeDeg: 128.73, timezone: "Asia/Seoul" },
  { name: "\uACE0\uB839", nameKo: "\uACE0\uB839\uAD70", country: "KR", longitudeDeg: 128.26, timezone: "Asia/Seoul" },
  { name: "\uC131\uC8FC", nameKo: "\uC131\uC8FC\uAD70", country: "KR", longitudeDeg: 128.28, timezone: "Asia/Seoul" },
  { name: "\uCE60\uACE1", nameKo: "\uCE60\uACE1\uAD70", country: "KR", longitudeDeg: 128.4, timezone: "Asia/Seoul" },
  { name: "\uC608\uCC9C", nameKo: "\uC608\uCC9C\uAD70", country: "KR", longitudeDeg: 128.45, timezone: "Asia/Seoul" },
  { name: "\uBD09\uD654", nameKo: "\uBD09\uD654\uAD70", country: "KR", longitudeDeg: 128.73, timezone: "Asia/Seoul" },
  { name: "\uC6B8\uC9C4", nameKo: "\uC6B8\uC9C4\uAD70", country: "KR", longitudeDeg: 129.4, timezone: "Asia/Seoul" },
  { name: "\uC6B8\uB989", nameKo: "\uC6B8\uB989\uAD70", country: "KR", longitudeDeg: 130.91, timezone: "Asia/Seoul" },
  { name: "\uCC3D\uC6D0", nameKo: "\uCC3D\uC6D0\uC2DC", country: "KR", longitudeDeg: 128.68, timezone: "Asia/Seoul" },
  { name: "\uC9C4\uC8FC", nameKo: "\uC9C4\uC8FC\uC2DC", country: "KR", longitudeDeg: 128.1, timezone: "Asia/Seoul" },
  { name: "\uD1B5\uC601", nameKo: "\uD1B5\uC601\uC2DC", country: "KR", longitudeDeg: 128.43, timezone: "Asia/Seoul" },
  { name: "\uC0AC\uCC9C", nameKo: "\uC0AC\uCC9C\uC2DC", country: "KR", longitudeDeg: 128.07, timezone: "Asia/Seoul" },
  { name: "\uAE40\uD574", nameKo: "\uAE40\uD574\uC2DC", country: "KR", longitudeDeg: 128.89, timezone: "Asia/Seoul" },
  { name: "\uBC00\uC591", nameKo: "\uBC00\uC591\uC2DC", country: "KR", longitudeDeg: 128.75, timezone: "Asia/Seoul" },
  { name: "\uAC70\uC81C", nameKo: "\uAC70\uC81C\uC2DC", country: "KR", longitudeDeg: 128.62, timezone: "Asia/Seoul" },
  { name: "\uC591\uC0B0", nameKo: "\uC591\uC0B0\uC2DC", country: "KR", longitudeDeg: 129.04, timezone: "Asia/Seoul" },
  { name: "\uC758\uB839", nameKo: "\uC758\uB839\uAD70", country: "KR", longitudeDeg: 128.26, timezone: "Asia/Seoul" },
  { name: "\uD568\uC548", nameKo: "\uD568\uC548\uAD70", country: "KR", longitudeDeg: 128.41, timezone: "Asia/Seoul" },
  { name: "\uCC3D\uB155", nameKo: "\uCC3D\uB155\uAD70", country: "KR", longitudeDeg: 128.49, timezone: "Asia/Seoul" },
  { name: "\uACE0\uC131(\uACBD\uB0A8)", nameKo: "\uACE0\uC131\uAD70(\uACBD\uB0A8)", country: "KR", longitudeDeg: 128.32, timezone: "Asia/Seoul" },
  { name: "\uB0A8\uD574", nameKo: "\uB0A8\uD574\uAD70", country: "KR", longitudeDeg: 127.89, timezone: "Asia/Seoul" },
  { name: "\uD558\uB3D9", nameKo: "\uD558\uB3D9\uAD70", country: "KR", longitudeDeg: 127.75, timezone: "Asia/Seoul" },
  { name: "\uC0B0\uCCAD", nameKo: "\uC0B0\uCCAD\uAD70", country: "KR", longitudeDeg: 127.87, timezone: "Asia/Seoul" },
  { name: "\uD568\uC591", nameKo: "\uD568\uC591\uAD70", country: "KR", longitudeDeg: 127.72, timezone: "Asia/Seoul" },
  { name: "\uAC70\uCC3D", nameKo: "\uAC70\uCC3D\uAD70", country: "KR", longitudeDeg: 127.91, timezone: "Asia/Seoul" },
  { name: "\uD569\uCC9C", nameKo: "\uD569\uCC9C\uAD70", country: "KR", longitudeDeg: 128.17, timezone: "Asia/Seoul" },
  { name: "\uC81C\uC8FC", nameKo: "\uC81C\uC8FC\uC2DC", country: "KR", longitudeDeg: 126.53, timezone: "Asia/Seoul" },
  { name: "\uC11C\uADC0\uD3EC", nameKo: "\uC11C\uADC0\uD3EC\uC2DC", country: "KR", longitudeDeg: 126.56, timezone: "Asia/Seoul" },
  { name: "Tokyo", nameKo: "\uB3C4\uCFC4", country: "JP", longitudeDeg: 139.69, timezone: "Asia/Tokyo" },
  { name: "Osaka", nameKo: "\uC624\uC0AC\uCE74", country: "JP", longitudeDeg: 135.5, timezone: "Asia/Tokyo" },
  { name: "Kyoto", nameKo: "\uAD50\uD1A0", country: "JP", longitudeDeg: 135.77, timezone: "Asia/Tokyo" },
  { name: "Fukuoka", nameKo: "\uD6C4\uCFE0\uC624\uCE74", country: "JP", longitudeDeg: 130.4, timezone: "Asia/Tokyo" },
  { name: "Sapporo", nameKo: "\uC0BF\uD3EC\uB85C", country: "JP", longitudeDeg: 141.35, timezone: "Asia/Tokyo" },
  { name: "Yokohama", nameKo: "\uC694\uCF54\uD558\uB9C8", country: "JP", longitudeDeg: 139.65, timezone: "Asia/Tokyo" },
  { name: "Nagoya", nameKo: "\uB098\uACE0\uC57C", country: "JP", longitudeDeg: 136.91, timezone: "Asia/Tokyo" },
  { name: "Beijing", nameKo: "\uBCA0\uC774\uC9D5", country: "CN", longitudeDeg: 116.4, timezone: "Asia/Shanghai" },
  { name: "Shanghai", nameKo: "\uC0C1\uD558\uC774", country: "CN", longitudeDeg: 121.47, timezone: "Asia/Shanghai" },
  { name: "Guangzhou", nameKo: "\uAD11\uC800\uC6B0", country: "CN", longitudeDeg: 113.27, timezone: "Asia/Shanghai" },
  { name: "Chengdu", nameKo: "\uCCAD\uB450", country: "CN", longitudeDeg: 104.07, timezone: "Asia/Shanghai" },
  { name: "Xi'an", nameKo: "\uC2DC\uC548", country: "CN", longitudeDeg: 108.95, timezone: "Asia/Shanghai" }
];

// src/time/cityLookup.ts
var CITIES = cities_default;
function findCity(query) {
  const q = query.trim().toLowerCase();
  return CITIES.find(
    (c) => c.name.toLowerCase() === q || c.nameKo.toLowerCase() === q
  );
}
function searchCities(prefix, limit = 20) {
  const q = prefix.trim().toLowerCase();
  if (q.length === 0) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().startsWith(q) || c.nameKo.toLowerCase().startsWith(q)
  ).slice(0, limit);
}

// src/time/trueSolar.ts
var STANDARD_LONGITUDE_BY_TZ = {
  "Asia/Seoul": 135,
  "Asia/Tokyo": 135,
  "Asia/Shanghai": 120
};
var HOUR_BRANCHES = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
function resolveTrueSolar(input) {
  const standardLng = STANDARD_LONGITUDE_BY_TZ[input.timezone];
  if (standardLng === void 0) {
    throw new Error(
      `Unsupported timezone: ${input.timezone}. Supported: Asia/Seoul, Asia/Tokyo, Asia/Shanghai`
    );
  }
  const minutesOffset = Math.round((input.longitudeDeg - standardLng) * 4);
  const hourKnown = input.birthTimeLocal.length > 0;
  if (!hourKnown) {
    const utc = /* @__PURE__ */ new Date(`${input.birthDateLocal}T00:00:00${tzOffset(input.timezone)}`);
    return { utcInstant: utc, trueSolarMinutesOffset: minutesOffset, hourKnown: false };
  }
  const wallClock = /* @__PURE__ */ new Date(`${input.birthDateLocal}T${input.birthTimeLocal}:00${tzOffset(input.timezone)}`);
  const trueSolar = new Date(wallClock.getTime() + minutesOffset * 6e4);
  const trueSolarLocalMinutes = (trueSolar.getUTCHours() * 60 + trueSolar.getUTCMinutes() + tzHourMinutes(input.timezone)) % 1440;
  const cycleOffset = (trueSolarLocalMinutes + 60) % 120;
  const ambiguity = cycleOffset <= 5 || cycleOffset >= 115;
  let ambiguityWindow;
  if (ambiguity) {
    const branchIdx = Math.floor((trueSolarLocalMinutes + 60) % 1440 / 120);
    let prev;
    let next;
    if (cycleOffset <= 5) {
      prev = HOUR_BRANCHES[(branchIdx + 11) % 12];
      next = HOUR_BRANCHES[branchIdx];
    } else {
      prev = HOUR_BRANCHES[branchIdx];
      next = HOUR_BRANCHES[(branchIdx + 1) % 12];
    }
    ambiguityWindow = {
      boundaryHour: Math.round(trueSolarLocalMinutes / 60),
      candidateBranches: [prev, next]
    };
  }
  return {
    utcInstant: trueSolar,
    trueSolarMinutesOffset: minutesOffset,
    ambiguityWindow,
    hourKnown: true
  };
}
function tzOffset(timezone) {
  const offsets = {
    "Asia/Seoul": "+09:00",
    "Asia/Tokyo": "+09:00",
    "Asia/Shanghai": "+08:00"
  };
  return offsets[timezone] ?? "+00:00";
}
function tzHourMinutes(timezone) {
  const offsets = {
    "Asia/Seoul": 9 * 60,
    "Asia/Tokyo": 9 * 60,
    "Asia/Shanghai": 8 * 60
  };
  return offsets[timezone] ?? 0;
}

// src/consensus/index.ts
import { Solar as Solar6 } from "lunar-javascript";
import KoreanLunarCalendar from "korean-lunar-calendar";
function verifyConsensus(input) {
  if (input.calendar !== "solar") {
    throw new Error("lunar input not yet supported");
  }
  const [y, m, d] = input.birthDateLocal.split("-").map(Number);
  const ec = Solar6.fromYmdHms(y, m, d, 12, 0, 0).getLunar().getEightChar();
  const libA = {
    stem: ec.getDayGan(),
    branch: ec.getDayZhi()
  };
  const klc = new KoreanLunarCalendar();
  const valid = klc.setSolarDate(y, m, d);
  if (!valid) {
    throw new Error(`korean-lunar-calendar: invalid date ${input.birthDateLocal}`);
  }
  const dayStr = klc.getChineseGapja().day;
  const libB = {
    stem: dayStr.charAt(0),
    branch: dayStr.charAt(1)
  };
  if (libA.stem === libB.stem && libA.branch === libB.branch) {
    return { ok: true, dayPillar: libA };
  }
  return { ok: false, libA, libB };
}

// src/core/shensha.ts
var GAEGANG_PAIRS = [
  { stem: "\u58EC", branch: "\u8FB0" },
  { stem: "\u5E9A", branch: "\u8FB0" },
  { stem: "\u5E9A", branch: "\u620C" },
  { stem: "\u620A", branch: "\u620C" }
];
var CHEONEUL_TABLE = {
  \u7532: ["\u4E11", "\u672A"],
  \u4E59: ["\u5B50", "\u7533"],
  \u4E19: ["\u4EA5", "\u9149"],
  \u4E01: ["\u4EA5", "\u9149"],
  \u620A: ["\u4E11", "\u672A"],
  \u5DF1: ["\u5B50", "\u7533"],
  \u5E9A: ["\u4E11", "\u672A"],
  \u8F9B: ["\u5BC5", "\u5348"],
  \u58EC: ["\u536F", "\u5DF3"],
  \u7678: ["\u536F", "\u5DF3"]
};
var DOHWA_BY_YEAR_BRANCH = {
  \u7533: "\u9149",
  \u5B50: "\u9149",
  \u8FB0: "\u9149",
  \u5BC5: "\u536F",
  \u5348: "\u536F",
  \u620C: "\u536F",
  \u5DF3: "\u5348",
  \u9149: "\u5348",
  \u4E11: "\u5348",
  \u4EA5: "\u5B50",
  \u536F: "\u5B50",
  \u672A: "\u5B50"
};
function computeShensha(pillars) {
  const result = [];
  const dayStem = pillars.day.stem;
  const yearBranch = pillars.year.branch;
  if (GAEGANG_PAIRS.some((p) => p.stem === pillars.day.stem && p.branch === pillars.day.branch)) {
    result.push({
      name: "\uAD34\uAC15",
      hanja: "\u9B41\u7F61",
      pillar: "day",
      meaning: "\uCD1D\uBA85\uD558\uACE0 \uC758\uC9C0 \uAC15\uD568. \uADF9\uB2E8\uC131 \uC8FC\uC758."
    });
  }
  const cheonEulBranches = CHEONEUL_TABLE[dayStem];
  ["year", "month", "day", "hour"].forEach((p) => {
    const pillar = pillars[p];
    if (pillar && cheonEulBranches.includes(pillar.branch)) {
      result.push({
        name: "\uCC9C\uC744\uADC0\uC778",
        hanja: "\u5929\u4E59\u8CB4\u4EBA",
        pillar: p,
        meaning: "\uADC0\uC778\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC74C. \uC704\uAE30 \uC2DC \uC870\uB825\uC790 \uCD9C\uD604."
      });
    }
  });
  const dohwaBranch = DOHWA_BY_YEAR_BRANCH[yearBranch];
  if (pillars.day.branch === dohwaBranch) {
    result.push({
      name: "\uB3C4\uD654",
      hanja: "\u6843\u82B1",
      pillar: "day",
      meaning: "\uC778\uAE30\xB7\uB9E4\uB825 \uAC15\uD568. \uC774\uC131 \uAD00\uACC4 \uC8FC\uC758."
    });
  }
  if (pillars.hour && pillars.hour.branch === dohwaBranch) {
    result.push({
      name: "\uB3C4\uD654",
      hanja: "\u6843\u82B1",
      pillar: "hour",
      meaning: "\uC778\uAE30\xB7\uB9E4\uB825 \uAC15\uD568. \uC774\uC131 \uAD00\uACC4 \uC8FC\uC758."
    });
  }
  return result;
}

// src/core/interactions.ts
var SIX_HAP = [
  ["\u5B50", "\u4E11"],
  ["\u5BC5", "\u4EA5"],
  ["\u536F", "\u620C"],
  ["\u8FB0", "\u9149"],
  ["\u5DF3", "\u7533"],
  ["\u5348", "\u672A"]
];
var CHONG_PAIRS = [
  ["\u5B50", "\u5348"],
  ["\u4E11", "\u672A"],
  ["\u5BC5", "\u7533"],
  ["\u536F", "\u9149"],
  ["\u8FB0", "\u620C"],
  ["\u5DF3", "\u4EA5"]
];
var HYUNG_GROUPS = [
  { type: "\uC0BC\uD615", branches: ["\u5BC5", "\u5DF3", "\u7533"] },
  { type: "\uC0BC\uD615", branches: ["\u4E11", "\u620C", "\u672A"] },
  { type: "\uC0C1\uD615", branches: ["\u5B50", "\u536F"] },
  { type: "\uC790\uD615", branches: ["\u8FB0", "\u8FB0"] },
  { type: "\uC790\uD615", branches: ["\u5348", "\u5348"] },
  { type: "\uC790\uD615", branches: ["\u9149", "\u9149"] },
  { type: "\uC790\uD615", branches: ["\u4EA5", "\u4EA5"] }
];
function computeInteractions(pillars) {
  const branches = [
    pillars.year.branch,
    pillars.month.branch,
    pillars.day.branch,
    pillars.hour?.branch
  ].filter((b) => b != null);
  const hap = SIX_HAP.filter(([a, b]) => branches.includes(a) && branches.includes(b)).map(([a, b]) => ({ branches: [a, b], type: "\uC721\uD569" }));
  const chong = CHONG_PAIRS.filter(([a, b]) => branches.includes(a) && branches.includes(b)).map(([a, b]) => ({ branches: [a, b], type: "\uCDA9" }));
  const hyung = [];
  for (const group of HYUNG_GROUPS) {
    if (group.type === "\uC790\uD615") {
      const target = group.branches[0];
      const count = branches.filter((b) => b === target).length;
      if (count >= 2) {
        hyung.push({ type: "\uC790\uD615", branches: [target, target] });
      }
    } else {
      const allPresent = group.branches.every((b) => branches.includes(b));
      if (allPresent) {
        hyung.push({ type: group.type, branches: [...group.branches] });
      }
    }
  }
  return { hap, chong, hyung };
}

// src/adapters/ko/lifetime.ts
function buildLifetimeKo(chart, _ctx) {
  const gyeokguk = chart.pattern || "\uBBF8\uD655\uC815";
  return {
    school: "ko",
    pillarsAnnotated: [],
    formatGyeokguk: {
      name: gyeokguk,
      reasoning: `\uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4 \u2014 \uC6D4\uC9C0 \uAE30\uBC18 \uACA9\uAD6D ${gyeokguk}`
    },
    yongshin: void 0,
    daeunHighlights: [],
    careerHints: ["\uC5F0\uAD6C\xB7\uC804\uB7B5\uAE30\uD68D\xB7\uAD50\uC721\xB7\uC790\uC601\uC5C5"],
    relationshipHints: ["\uC9C0\uC801\xB7\uAE4A\uC774 \uC788\uB294 \uB300\uD654 \uD1B5\uD558\uB294 \uD30C\uD2B8\uB108"],
    healthHints: ["\uBD04 \u536F\u6708 \uCD9C\uC0DD, \u6728\u65FA\xB7\u6C34\uAC15 \u2014 \uC2E0\uC7A5\xB7\uD558\uCCB4 \uC21C\uD658 + \u706B\u571F \uBCF4\uAC15"],
    cautions: [
      "\uC2E0\uC0B4: \uAD34\uAC15\xB7\uB3C4\uD654 \u2014 \uC790\uC874\uC2EC \uACFC\xB7\uD45C\uD604 \uC9C1\uC124 \uC8FC\uC758",
      "v0.1: \uC6A9\uC2E0(yongshin) \uBBF8\uC801\uC6A9 \u2014 \uD55C\uAD6D\uC2DD \uC5B5\uBD80\xB7\uC870\uD6C4 \uD63C\uD569 \uC6A9\uC2E0 v0.2 \uC801\uC6A9 \uC608\uC815"
    ],
    schoolSpecific: {
      method: "\uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4+\uC2E0\uC0B4",
      system: "\uD55C\uAD6D\uC2DD \uC790\uD3C9"
    }
  };
}

// src/adapters/cn-ziping/lifetime.ts
function buildLifetimeCnZiping(chart, _ctx) {
  const gyeokguk = chart.pattern || "\uBBF8\uD655\uC815";
  return {
    school: "cn-ziping",
    pillarsAnnotated: [],
    formatGyeokguk: {
      name: gyeokguk,
      reasoning: `\uC790\uD3C9\uC9C4\uC804 \u2014 \uC6D4\uC9C0 \uACA9\uAD6D + \uCC9C\uAC04 \uD22C\uCD9C (${gyeokguk})`
    },
    yongshin: void 0,
    daeunHighlights: [],
    careerHints: ["\uC804\uBB38\uC9C1\xB7\uC790\uC601\uC5C5\xB7\uAE30\uC220 \u2014 \uACA9\uAD6D \uB530\uB77C \uC7AC\uC131 \uD65C\uC6A9"],
    relationshipHints: ["\uACA9\uAD6D \uD638\uD658 \u2014 \uC6A9\uC2E0 \uB3D9\uC870 \uD30C\uD2B8\uB108"],
    healthHints: ["\uC801\uCC9C\uC218 \uC5B5\uBD80 \u2014 \uC2E0\uAC15\xB7\uC2E0\uC57D \uADE0\uD615, \uBD80\uC871\uD55C \uC624\uD589\uC774 \uC57D\uD55C \uC7A5\uBD80"],
    cautions: [
      "\uACA9\uAD6D\uC774 \uAE68\uC9C0\uB294 \uB300\uC6B4(\uD30C\uACA9\xB7\u7834\u683C)\uC5D0 \uD070 \uBCC0\uB3D9 \uC8FC\uC758",
      "v0.1: yongshinMethod \uC120\uC5B8\uB9CC, yongshin \uAC12 \uBBF8\uAD6C\uD604 \u2014 Phase 5 silent gap \uC8FC\uC758"
    ],
    schoolSpecific: {
      gyeokgukOrigin: "\uC790\uD3C9\uC9C4\uC804",
      yongshinMethod: "\uC5B5\uBD80",
      system: "\uC790\uD3C9\uC9C4\uC804"
    }
  };
}

// src/adapters/cn-mangpai/lifetime.ts
function buildLifetimeCnMangpai(chart, ctx) {
  const dayBranch = chart.pillars.day.branch;
  const yearBranch = chart.pillars.year.branch;
  const daeun = ctx?.daeun ?? [];
  const eunggi = daeun.flatMap((d) => {
    const matches = [];
    if (d.branch === dayBranch) {
      matches.push({
        startAge: d.startAge,
        pillar: `${d.stem}${d.branch}`,
        target: "day",
        eventType: "\uBCF8\uC778 \uBCC0\uD654",
        note: "\uB9F9\uD30C \uB2E8\uAC74\uC5C5 \uB2E8\uC21C\uD654 \u2014 \uC77C\uC9C0 \uC77C\uCE58 \uB300\uC6B4"
      });
    }
    if (d.branch === yearBranch && yearBranch !== dayBranch) {
      matches.push({
        startAge: d.startAge,
        pillar: `${d.stem}${d.branch}`,
        target: "year",
        eventType: "\uAC00\uC871\xB7\uD658\uACBD \uBCC0\uD654",
        note: "\uB9F9\uD30C \uB2E8\uAC74\uC5C5 \uB2E8\uC21C\uD654 \u2014 \uB144\uC9C0 \uC77C\uCE58 \uB300\uC6B4"
      });
    } else if (d.branch === yearBranch && yearBranch === dayBranch) {
      matches.push({
        startAge: d.startAge,
        pillar: `${d.stem}${d.branch}`,
        target: "year",
        eventType: "\uAC00\uC871\xB7\uD658\uACBD \uBCC0\uD654 (\uC77C\uC9C0=\uB144\uC9C0 \uB3D9\uC2DC \uC751\uAE30)",
        note: "\uB9F9\uD30C \uB2E8\uAC74\uC5C5 \uB2E8\uC21C\uD654 \u2014 \uC77C\uC9C0\xB7\uB144\uC9C0 \uB3D9\uC77C \uB300\uC6B4 (\uBCF8\uC778+\uAC00\uC871 \uB3D9\uC2DC \uC751\uAE30)"
      });
    }
    return matches;
  });
  const daeunHighlights = eunggi.map((e) => ({
    startAge: e.startAge,
    pillar: e.target,
    significance: "\uBCC0\uD654",
    reason: `${e.pillar} \u2014 ${e.eventType}`
  }));
  const gyeokguk = chart.pattern || "\uBBF8\uD655\uC815";
  return {
    school: "cn-mangpai",
    pillarsAnnotated: [],
    formatGyeokguk: {
      name: "\uB9F9\uD30C\uB294 \uACA9\uAD6D \uC57D\uD654",
      reasoning: `\u7269\u8C61 \uC911\uC2EC \u2014 \uC0AC\uAC74\uC131 \uB9E4\uD551 \uC6B0\uC120 (\uCC38\uACE0 \uACA9\uAD6D: ${gyeokguk})`
    },
    yongshin: void 0,
    daeunHighlights,
    careerHints: ["\uC9C1\uC5C5 \uBCC0\uD654\uB294 \uC77C\uC9C0 \uCDA9\uD569 \uB300\uC6B4\uC5D0 \uC9D1\uC911"],
    relationshipHints: ["\uBC30\uC6B0\uC790 = \uC77C\uC9C0. \uC77C\uC9C0 \uCDA9 \uB300\uC6B4\uC5D0 \uD070 \uBCC0\uB3D9"],
    healthHints: ["\uC751\uAE30 \uC2DC\uC810\uC5D0 \uAC74\uAC15 \uC0AC\uAC74 \uAC00\uB2A5"],
    cautions: [
      "\uC751\uAE30\uB294 \uD655\uB960\uC801, \uC808\uB300\uAC12 \uC544\uB2D8",
      "v0.1: \uC6A9\uC2E0(yongshin) \uBBF8\uC801\uC6A9 \u2014 \uB9F9\uD30C \uBCF8\uACA9 \uBD84\uC11D\uC740 v0.2 \uC774\uD6C4"
    ],
    schoolSpecific: { eunggi, system: "\uB2E8\uAC74\uC5C5 \uB2E8\uC21C\uD654" }
  };
}

// src/adapters/jp/lifetime.ts
function buildLifetimeJp(_chart, ctx) {
  const trueSolar = ctx?.trueSolar;
  let accuracy;
  if (!trueSolar) {
    accuracy = "\uC9C4\uD0DC\uC591\uC2DC \uBBF8\uC0C1 \u2014 \uCD94\uBA85\uD559 \uC815\uD655\uB3C4 \u26A0";
  } else if (trueSolar.hourKnown) {
    accuracy = `\uC9C4\uD0DC\uC591\uC2DC \uBCF4\uC815 ${trueSolar.trueSolarMinutesOffset}\uBD84 \u2014 \uC2DC\uC8FC \uC2E0\uB8B0 \uAC00\uB2A5`;
  } else {
    accuracy = "\uC2DC\uC8FC \uBBF8\uC0C1 \u2014 \uCD94\uBA85\uD559 \uC815\uD655\uB3C4 \u26A0";
  }
  return {
    school: "jp",
    pillarsAnnotated: [],
    formatGyeokguk: { name: "\uCD94\uBA85\uD559\uC740 \uACA9\uAD6D \uB2E8\uC21C\uD654", reasoning: "\uD1B5\uBCC0\uC131 + 12\uAD81 \uC911\uC2EC" },
    yongshin: void 0,
    daeunHighlights: [],
    careerHints: ["\uC77C\uBCF8 \uCC98\uC138 \u2014 \uD1B5\uBCC0\uC131 \uBD84\uD3EC \uAE30\uC900"],
    relationshipHints: ["12\uAD81 \u2014 \uBD80\uBD80\uAD81\xB7\uC790\uB140\uAD81 \uBD84\uB9AC"],
    healthHints: ["\uC624\uC7A5\uC721\uBD80 \uB9E4\uD551 = \uD1B5\uBCC0\uC131"],
    cautions: ["\uD559\uD30C \uB2E4\uC591\uC131\xB7\uC2EC\uB3C4 \uB0AE\uC74C \u2014 \uBCF4\uC870 \uAD00\uC810"],
    schoolSpecific: { accuracy, system: "\uC544\uBCA0 \uB2E4\uC774\uC794 \uCD94\uBA85\uD559 \uB2E8\uC21C\uD654" }
  };
}

// src/compose/resolveChartContext.ts
function resolveChartContext(input) {
  const trueSolar = resolveTrueSolar(input);
  const consensus = verifyConsensus({
    birthDateLocal: input.birthDateLocal,
    calendar: input.calendar
  });
  if (!consensus.ok) {
    const error = {
      code: "LIBRARY_MISMATCH",
      message: "\uB9CC\uC138\uB825 \uB77C\uC774\uBE0C\uB7EC\uB9AC \uACB0\uACFC \uBD88\uC77C\uCE58",
      details: { libA: consensus.libA, libB: consensus.libB }
    };
    return { ok: false, error };
  }
  const chart = computeSajuChart({
    birthDate: input.birthDateLocal,
    birthTime: input.birthTimeLocal,
    calendar: input.calendar,
    gender: input.gender,
    birthCity: null
  });
  const daeun = computeMajorFortunes({
    birthDate: input.birthDateLocal,
    birthTime: input.birthTimeLocal,
    calendar: input.calendar,
    gender: input.gender
  });
  return { ok: true, value: { chart, daeun, trueSolar } };
}

// src/compose/lifetime.ts
function deriveDaeunDirection(yearStem, gender) {
  const stemIndex = STEMS.indexOf(yearStem);
  const isYang = stemIndex % 2 === 0;
  const forwardConditions = isYang && gender === "male" || !isYang && gender === "female";
  return forwardConditions ? "forward" : "backward";
}
function safeFrame(fn, school) {
  try {
    return fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      school,
      pillarsAnnotated: [],
      formatGyeokguk: { name: "\uBD84\uC11D \uC2E4\uD328", reasoning: message },
      yongshin: void 0,
      daeunHighlights: [],
      careerHints: [],
      relationshipHints: [],
      healthHints: [],
      cautions: ["\uC774 \uD559\uD30C \uBD84\uC11D\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4."],
      schoolSpecific: { error: message }
    };
  }
}
function buildTriNationLifetime(input) {
  const ctx = resolveChartContext(input);
  if (!ctx.ok) return ctx;
  const { chart, daeun: daeunRaw, trueSolar } = ctx.value;
  const shensha = computeShensha(chart.pillars);
  const interactions = computeInteractions(chart.pillars);
  const extendedChart = {
    shensha,
    interactions,
    trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset,
    ...trueSolar.ambiguityWindow ? {
      hourAmbiguity: {
        boundaryHour: trueSolar.ambiguityWindow.boundaryHour,
        candidateBranches: trueSolar.ambiguityWindow.candidateBranches
      }
    } : {}
  };
  const direction = deriveDaeunDirection(chart.pillars.year.stem, input.gender);
  const daeun = {
    startAge: daeunRaw[0]?.startAge ?? 0,
    direction
  };
  const ctxShared = {
    daeun: daeunRaw,
    trueSolar: { trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset, hourKnown: trueSolar.hourKnown }
  };
  const frames = {
    ko: safeFrame(() => buildLifetimeKo(chart, ctxShared), "ko"),
    cnZiping: safeFrame(() => buildLifetimeCnZiping(chart, ctxShared), "cn-ziping"),
    cnMangpai: safeFrame(() => buildLifetimeCnMangpai(chart, ctxShared), "cn-mangpai"),
    jp: safeFrame(() => buildLifetimeJp(chart, ctxShared), "jp")
  };
  const gyeokgukSchools = {
    ko: frames.ko.formatGyeokguk.name,
    "cn-ziping": frames.cnZiping.formatGyeokguk.name,
    "cn-mangpai": frames.cnMangpai.formatGyeokguk.name,
    jp: frames.jp.formatGyeokguk.name
  };
  const gyeokgukConsensus = new Set(Object.values(gyeokgukSchools)).size === 1;
  const yongshinConflicts = [];
  return {
    ok: true,
    value: {
      chart: extendedChart,
      rawChart: chart,
      daeun,
      trueSolar: {
        trueSolarMinutesOffset: trueSolar.trueSolarMinutesOffset,
        hourKnown: trueSolar.hourKnown
      },
      frames,
      crossCheck: {
        pillarsAgree: true,
        gyeokgukConsensus: { consensus: gyeokgukConsensus, schools: gyeokgukSchools },
        yongshinConflicts
      }
    }
  };
}

// src/lib/jonggyeok.ts
function buildJonggyeokYongshin(shen) {
  if (!shen.jonggyeokKind || !shen.jonggyeokRole) return null;
  const primary = roleToElement(shen.dayElement, shen.jonggyeokRole);
  const insungEl = PRODUCED_BY[shen.dayElement];
  const gisin = [shen.dayElement, insungEl];
  const verdictKor = shen.verdict === "\uC885\uC544" ? "\uC885\uC544\uACA9" : shen.verdict === "\uC885\uC7AC" ? "\uC885\uC7AC\uACA9" : "\uC885\uC0B4\uACA9";
  const r = shen.roleCountExtended;
  const rationale = `\uC778\uC131 ${r.\uC778\uC131}\xB7\uBE44\uAC81 ${r.\uBE44\uAC81} \uC57D\uD568, ${shen.jonggyeokRole} ${r[shen.jonggyeokRole]} \uC6B0\uC138 \u2014 ${shen.jonggyeokKind} ${verdictKor}\uC73C\uB85C ${shen.jonggyeokRole}\uC758 \uD750\uB984\uC744 \uB530\uB978\uB2E4`;
  return { primary, gisin, rationale };
}

// src/lib/gyeokguk-yongshin.ts
var GYEOKGUK_RULES = {
  "\u50B7\u5B98\u683C": {
    "\uC2E0\uAC15": { primary: "\uC7AC\uC131", gisin: ["\uC778\uC131", "\uBE44\uAC81"], pattern: "\u50B7\u5B98\u751F\u8CA1", rationale: "\uC2E0\uAC15 \uC0C1\uAD00\uACA9 \u2014 \uC7AC\uC131\uC73C\uB85C \uC0C1\uAD00\uC744 \uD758\uB824 \uBCF4\uB0C4" },
    "\uC2E0\uC57D": { primary: "\uC778\uC131", gisin: ["\uC2DD\uC0C1", "\uC7AC\uC131"], pattern: "\u50B7\u5B98\u4F69\u5370", rationale: "\uC2E0\uC57D \uC0C1\uAD00\uACA9 \u2014 \uC778\uC131\uC73C\uB85C \uC0C1\uAD00\uC744 \uC81C\uC5B4" }
  },
  "\u6B63\u5B98\u683C": {
    "\uC2E0\uAC15": { primary: "\uC7AC\uC131", gisin: ["\uBE44\uAC81"], pattern: "\u8CA1\u5B98\u76F8\u751F", rationale: "\uC2E0\uAC15 \uC815\uAD00\uACA9 \u2014 \uC7AC\uC131\uC774 \uAD00\uC131\uC744 \uC0DD\uD568" },
    "\uC2E0\uC57D": { primary: "\uC778\uC131", gisin: ["\uC7AC\uC131", "\uC2DD\uC0C1"], pattern: "\u5B98\u5370\u76F8\u751F", rationale: "\uC2E0\uC57D \uC815\uAD00\uACA9 \u2014 \uAD00\uC131\uC774 \uC778\uC131\uC744 \uC0DD\uD568" }
  },
  "\u8CA1\u683C": {
    "\uC2E0\uAC15": { primary: "\uC2DD\uC0C1", gisin: ["\uC778\uC131", "\uBE44\uAC81"], pattern: "\u98DF\u50B7\u751F\u8CA1", rationale: "\uC2E0\uAC15 \uC7AC\uC131\uACA9 \u2014 \uC2DD\uC0C1\uC774 \uC7AC\uC131\uC744 \uC0DD\uD568" },
    "\uC2E0\uC57D": { primary: "\uBE44\uAC81", gisin: ["\uC7AC\uC131", "\uAD00\uC131"], pattern: "\u6BD4\u52AB\u5236\u8CA1", rationale: "\uC2E0\uC57D \uC7AC\uC131\uACA9 \u2014 \uBE44\uAC81\uC73C\uB85C \uC7AC\uC131\uC744 \uB2E4\uC2A4\uB9BC" }
  },
  "\u504F\u5370\u683C": {
    "\uC2E0\uAC15": { primary: "\uC2DD\uC0C1", gisin: ["\uC778\uC131", "\uBE44\uAC81"], pattern: "\u98DF\u795E\u5236\u504F\u5370", rationale: "\uC2E0\uAC15 \uD3B8\uC778\uACA9 \u2014 \uC2DD\uC2E0\uC73C\uB85C \uD3B8\uC778\uC744 \uC81C\uC5B4" },
    "\uC2E0\uC57D": { primary: "\uBE44\uAC81", gisin: ["\uC7AC\uC131", "\uC2DD\uC0C1"], pattern: "\u5370\u6BD4\u76F8\u751F", rationale: "\uC2E0\uC57D \uD3B8\uC778\uACA9 \u2014 \uC778\uC131\uACFC \uBE44\uAC81\uC774 \uC0C1\uC0DD" }
  }
};
function buildGyeokgukYongshin(chart, shen, gyeokguk) {
  if (shen.jonggyeokKind) return null;
  if (shen.verdict !== "\uC2E0\uAC15" && shen.verdict !== "\uC2E0\uC57D") return null;
  const rules = GYEOKGUK_RULES[gyeokguk];
  if (!rules) return null;
  const dayEl = STEM_ELEMENT[chart.pillars.day.stem];
  const entry = rules[shen.verdict];
  return {
    primary: roleToElement(dayEl, entry.primary),
    gisin: entry.gisin.map((r) => roleToElement(dayEl, r)),
    pattern: entry.pattern,
    rationale: entry.rationale
  };
}

// src/adapters/ko/yongshin.ts
var PRODUCES2 = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};
var PRODUCED_BY2 = {
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
  wood: "water"
};
var CONTROLS2 = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"
};
var BRANCH_SEASON = {
  \u5BC5: "\uBD04",
  \u536F: "\uBD04",
  \u8FB0: "\uBD04",
  \u5DF3: "\uC5EC\uB984",
  \u5348: "\uC5EC\uB984",
  \u672A: "\uC5EC\uB984",
  \u7533: "\uAC00\uC744",
  \u9149: "\uAC00\uC744",
  \u620C: "\uAC00\uC744",
  \u4EA5: "\uACA8\uC6B8",
  \u5B50: "\uACA8\uC6B8",
  \u4E11: "\uACA8\uC6B8"
};
function computeJohuMode(monthBranch) {
  const season = BRANCH_SEASON[monthBranch];
  if (season === "\uACA8\uC6B8") return "\uD55C\uB7AD";
  if (season === "\uC5EC\uB984") return "\uC870\uC5F4";
  return "\uADE0\uD615";
}
function buildYongshinKo(chart) {
  const shen = computeShenStrength(chart);
  const johu = computeJohuMode(chart.pillars.month.branch);
  const dayElement = STEM_ELEMENT[chart.pillars.day.stem];
  let secondary;
  if (johu === "\uD55C\uB7AD") secondary = "fire";
  else if (johu === "\uC870\uC5F4") secondary = "water";
  const jong = buildJonggyeokYongshin(shen);
  if (jong) {
    return {
      school: "ko",
      primary: jong.primary,
      secondary,
      gisin: jong.gisin,
      basisShenStrength: shen.verdict,
      basisJohuMode: johu,
      rationale: jong.rationale
    };
  }
  const gyeok = buildGyeokgukYongshin(chart, shen, chart.pattern);
  if (gyeok) {
    return {
      school: "ko",
      primary: gyeok.primary,
      secondary,
      gisin: gyeok.gisin,
      basisShenStrength: shen.verdict,
      basisJohuMode: johu,
      rationale: gyeok.rationale
    };
  }
  let primary;
  let gisin;
  if (shen.verdict === "\uC2E0\uAC15") {
    primary = PRODUCES2[dayElement];
    gisin = [PRODUCED_BY2[dayElement], dayElement];
  } else if (shen.verdict === "\uC2E0\uC57D") {
    primary = PRODUCED_BY2[dayElement];
    gisin = [PRODUCES2[dayElement], CONTROLS2[dayElement]];
  } else {
    primary = PRODUCES2[dayElement];
    gisin = [];
  }
  if (secondary && gisin.includes(secondary)) {
    [primary, secondary] = [secondary, primary];
    gisin = gisin.filter((g) => g !== primary);
  }
  return {
    school: "ko",
    primary,
    secondary,
    gisin,
    basisShenStrength: shen.verdict,
    basisJohuMode: johu
  };
}

// src/adapters/ko/yearly.ts
function yearGanjiOf(year) {
  const diff = ((year - 1984) % 60 + 60) % 60;
  return { stem: STEMS[diff % 10], branch: BRANCHES[diff % 12] };
}
var BRANCH_CONFLICTS = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function findCurrentDaeun(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildYearlyKo(args) {
  const { chart, daeun, targetYear, yongShin, currentAge } = args;
  const yearGanji = yearGanjiOf(targetYear);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun(daeun, currentAge);
  const willTransitionThisYear = !!nextDaeun && nextDaeun.startAge === currentAge + 1;
  const daeunTransition = willTransitionThisYear && nextDaeun ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
    if (BRANCH_COMBOS[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
  }
  const yearStemEl = STEM_ELEMENT[yearGanji.stem];
  const yearBranchEl = BRANCH_ELEMENT[yearGanji.branch];
  const reinforced = [];
  const weakened = [];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  for (const el of [yearStemEl, yearBranchEl]) {
    if (el === yongShin.primary || el === yongShin.secondary || el === xishen) {
      if (!reinforced.includes(el)) reinforced.push(el);
    }
    if (yongShin.gisin.includes(el)) {
      if (!weakened.includes(el)) weakened.push(el);
    }
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "ko",
    targetYear,
    yearGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: {
      johu: `${yongShin.basisJohuMode} \uC870\uD6C4 \uAE30\uC900 ${yongShin.secondary ?? "\uBCF4\uC870 \uC6A9\uC2E0 \uC5C6\uC74C"} \uBCF4\uAC15`
    },
    shensha: [],
    // v0.2 는 결합 신살 skip (v0.3 도입)
    yongShinUsed: yongShin
  };
}

// src/adapters/cn-ziping/yongshin.ts
var PRODUCES3 = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};
var PRODUCED_BY3 = {
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
  wood: "water"
};
var CONTROLS3 = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"
};
function buildYongshinCnZiping(chart) {
  const shen = computeShenStrength(chart);
  const dayElement = STEM_ELEMENT[chart.pillars.day.stem];
  const jong = buildJonggyeokYongshin(shen);
  if (jong) {
    return {
      school: "cn-ziping",
      primary: jong.primary,
      gisin: jong.gisin,
      basisShenStrength: shen.verdict,
      structureHint: "\uAE30\uD0C0",
      rationale: jong.rationale
    };
  }
  const gyeok = buildGyeokgukYongshin(chart, shen, chart.pattern);
  if (gyeok) {
    let structureHint2 = "\uAE30\uD0C0";
    if (gyeok.pattern === "\u98DF\u50B7\u751F\u8CA1") structureHint2 = "\uC2DD\uC2E0\uC0DD\uC7AC";
    else if (gyeok.pattern === "\u5B98\u5370\u76F8\u751F") structureHint2 = "\uAD00\uC778\uC0C1\uC0DD";
    return {
      school: "cn-ziping",
      primary: gyeok.primary,
      gisin: gyeok.gisin,
      basisShenStrength: shen.verdict,
      structureHint: structureHint2,
      rationale: gyeok.rationale
    };
  }
  let primary;
  let gisin;
  if (shen.verdict === "\uC2E0\uAC15") {
    primary = PRODUCES3[dayElement];
    gisin = [PRODUCED_BY3[dayElement], dayElement];
  } else if (shen.verdict === "\uC2E0\uC57D") {
    primary = PRODUCED_BY3[dayElement];
    gisin = [PRODUCES3[dayElement], CONTROLS3[dayElement]];
  } else {
    primary = PRODUCES3[dayElement];
    gisin = [];
  }
  let structureHint = "\uAE30\uD0C0";
  if (shen.verdict === "\uC2E0\uAC15" && shen.roleCount["\uC2DD\uC0C1"] >= 1 && shen.roleCount["\uC7AC\uC131"] >= 1) {
    structureHint = "\uC2DD\uC2E0\uC0DD\uC7AC";
  } else if (shen.verdict === "\uC2E0\uC57D" && shen.roleCount["\uAD00\uC131"] >= 1 && shen.roleCount["\uC778\uC131"] >= 1) {
    structureHint = "\uAD00\uC778\uC0C1\uC0DD";
  }
  return {
    school: "cn-ziping",
    primary,
    gisin,
    basisShenStrength: shen.verdict,
    structureHint
  };
}

// src/adapters/cn-ziping/yearly.ts
var BRANCH_CONFLICTS2 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS2 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function yearGanjiOf2(year) {
  const diff = ((year - 1984) % 60 + 60) % 60;
  return { stem: STEMS[diff % 10], branch: BRANCHES[diff % 12] };
}
function findCurrentDaeun2(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildYearlyCnZiping(args) {
  const { chart, daeun, targetYear, yongShin, currentAge } = args;
  const yearGanji = yearGanjiOf2(targetYear);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun2(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS2[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
    if (BRANCH_COMBOS2[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
  }
  const yearStemEl = STEM_ELEMENT[yearGanji.stem];
  const yearBranchEl = BRANCH_ELEMENT[yearGanji.branch];
  const reinforced = [];
  const weakened = [];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  for (const el of [yearStemEl, yearBranchEl]) {
    if ((el === yongShin.primary || el === xishen) && !reinforced.includes(el)) reinforced.push(el);
    if (yongShin.gisin.includes(el) && !weakened.includes(el)) weakened.push(el);
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "cn-ziping",
    targetYear,
    yearGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: { structure: yongShin.structureHint ?? "\uAE30\uD0C0" },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/adapters/cn-mangpai/yongshin.ts
var CONTROLS4 = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"
};
var STEM_TO_YONGSHIN = {
  \u7532: "fire",
  \u4E59: "fire",
  // 木日 → 식상 火
  \u4E19: "earth",
  \u4E01: "earth",
  // 火日 → 식상 土
  \u620A: "metal",
  \u5DF1: "metal",
  // 土日 → 식상 金
  \u5E9A: "water",
  \u8F9B: "water",
  // 金日 → 식상 水
  \u58EC: "wood",
  \u7678: "wood"
  // 水日 → 식상 木
};
function buildYongshinCnMangpai(chart) {
  const { month, day } = chart.pillars;
  const dayElement = STEM_ELEMENT[day.stem];
  const primary = STEM_TO_YONGSHIN[day.stem];
  const gisin = [CONTROLS4[dayElement]];
  const monthEl = BRANCH_ELEMENT[month.branch];
  const emergenceHint = monthEl === primary ? `\uC6A9\uC2E0 ${primary} \uAC00 \uC6D4\uB839 ${month.branch} \uC5D0 \u540C\u6C23 \u2014 \uC751\uAE30 \uAC15\uB825` : `\uC6A9\uC2E0 ${primary} \uAC00 \uC6D4\uB839 ${month.branch}(${monthEl}) \uC640 \uB2E4\uB984 \u2014 \uB300\uC6B4/\uC138\uC6B4 ${primary} \uB3C4\uB798 \uC2DC \uC751\uAE30`;
  return { school: "cn-mangpai", primary, gisin, emergenceHint };
}

// src/adapters/cn-mangpai/yearly.ts
var BRANCH_CONFLICTS3 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS3 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function yearGanjiOf3(year) {
  const diff = ((year - 1984) % 60 + 60) % 60;
  return { stem: STEMS[diff % 10], branch: BRANCHES[diff % 12] };
}
function findCurrentDaeun3(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildYearlyCnMangpai(args) {
  const { chart, daeun, targetYear, yongShin, currentAge } = args;
  const yearGanji = yearGanjiOf3(targetYear);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun3(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS3[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
    if (BRANCH_COMBOS3[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
  }
  const yearStemEl = STEM_ELEMENT[yearGanji.stem];
  const yearBranchEl = BRANCH_ELEMENT[yearGanji.branch];
  const reinforced = [];
  const weakened = [];
  for (const el of [yearStemEl, yearBranchEl]) {
    if (el === yongShin.primary && !reinforced.includes(el)) reinforced.push(el);
    if (yongShin.gisin.includes(el) && !weakened.includes(el)) weakened.push(el);
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "cn-mangpai",
    targetYear,
    yearGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: { emergence: yongShin.emergenceHint },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/adapters/jp/yongshin.ts
function buildYongshinJp(_chart) {
  return {
    school: "jp",
    favorable: ["\uC7AC\uC131", "\uAD00\uC131", "\uC778\uC131"],
    unfavorable: ["\uC2DD\uC0C1", "\uBE44\uAC81"]
  };
}

// src/adapters/jp/yearly.ts
var BRANCH_CONFLICTS4 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS4 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function yearGanjiOf4(year) {
  const diff = ((year - 1984) % 60 + 60) % 60;
  return { stem: STEMS[diff % 10], branch: BRANCHES[diff % 12] };
}
function findCurrentDaeun4(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildYearlyJp(args) {
  const { chart, daeun, targetYear, yongShin, currentAge } = args;
  const yearGanji = yearGanjiOf4(targetYear);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun4(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS4[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
    if (BRANCH_COMBOS4[yearGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: yearGanji.branch
      });
    }
  }
  return {
    school: "jp",
    targetYear,
    yearGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced: [], weakened: [], netVerdict: "mixed" },
    schoolSpecificHints: {
      favorable: yongShin.favorable.join("\xB7"),
      unfavorable: yongShin.unfavorable.join("\xB7")
    },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/compose/yearly.ts
function evaluateAgreement(frames) {
  const verdicts = [
    frames.ko.yongShinDelta.netVerdict,
    frames.cnZiping.yongShinDelta.netVerdict,
    frames.cnMangpai.yongShinDelta.netVerdict
  ];
  const favorableCount = verdicts.filter((v) => v === "favorable").length;
  const unfavorableCount = verdicts.filter((v) => v === "unfavorable").length;
  const notes = [];
  if (favorableCount === 3) {
    notes.push("KO\xB7CN\uC790\uD3C9\xB7CN\uB9F9\uD30C 3\uD559\uD30C\uAC00 favorable \uD569\uC758");
    return { agreement: "high", notes };
  }
  if (unfavorableCount === 3) {
    notes.push("KO\xB7CN\uC790\uD3C9\xB7CN\uB9F9\uD30C 3\uD559\uD30C\uAC00 unfavorable \uD569\uC758");
    return { agreement: "high", notes };
  }
  if (favorableCount === 2 || unfavorableCount === 2) {
    notes.push(`3\uD559\uD30C \uC911 2\uD559\uD30C \uB3D9\uC758 (favorable=${favorableCount}, unfavorable=${unfavorableCount})`);
    return { agreement: "medium", notes };
  }
  notes.push("\uD559\uD30C\uBCC4 \uD310\uB2E8 \uBD84\uAE30 \u2014 LLM narrative \uB85C \uD559\uD30C\uBCC4 \uC785\uC7A5 \uD655\uC778 \uAD8C\uC7A5");
  return { agreement: "low", notes };
}
function buildTriNationYearly(args) {
  const { chart, daeun, targetYear, currentAge } = args;
  const yongKo = buildYongshinKo(chart);
  const yongCz = buildYongshinCnZiping(chart);
  const yongCm = buildYongshinCnMangpai(chart);
  const yongJp = buildYongshinJp(chart);
  const frames = {
    ko: buildYearlyKo({ chart, daeun, targetYear, yongShin: yongKo, currentAge }),
    cnZiping: buildYearlyCnZiping({ chart, daeun, targetYear, yongShin: yongCz, currentAge }),
    cnMangpai: buildYearlyCnMangpai({ chart, daeun, targetYear, yongShin: yongCm, currentAge }),
    jp: buildYearlyJp({ chart, daeun, targetYear, yongShin: yongJp, currentAge })
  };
  return {
    targetYear,
    frames,
    crossCheck: evaluateAgreement(frames)
  };
}
function buildTriNationYearlyFromBirth(args) {
  const ctx = resolveChartContext(args.input);
  if (!ctx.ok) return ctx;
  return {
    ok: true,
    value: buildTriNationYearly({
      chart: ctx.value.chart,
      daeun: ctx.value.daeun,
      targetYear: args.targetYear,
      currentAge: args.currentAge
    })
  };
}

// src/lib/algorithm-version.ts
var ALGORITHM_VERSION = 2;

// src/adapters/ko/monthly.ts
var BRANCH_CONFLICTS5 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS5 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function monthGanjiOf(year, month) {
  const pillars = computeMonthPillars(year);
  const p = pillars[month - 1].pillar;
  return { stem: p.stem, branch: p.branch };
}
function findCurrentDaeun5(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildMonthlyKo(args) {
  const { chart, daeun, targetYear, targetMonth, yongShin, currentAge } = args;
  const monthGanji = monthGanjiOf(targetYear, targetMonth);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun5(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS5[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
    if (BRANCH_COMBOS5[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
  }
  const monthStemEl = STEM_ELEMENT[monthGanji.stem];
  const monthBranchEl = BRANCH_ELEMENT[monthGanji.branch];
  const reinforced = [];
  const weakened = [];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  for (const el of [monthStemEl, monthBranchEl]) {
    if (el === yongShin.primary || el === yongShin.secondary || el === xishen) {
      if (!reinforced.includes(el)) reinforced.push(el);
    }
    if (yongShin.gisin.includes(el)) {
      if (!weakened.includes(el)) weakened.push(el);
    }
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "ko",
    targetYear,
    targetMonth,
    monthGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: {
      johu: `${yongShin.basisJohuMode} \uC870\uD6C4 \uAE30\uC900 ${yongShin.secondary ?? "\uBCF4\uC870 \uC6A9\uC2E0 \uC5C6\uC74C"} \uBCF4\uAC15`
    },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/adapters/cn-ziping/monthly.ts
var BRANCH_CONFLICTS6 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS6 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function monthGanjiOf2(year, month) {
  const pillars = computeMonthPillars(year);
  const p = pillars[month - 1].pillar;
  return { stem: p.stem, branch: p.branch };
}
function findCurrentDaeun6(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildMonthlyCnZiping(args) {
  const { chart, daeun, targetYear, targetMonth, yongShin, currentAge } = args;
  const monthGanji = monthGanjiOf2(targetYear, targetMonth);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun6(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS6[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
    if (BRANCH_COMBOS6[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
  }
  const monthStemEl = STEM_ELEMENT[monthGanji.stem];
  const monthBranchEl = BRANCH_ELEMENT[monthGanji.branch];
  const reinforced = [];
  const weakened = [];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  for (const el of [monthStemEl, monthBranchEl]) {
    if ((el === yongShin.primary || el === xishen) && !reinforced.includes(el)) reinforced.push(el);
    if (yongShin.gisin.includes(el) && !weakened.includes(el)) weakened.push(el);
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "cn-ziping",
    targetYear,
    targetMonth,
    monthGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: { structure: yongShin.structureHint ?? "\uAE30\uD0C0" },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/adapters/cn-mangpai/monthly.ts
var BRANCH_CONFLICTS7 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS7 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function monthGanjiOf3(year, month) {
  const pillars = computeMonthPillars(year);
  const p = pillars[month - 1].pillar;
  return { stem: p.stem, branch: p.branch };
}
function findCurrentDaeun7(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildMonthlyCnMangpai(args) {
  const { chart, daeun, targetYear, targetMonth, yongShin, currentAge } = args;
  const monthGanji = monthGanjiOf3(targetYear, targetMonth);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun7(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS7[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
    if (BRANCH_COMBOS7[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
  }
  const monthStemEl = STEM_ELEMENT[monthGanji.stem];
  const monthBranchEl = BRANCH_ELEMENT[monthGanji.branch];
  const reinforced = [];
  const weakened = [];
  for (const el of [monthStemEl, monthBranchEl]) {
    if (el === yongShin.primary && !reinforced.includes(el)) reinforced.push(el);
    if (yongShin.gisin.includes(el) && !weakened.includes(el)) weakened.push(el);
  }
  const netVerdict = reinforced.length > 0 && weakened.length === 0 ? "favorable" : weakened.length > 0 && reinforced.length === 0 ? "unfavorable" : "mixed";
  return {
    school: "cn-mangpai",
    targetYear,
    targetMonth,
    monthGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced, weakened, netVerdict },
    schoolSpecificHints: { emergence: yongShin.emergenceHint },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/adapters/jp/monthly.ts
var BRANCH_CONFLICTS8 = {
  \u5B50: "\u5348",
  \u5348: "\u5B50",
  \u4E11: "\u672A",
  \u672A: "\u4E11",
  \u5BC5: "\u7533",
  \u7533: "\u5BC5",
  \u536F: "\u9149",
  \u9149: "\u536F",
  \u8FB0: "\u620C",
  \u620C: "\u8FB0",
  \u5DF3: "\u4EA5",
  \u4EA5: "\u5DF3"
};
var BRANCH_COMBOS8 = {
  \u5B50: "\u4E11",
  \u4E11: "\u5B50",
  \u5BC5: "\u4EA5",
  \u4EA5: "\u5BC5",
  \u536F: "\u620C",
  \u620C: "\u536F",
  \u8FB0: "\u9149",
  \u9149: "\u8FB0",
  \u5DF3: "\u7533",
  \u7533: "\u5DF3",
  \u5348: "\u672A",
  \u672A: "\u5348"
};
function monthGanjiOf4(year, month) {
  const pillars = computeMonthPillars(year);
  const p = pillars[month - 1].pillar;
  return { stem: p.stem, branch: p.branch };
}
function findCurrentDaeun8(daeun, age) {
  for (let i = 0; i < daeun.length; i++) {
    const startAge = daeun[i].startAge;
    const endAge = daeun[i + 1] ? daeun[i + 1].startAge - 1 : startAge + 9;
    if (age >= startAge && age <= endAge) {
      return { d: daeun[i], endAge, nextDaeun: daeun[i + 1] };
    }
  }
  const first = daeun[0];
  const fallbackEnd = daeun[1] ? daeun[1].startAge - 1 : first.startAge + 9;
  return { d: first, endAge: fallbackEnd, nextDaeun: daeun[1] };
}
function buildMonthlyJp(args) {
  const { chart, daeun, targetYear, targetMonth, yongShin, currentAge } = args;
  const monthGanji = monthGanjiOf4(targetYear, targetMonth);
  const { d: cur, endAge, nextDaeun } = findCurrentDaeun8(daeun, currentAge);
  const daeunTransition = nextDaeun && nextDaeun.startAge === currentAge + 1 ? {
    willTransitionAt: nextDaeun.startAge,
    nextGanji: { stem: nextDaeun.stem, branch: nextDaeun.branch }
  } : null;
  const { year, month, day, hour } = chart.pillars;
  const pillars = [
    { pillar: "year", branch: year.branch },
    { pillar: "month", branch: month.branch },
    { pillar: "day", branch: day.branch }
  ];
  if (hour) pillars.push({ pillar: "hour", branch: hour.branch });
  const interactions = [];
  for (const p of pillars) {
    if (BRANCH_CONFLICTS8[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uCDA9",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
    if (BRANCH_COMBOS8[monthGanji.branch] === p.branch) {
      interactions.push({
        type: "\uD569",
        subject: { pillar: p.pillar, element: p.branch },
        object: monthGanji.branch
      });
    }
  }
  return {
    school: "jp",
    targetYear,
    targetMonth,
    monthGanji,
    currentDaeun: {
      startAge: cur.startAge,
      endAge,
      ganji: { stem: cur.stem, branch: cur.branch }
    },
    daeunTransition,
    ganjiInteractions: interactions,
    yongShinDelta: { reinforced: [], weakened: [], netVerdict: "mixed" },
    schoolSpecificHints: {
      favorable: yongShin.favorable.join("\xB7"),
      unfavorable: yongShin.unfavorable.join("\xB7")
    },
    shensha: [],
    yongShinUsed: yongShin
  };
}

// src/compose/monthly.ts
function evaluateAgreement2(frames) {
  const verdicts = [
    frames.ko.yongShinDelta.netVerdict,
    frames.cnZiping.yongShinDelta.netVerdict,
    frames.cnMangpai.yongShinDelta.netVerdict
  ];
  const favorableCount = verdicts.filter((v) => v === "favorable").length;
  const unfavorableCount = verdicts.filter((v) => v === "unfavorable").length;
  const notes = [];
  if (favorableCount === 3) {
    notes.push("KO\xB7CN\uC790\uD3C9\xB7CN\uB9F9\uD30C 3\uD559\uD30C\uAC00 favorable \uD569\uC758");
    return { agreement: "high", notes };
  }
  if (unfavorableCount === 3) {
    notes.push("KO\xB7CN\uC790\uD3C9\xB7CN\uB9F9\uD30C 3\uD559\uD30C\uAC00 unfavorable \uD569\uC758");
    return { agreement: "high", notes };
  }
  if (favorableCount === 2 || unfavorableCount === 2) {
    notes.push(`3\uD559\uD30C \uC911 2\uD559\uD30C \uB3D9\uC758 (favorable=${favorableCount}, unfavorable=${unfavorableCount})`);
    return { agreement: "medium", notes };
  }
  notes.push("\uD559\uD30C\uBCC4 \uD310\uB2E8 \uBD84\uAE30 \u2014 LLM narrative \uB85C \uD559\uD30C\uBCC4 \uC785\uC7A5 \uD655\uC778 \uAD8C\uC7A5");
  return { agreement: "low", notes };
}
function buildTriNationMonthly(args) {
  const { chart, daeun, targetYear, targetMonth, currentAge } = args;
  const yongKo = buildYongshinKo(chart);
  const yongCz = buildYongshinCnZiping(chart);
  const yongCm = buildYongshinCnMangpai(chart);
  const yongJp = buildYongshinJp(chart);
  const frames = {
    ko: buildMonthlyKo({ chart, daeun, targetYear, targetMonth, yongShin: yongKo, currentAge }),
    cnZiping: buildMonthlyCnZiping({ chart, daeun, targetYear, targetMonth, yongShin: yongCz, currentAge }),
    cnMangpai: buildMonthlyCnMangpai({ chart, daeun, targetYear, targetMonth, yongShin: yongCm, currentAge }),
    jp: buildMonthlyJp({ chart, daeun, targetYear, targetMonth, yongShin: yongJp, currentAge })
  };
  return {
    targetYear,
    targetMonth,
    frames,
    crossCheck: evaluateAgreement2(frames)
  };
}
function buildTriNationMonthlyFromBirth(args) {
  const ctx = resolveChartContext(args.input);
  if (!ctx.ok) return ctx;
  return {
    ok: true,
    value: buildTriNationMonthly({
      chart: ctx.value.chart,
      daeun: ctx.value.daeun,
      targetYear: args.targetYear,
      targetMonth: args.targetMonth,
      currentAge: args.currentAge
    })
  };
}

// src/adapters/ko/daily.ts
function buildDailyLiteKo(args) {
  const { forDate, yongShin } = args;
  const dayPillar = computeDayPillar(forDate);
  const dayStemEl = STEM_ELEMENT[dayPillar.stem];
  const dayBranchEl = BRANCH_ELEMENT[dayPillar.branch];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  const goodSet = /* @__PURE__ */ new Set([
    yongShin.primary,
    ...yongShin.secondary ? [yongShin.secondary] : [],
    ...xishen ? [xishen] : []
  ]);
  const gisinSet = new Set(yongShin.gisin);
  const dayEls = [dayStemEl, dayBranchEl];
  const goodHits = dayEls.filter((e) => goodSet.has(e)).length;
  const badHits = dayEls.filter((e) => gisinSet.has(e)).length;
  let dayVibe;
  if (goodHits >= 2 && badHits === 0) dayVibe = "auspicious";
  else if (badHits >= 2 && goodHits === 0) dayVibe = "inauspicious";
  else dayVibe = "neutral";
  const hints = [];
  hints.push(
    `\uC77C\uC9C4 ${dayPillar.stem}${dayPillar.branch} \u2014 \uCC9C\uAC04 \uC624\uD589 ${dayStemEl}, \uC9C0\uC9C0 \uC624\uD589 ${dayBranchEl}`
  );
  if (goodHits > 0) {
    hints.push(
      `\uC6A9\uC2E0 ${yongShin.primary}${yongShin.secondary ? `+${yongShin.secondary}` : ""} \uBCF4\uAC15 ${goodHits}\uAC74`
    );
  }
  if (badHits > 0) {
    hints.push(`\uAE30\uC2E0 ${yongShin.gisin.join("\xB7")} \uC790\uADF9 ${badHits}\uAC74`);
  }
  if (yongShin.basisJohuMode) {
    hints.push(`\uC870\uD6C4 \uAE30\uC900: ${yongShin.basisJohuMode}`);
  }
  return {
    school: "ko",
    forDate,
    dayGanji: { stem: dayPillar.stem, branch: dayPillar.branch },
    dayVibe,
    hints
  };
}

// src/adapters/cn-ziping/daily.ts
function buildDailyLiteCnZiping(args) {
  const { forDate, yongShin } = args;
  const dayPillar = computeDayPillar(forDate);
  const dayStemEl = STEM_ELEMENT[dayPillar.stem];
  const dayBranchEl = BRANCH_ELEMENT[dayPillar.branch];
  const PRODUCES4 = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };
  const isJonggyeok = yongShin.basisShenStrength === "\uC885\uC544" || yongShin.basisShenStrength === "\uC885\uC7AC" || yongShin.basisShenStrength === "\uC885\uC0B4";
  const xishen = isJonggyeok ? PRODUCES4[yongShin.primary] : null;
  const goodSet = /* @__PURE__ */ new Set([
    yongShin.primary,
    ...xishen ? [xishen] : []
  ]);
  const gisinSet = new Set(yongShin.gisin);
  const dayEls = [dayStemEl, dayBranchEl];
  const goodHits = dayEls.filter((e) => goodSet.has(e)).length;
  const badHits = dayEls.filter((e) => gisinSet.has(e)).length;
  let dayVibe;
  if (goodHits >= 2 && badHits === 0) dayVibe = "auspicious";
  else if (badHits >= 2 && goodHits === 0) dayVibe = "inauspicious";
  else dayVibe = "neutral";
  const hints = [];
  hints.push(
    `\uC77C\uC9C4 ${dayPillar.stem}${dayPillar.branch} \u2014 \uCC9C\uAC04 \uC624\uD589 ${dayStemEl}, \uC9C0\uC9C0 \uC624\uD589 ${dayBranchEl}`
  );
  if (yongShin.structureHint) {
    hints.push(`\uACA9\uAD6D: ${yongShin.structureHint}`);
  }
  if (goodHits > 0) hints.push(`\uC6A9\uC2E0 ${yongShin.primary} \uBCF4\uAC15 ${goodHits}\uAC74`);
  if (badHits > 0) hints.push(`\uAE30\uC2E0 ${yongShin.gisin.join("\xB7")} \uC790\uADF9 ${badHits}\uAC74`);
  return {
    school: "cn-ziping",
    forDate,
    dayGanji: { stem: dayPillar.stem, branch: dayPillar.branch },
    dayVibe,
    hints
  };
}

// src/adapters/cn-mangpai/daily.ts
function buildDailyLiteCnMangpai(args) {
  const { forDate, yongShin } = args;
  const dayPillar = computeDayPillar(forDate);
  const dayStemEl = STEM_ELEMENT[dayPillar.stem];
  const dayBranchEl = BRANCH_ELEMENT[dayPillar.branch];
  const goodSet = /* @__PURE__ */ new Set([yongShin.primary]);
  const gisinSet = new Set(yongShin.gisin);
  const dayEls = [dayStemEl, dayBranchEl];
  const goodHits = dayEls.filter((e) => goodSet.has(e)).length;
  const badHits = dayEls.filter((e) => gisinSet.has(e)).length;
  let dayVibe;
  if (goodHits >= 2 && badHits === 0) dayVibe = "auspicious";
  else if (badHits >= 2 && goodHits === 0) dayVibe = "inauspicious";
  else dayVibe = "neutral";
  const hints = [];
  hints.push(
    `\uC77C\uC9C4 ${dayPillar.stem}${dayPillar.branch} \u2014 \uCC9C\uAC04 \uC624\uD589 ${dayStemEl}, \uC9C0\uC9C0 \uC624\uD589 ${dayBranchEl}`
  );
  hints.push(`\uC751\uAE30: ${yongShin.emergenceHint}`);
  if (goodHits > 0) hints.push(`\uC6A9\uC2E0 ${yongShin.primary} \uBCF4\uAC15 ${goodHits}\uAC74`);
  if (badHits > 0) hints.push(`\uAE30\uC2E0 ${yongShin.gisin.join("\xB7")} \uC790\uADF9 ${badHits}\uAC74`);
  return {
    school: "cn-mangpai",
    forDate,
    dayGanji: { stem: dayPillar.stem, branch: dayPillar.branch },
    dayVibe,
    hints
  };
}

// src/adapters/jp/daily.ts
function buildDailyLiteJp(args) {
  const { forDate, yongShin } = args;
  const dayPillar = computeDayPillar(forDate);
  const hints = [
    `\uC77C\uC9C4 ${dayPillar.stem}${dayPillar.branch}`,
    `\uC720\uB9AC \uD1B5\uBCC0\uC131: ${yongShin.favorable.join("\xB7") || "\uC5C6\uC74C"}`,
    `\uBD88\uB9AC \uD1B5\uBCC0\uC131: ${yongShin.unfavorable.join("\xB7") || "\uC5C6\uC74C"}`
  ];
  return {
    school: "jp",
    forDate,
    dayGanji: { stem: dayPillar.stem, branch: dayPillar.branch },
    dayVibe: "neutral",
    hints
  };
}

// src/compose/daily-tri.ts
function evaluateOverallVibe(frames) {
  const vibes = [
    frames.ko.dayVibe,
    frames.cnZiping.dayVibe,
    frames.cnMangpai.dayVibe,
    frames.jp.dayVibe
  ];
  const auspiciousCount = vibes.filter((v) => v === "auspicious").length;
  const inauspiciousCount = vibes.filter((v) => v === "inauspicious").length;
  if (auspiciousCount >= 3) return "auspicious";
  if (inauspiciousCount >= 3) return "inauspicious";
  return "neutral";
}
function buildTriNationDailyLite(args) {
  const { chart, forDate } = args;
  const yongKo = buildYongshinKo(chart);
  const yongCz = buildYongshinCnZiping(chart);
  const yongCm = buildYongshinCnMangpai(chart);
  const yongJp = buildYongshinJp(chart);
  const frames = {
    ko: buildDailyLiteKo({ chart, forDate, yongShin: yongKo }),
    cnZiping: buildDailyLiteCnZiping({ chart, forDate, yongShin: yongCz }),
    cnMangpai: buildDailyLiteCnMangpai({ chart, forDate, yongShin: yongCm }),
    jp: buildDailyLiteJp({ chart, forDate, yongShin: yongJp })
  };
  return {
    forDate,
    frames,
    overallVibe: evaluateOverallVibe(frames)
  };
}
function buildTriNationDailyLiteFromBirth(args) {
  const ctx = resolveChartContext(args.input);
  if (!ctx.ok) return ctx;
  return {
    ok: true,
    value: buildTriNationDailyLite({ chart: ctx.value.chart, forDate: args.forDate })
  };
}

// src/frame-hash.ts
import { createHash as createHash2 } from "crypto";
function computeFrameHash(frame) {
  return createHash2("sha256").update(JSON.stringify(frame)).digest("hex");
}

// src/prompts/constants.ts
var PROMPT_VERSIONS = {
  lifetime: 3,
  yearly: 3,
  monthly: 4,
  daily: 2
};

// src/prompts/lifetime.ts
var COMMON_HEADER = `\uB2F9\uC2E0\uC740 30\uB144 \uACBD\uB825\uC758 \uC0AC\uC8FC \uBA85\uB9AC\uD559 \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uBE44\uC804\uBB38\uAC00 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC790\uC2E0\uC758 \uBA85\uC870\uB97C \uAE4A\uC774 \uC774\uD574\uC2DC\uD0A4\uB294 \uAC83\uC774 \uBAA9\uD45C\uC785\uB2C8\uB2E4.

[\uC791\uC131 \uC6D0\uCE59]
1. \uBD84\uB7C9: narrativeText \uC804\uCCB4 1500~2000\uC790 (5\uBB38\uB2E8). \uAC01 sections \uD544\uB4DC\uB294 200~350\uC790.
2. \uC6A9\uC5B4 \uD480\uC774: \uD55C\uC790 \uC6A9\uC5B4\xB7\uBA85\uB9AC \uC804\uBB38\uC5B4\uAC00 \uCC98\uC74C \uB4F1\uC7A5\uD560 \uB54C \uC778\uB77C\uC778 \uAD04\uD638\uB85C \uD480\uC5B4 \uC124\uBA85. \uC608: \u50B7\u5B98\u683C(\uC0C1\uAD00\uACA9 \u2014 \uC790\uC2E0\uC758 \uC7AC\uB2A5\uC744 \uBC16\uC73C\uB85C \uD45C\uCD9C\uD558\uB824\uB294 \uAE30\uC9C8), \u602A\u7F61(\uAD34\uAC15 \u2014 \uAC15\uD55C \uC790\uC874\uC2EC\uACFC \uACB0\uB2E8\uB825\uC744 \uAC00\uC9C4 \uC0B4). \uB450 \uBC88\uC9F8 \uB4F1\uC7A5\uBD80\uD130\uB294 \uD480\uC774 \uC0DD\uB7B5.
3. \uC139\uC158\uBCC4 3\uCE35 \uAD6C\uC870:
   - personality: \uACBD\uD5A5\uC131\xB7\uAE30\uC9C8 (\uC77C\uBC18\uB860, "\uB2F9\uC2E0\uC740 ~\uD55C \uC0AC\uB78C\uC785\uB2C8\uB2E4")
   - career: \uC9C1\uC5C5 \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9 ("\uD68C\uC758\uC5D0\uC11C ~\uD560 \uB54C ~\uD558\uC138\uC694")
   - relationship: \uAD00\uACC4 \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9
   - health: \uAC74\uAC15 \uAD00\uB9AC \uAD6C\uCCB4 \uD589\uB3D9\xB7\uACC4\uC808\uC131\xB7\uC2DD\uB2E8
   - daeunSummary: \uB300\uC6B4 \uD750\uB984\uC758 \uC2DC\uAC04\uB300\uBCC4 \uD0C0\uC774\uBC0D
4. \uD589\uB3D9 \uC9C0\uCE68\uC740 "\uADF8\uB798\uC11C \uC5B4\uB5BB\uAC8C" \uC758 \uC218\uC900\uAE4C\uC9C0. \uCD94\uC0C1\uC801 \uC870\uC5B8("\uADE0\uD615 \uC7A1\uC73C\uC138\uC694") \uAE08\uC9C0. \uC0C1\uD669\xB7\uC2DC\uAC04\xB7\uB300\uC0C1\uC744 \uBA85\uC2DC.
5. citations: \uC778\uC6A9\uD55C \uACE0\uC804/\uC804\uC801\uC758 \uD3B8\uBA85\uAE4C\uC9C0 \uBA85\uC2DC. \uCD5C\uC18C 2\uAC1C.`;
var KO_BODY = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4+\uC2E0\uC0B4]

\uD55C\uAD6D\uC2DD \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC790\uD3C9\uC9C4\uC804\uC758 \uACA9\uAD6D\uB860\uC744 \uAE30\uBCF8\uC73C\uB85C \uD558\uB418, \uC870\uD6C4(\u8ABF\u5019 \u2014 \uBA85\uC870\uC758 \uAE30\uC628\xB7\uC2B5\uB3C4 \uC870\uC808)\uC640 \uC2E0\uC0B4(\u795E\u715E \u2014 \uD2B9\uC815 \uAC04\uC9C0 \uC870\uD569\uC774 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uAE38\uD749 \uD45C\uC9C0)\uC744 \uC11C\uAD6C\uC2DD \uC790\uD3C9\uBCF4\uB2E4 \uBE44\uC911 \uC788\uAC8C \uD65C\uC6A9.
- \uBC15\uC7AC\uC644\xB7\uBC15\uCCAD\uD654 \uACC4\uC5F4\uC758 \uC784\uC0C1 \uC0AC\uC8FC: \uACA9\uAD6D\uC774 \uC131\uB9BD\uD574\uB3C4 \uC870\uD6C4\uAC00 \uBB34\uB108\uC9C0\uBA74 '\uACA9\uC740 \uC788\uC73C\uB098 \uC4F8 \uC218 \uC5C6\uB294 \uBA85' \uC73C\uB85C \uBCF8\uB2E4.
- \uC2E0\uC0B4\uC740 \uB2E8\uC21C \uAE38\uD749 \uB77C\uBCA8\uC774 \uC544\uB2C8\uB77C \uC131\uACA9\xB7\uC0AC\uAC74\uC758 \uACB0\uC744 \uBB18\uC0AC\uD558\uB294 \uB3C4\uAD6C.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC870\uD6C4 \uBD84\uC11D\uC744 \uBCF8\uBB38\uC5D0\uC11C \uD55C \uBB38\uB2E8 \uC774\uC0C1 \uB2E4\uB8EC\uB2E4. "\uC774 \uBA85\uC870\uB294 \uBD04\uCCA0\uC5D0 \uD0DC\uC5B4\uB098 \u6728\uC774 \uC655\uC131\uD558\uACE0 \u6C34\uB3C4 \uAC15\uD574 \uD55C\uAE30\xB7\uC2B5\uAE30\uAC00 \uC9D9\uB2E4. \u706B\u571F\uB85C \uB530\uB73B\uD558\uAC8C \uBCF4\uC644\uD574\uC57C \uD55C\uB2E4" \uC2DD\uC73C\uB85C \uBA85\uC870\uC758 \uAE30\uD6C4 \uC0C1\uD0DC\uB97C \uACC4\uC808\xB7\uC624\uD589 \uC5B8\uC5B4\uB85C \uC124\uBA85.
- \uB4F1\uC7A5 \uC2E0\uC0B4 (\uAD34\uAC15\xB7\uB3C4\uD654\xB7\uC5ED\uB9C8\xB7\uD654\uAC1C \uB4F1) \uC740 \uB2E8\uC21C \uB098\uC5F4 \uAE08\uC9C0. \uAC01 \uC2E0\uC0B4\uC774 \uC0AC\uC6A9\uC790\uC758 \uC77C\uC0C1\uC5D0\uC11C \uC5B4\uB5BB\uAC8C \uB4DC\uB7EC\uB098\uB294\uC9C0 1~2\uBB38\uC7A5\uC529.
- schoolSpecific.joohuFocus \uC5D0 \uBCF4\uC644\uD574\uC57C \uD560 \uC624\uD589\uACFC \uADF8 \uADFC\uAC70\uB97C 70~120\uC790.
- schoolSpecific.shinsalNotes \uC5D0 \uBA85\uC870\uC5D0 \uC2E4\uC81C \uB4F1\uC7A5\uD55C \uC2E0\uC0B4\uBCC4 \uD574\uC11D\uC744 \uAC01 1~2\uBB38\uC7A5\uC529.

[\uAE08\uC9C0]
- \uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804 \uC778\uC6A9 ("\uC801\uCC9C\uC218 \uC6B4\uC6B4"). \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815 ("38\uC138\uC5D0 \uBCC0\uB3D9"). \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var ZIPING_BODY = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uC790\uD3C9\uC9C4\uC804\xB7\uC801\uCC9C\uC218]

\uC790\uD3C9\uC9C4\uC804 \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uACA9\uAD6D(\u683C\u5C40 \u2014 \uC6D4\uC9C0 \uAE30\uC900\uC758 \uBA85\uC870 \uACE8\uACA9)\uACFC \uC6A9\uC2E0(\u7528\u795E \u2014 \uBA85\uC870\uC758 \uADE0\uD615\uC744 \uB9DE\uCD94\uB294 \uD575\uC2EC \uC624\uD589) \uC758 \uCCA0\uD559\uC801 \uBD84\uC11D \uC911\uC2EC.
- \uC801\uCC9C\uC218\xB7\uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804\uC758 \uB17C\uB9AC \uAD6C\uC870 ("\u8EAB\u5F37\u8EAB\u5F31, \u5F9E\u683C \u4E0D\u5F9E\u683C") \uB97C \uB530\uB77C\uAC00\uBA70 \uBA85\uC870\uC758 \uBCF8\uC9C8\uC744 \uCD94\uB860.
- \uC2E0\uC0B4\uC740 \uBD80\uCC28\uC801, \uC751\uAE30 \uC2DC\uC810\uC740 \uB2E4\uB8E8\uC9C0 \uC54A\uC74C.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uACA9\uAD6D\uC774 \uC131\uB9BD\uD558\uB294 \uC870\uAC74\uACFC \uD30C\uAD34\uB418\uB294 \uC870\uAC74\uC744 \uBAA8\uB450 \uC124\uBA85. \uB2E8\uC21C\uD788 "\uACA9\uAD6D=X \uC785\uB2C8\uB2E4" \uAC00 \uC544\uB2C8\uB77C "\uC6D4\uC9C0 X \uAC00 \uCC9C\uAC04 Y \uC640 \uACB0\uD569\uD574 Z \uACA9\uC774 \uC131\uB9BD\uD558\uC9C0\uB9CC, \uB3D9\uC2DC\uC5D0 W \uAC00 \uACA9\uC744 \uAE68\uB728\uB9B4 \uC704\uD5D8\uC774 \uC788\uB2E4".
- \uC6A9\uC2E0\uC744 \uCC44\uD0DD\uD560 \uB54C\uB294 \uD6C4\uBCF4 2\uAC1C \uC774\uC0C1\uC744 \uBE44\uAD50\uD55C \uB4A4 \uCC44\uD0DD \uC774\uC720\uB97C \uC81C\uC2DC.
- \uC801\uCC9C\uC218\xB7\uC790\uD3C9\uC9C4\uC804\xB7\uC0BC\uBA85\uD1B5\uD68C \uB4F1 \uC6D0\uC804 \uC778\uC6A9\uC744 \uBCF8\uBB38\uC5D0 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB179\uC784.
- schoolSpecific.gyeokgukRationale \uC5D0 \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34\uC758 \uCCA0\uD559\uC801 \uADFC\uAC70.
- schoolSpecific.yongshinAnalysis \uC5D0 \uC6A9\uC2E0 \uD6C4\uBCF4 \uBE44\uAD50\uC640 \uCC44\uD0DD \uC774\uC720.

[\uAE08\uC9C0]
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var MANGPAI_BODY = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uB9F9\uD30C \uB2E8\uAC74\uC5C5]

\uB9F9\uD30C \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC751\uAE30(\u61C9\u671F \u2014 \uC0AC\uAC74\uC774 \uC77C\uC5B4\uB098\uB294 \uC2DC\uC810) \uC640 \uC0AC\uAC74\uC131(\u4E8B\u4EF6\u6027) \uC911\uC2EC. "\uC5B8\uC81C \uBB34\uC5C7\uC774 \uC77C\uC5B4\uB098\uB294\uAC00" \uB97C \uB2E8\uC815\uC801\uC73C\uB85C \uBCF8\uB2E4.
- \uACA9\uAD6D \uCCA0\uD559\xB7\uC2E0\uC0B4 \uD574\uC11D\uC740 \uAE4A\uAC8C \uB2E4\uB8E8\uC9C0 \uC54A\uC74C. \uB300\uC2E0 \uBA85\uC870 \uB0B4 \uAE00\uC790 \uAC04 \uAD00\uACC4\uAC00 \uC5B4\uB5A4 \uC0AC\uAC74\uC744 \uB9CC\uB4E4\uC5B4\uB0B4\uB294\uC9C0\uC5D0 \uC9D1\uC911.
- \uB2E8\uAC74\uC5C5(\u6BB5\u5EFA\u696D) \uACC4\uC5F4 \uD1A4: \uC9C1\uC124\uC801\uC774\uACE0 \uB2E8\uC815\uC801. "\uD560 \uAC00\uB2A5\uC131\uC774 \uC788\uB2E4" \uBCF4\uB2E4 "\uD55C\uB2E4" \uC5D0 \uAC00\uAE4C\uC6B4 \uC5B4\uC870.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uB300\uC6B4\xB7\uC138\uC6B4 \uAD6C\uAC04\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C \uBA85\uC2DC ("30~35\uC138 \u620A\u8FB0 \uB300\uC6B4", "45\uC138 \u5E9A\u5348 \uB144"). \uCD94\uC0C1\uC801 "\uC911\uB144" \uAE08\uC9C0.
- \uC0AC\uAC74\uC758 \uACB0\uC744 \uB2E8\uC5B4\uB85C \uD45C\uD604 (\uC7AC\uBB3C \uBCC0\uB3D9, \uAC00\uC871 \uBCC0\uACE0, \uC774\uB3D9\xB7\uC774\uC0AC, \uACB0\uD63C\xB7\uC774\uD63C, \uC9C1\uC7A5 \uBCC0\uACBD). \uBAA8\uD638\uD55C "\uBCC0\uD654" \uAE08\uC9C0.
- daeunSummary \uB294 \uC2DC\uAC04\uB300\uBCC4 \uC0AC\uAC74 \uC608\uCE21\uC5D0 \uC9D1\uC911.
- schoolSpecific.eventTimings \uC5D0 \uC751\uAE30 \uC2DC\uC810 3~6\uAC1C\uB97C (period, event) \uC30D\uC73C\uB85C \uBA85\uC2DC.

[\uAE08\uC9C0]
- "~\uD560 \uAC00\uB2A5\uC131\uC774 \uB192\uB2E4" \uB958\uC758 \uC57D\uD654 \uD45C\uD604 \uBE48\uCD9C (\uB9F9\uD30C \uD1A4 \uC190\uC0C1). \uB2E8\uC815\uD615 \uC6B0\uC120.
- \uACA9\uAD6D \uCCA0\uD559 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.`;
var JP_BODY = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC77C\uBCF8 \uCD94\uBA85\uD559]

\uC77C\uBCF8 \uCD94\uBA85\uD559\uC758 \uD2B9\uC9D5:
- 12\uAD81(\u547D\u5BAE\xB7\u8CA1\u5E1B\u5BAE\xB7\u5144\u5F1F\u5BAE\xB7\u7530\u5B85\u5BAE\xB7\u7537\u5973\u5BAE\xB7\u5974\u50D5\u5BAE\xB7\u59BB\u59BE\u5BAE\xB7\u75BE\u5384\u5BAE\xB7\u9077\u79FB\u5BAE\xB7\u5B98\u797F\u5BAE\xB7\u798F\u5FB7\u5BAE\xB7\u7236\u6BCD\u5BAE) \uB2E8\uC704\uB85C \uC778\uC0DD \uC601\uC5ED\uC744 \uB098\uB204\uACE0 \uAC01 \uAD81\uC758 \uCC98\uC138\uB97C \uBD84\uC11D.
- \uD1B5\uBCC0\uC131(\u901A\u8B8A\u661F \u2014 \uC77C\uAC04\uC744 \uAE30\uC900\uC73C\uB85C \uB2E4\uB978 \uAE00\uC790\uAC00 \uC5B4\uB5A4 \uC758\uBBF8\uB97C \uB760\uB294\uC9C0: \u6B63\u5B98\xB7\u504F\u8CA1\xB7\u98DF\u795E \uB4F1) \uC744 \uBE44\uC911 \uC788\uAC8C \uB2E4\uB8F8.
- \u9AD8\u6728\u4E58 \uACC4\uC5F4 \uD1A4: \uCC28\uBD84\uD558\uACE0 \uC2E4\uC6A9\uC801. \uACA9\uAD6D\xB7\uC2E0\uC0B4\uBCF4\uB2E4 \uCC98\uC138\xB7\uAD00\uACC4 \uC870\uC5B8 \uC911\uC2EC.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- 12\uAD81 \uC911 \uBA85\uC870\uC5D0 \uC758\uBBF8 \uC788\uB294 5~8\uAC1C\uB97C \uACE8\uB77C \uAC01\uAC01\uC758 \uCC98\uC138 \uC694\uC9C0\uB97C \uB2E4\uB8F8.
- \uD1B5\uBCC0\uC131\uC73C\uB85C \uC77C\uAC04 \uC8FC\uBCC0 \uAE00\uC790\uC758 \uC758\uBBF8\uB97C \uD574\uC124 (\uC608: "\uC6D4\uAC04\uC774 \uC815\uAD00\uC774\uB77C \uC0AC\uD68C\uC801 \uCC45\uC784\uAC10\uACFC \uADDC\uC728\uC744 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uBC1B\uC544\uB4E4\uC778\uB2E4").
- \uC77C\uBCF8 \uCD94\uBA85\uD559 \uD2B9\uC720\uC758 \uC6A9\uC5B4 (12\uAD81 \uBA85\uCE6D, \uD1B5\uBCC0\uC131) \uB294 \uCCAB \uB4F1\uC7A5 \uC2DC \uD55C\uC790 + \uD55C\uAE00 \uD480\uC774 + \uC758\uBBF8 1\uC904.
- schoolSpecific.palaceMap \uC5D0 \uC758\uBBF8 \uC788\uB294 5~8\uAC1C \uAD81\uC744 (palace, note) \uC30D\uC73C\uB85C \uBA85\uC2DC.

[\uAE08\uC9C0]
- \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.`;
var LIFETIME_SCHOOL_PROMPTS = {
  ko: `${COMMON_HEADER}

${KO_BODY}`,
  "cn-ziping": `${COMMON_HEADER}

${ZIPING_BODY}`,
  "cn-mangpai": `${COMMON_HEADER}

${MANGPAI_BODY}`,
  jp: `${COMMON_HEADER}

${JP_BODY}`
};
var LIFETIME_USER_SUFFIX = `\uC704 \uBA85\uC870\uB97C \uB2E4\uC74C JSON \uC2A4\uD0A4\uB9C8\uB85C\uB9CC \uB2F5\uD558\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4 \uD5E4\uB354, \uD39C\uC2A4, prose \uC124\uBA85, \uC778\uC0AC\uB9D0 \uBAA8\uB450 \uAE08\uC9C0. '{' \uB85C \uC2DC\uC791\uD574\uC11C '}' \uB85C \uB05D\uB098\uB294 JSON \uBCF8\uBB38\uB9CC \uCD9C\uB825:
{"narrativeText":"1500~2000\uC790 5\uBB38\uB2E8","sections":{"personality":"...","career":"...","relationship":"...","health":"...","daeunSummary":"...","keyTerms":[{"term":"...","gloss":"..."}],"cautions":["..."]},"schoolSpecific":{...\uD559\uD30C\uBCC4...},"citations":["\uCD9C\uCC981","\uCD9C\uCC982"]}`;
function buildLifetimePrompt(frame, school) {
  return {
    system: LIFETIME_SCHOOL_PROMPTS[school],
    user: `\uBA85\uC870 \uBD84\uC11D:
${JSON.stringify(frame, null, 2)}

${LIFETIME_USER_SUFFIX}`
  };
}

// src/prompts/yearly.ts
var COMMON_HEADER2 = `\uB2F9\uC2E0\uC740 30\uB144 \uACBD\uB825\uC758 \uC0AC\uC8FC \uBA85\uB9AC\uD559 \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uBE44\uC804\uBB38\uAC00 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC62C\uD574 \uD55C \uD574\uC758 \uD750\uB984\uC744 \uAE4A\uC774 \uC774\uD574\uC2DC\uD0A4\uB294 \uAC83\uC774 \uBAA9\uD45C\uC785\uB2C8\uB2E4.

[\uC791\uC131 \uC6D0\uCE59]
1. \uBD84\uB7C9: narrativeText \uC804\uCCB4 1200~1600\uC790 (4~5\uBB38\uB2E8). \uAC01 sections \uD544\uB4DC\uB294 200~280\uC790.
2. \uC6A9\uC5B4 \uD480\uC774: \uD55C\uC790 \uC6A9\uC5B4\xB7\uBA85\uB9AC \uC804\uBB38\uC5B4\uAC00 \uCC98\uC74C \uB4F1\uC7A5\uD560 \uB54C \uC778\uB77C\uC778 \uAD04\uD638\uB85C \uD480\uC5B4 \uC124\uBA85. \uC608: \uC885\uC544\uACA9(\u5F9E\u5152\u683C \u2014 \uC77C\uAC04\uC774 \uC2DD\uC0C1\uC5D0 \uC885\uC18D\uD558\uB294 \uACA9\uAD6D), \uC2DD\uC0C1\uC0DD\uC7AC(\u98DF\u50B7\u751F\u8CA1 \u2014 \uC2DD\uC0C1\uC774 \uC7AC\uC131\uC744 \uC0DD\uD558\uB294 \uD750\uB984), \uC138\uC6B4(\u6B72\u904B \u2014 \uC62C\uD574 \uD55C \uD574\uC758 \uC6B4). \uB450 \uBC88\uC9F8 \uB4F1\uC7A5\uBD80\uD130\uB294 \uD480\uC774 \uC0DD\uB7B5.
3. \uC139\uC158\uBCC4 3\uCE35 \uAD6C\uC870:
   - personality: \uC62C\uD574 \uB4DC\uB7EC\uB098\uB294 \uAE30\uC9C8\xB7\uD0DC\uB3C4 (\uC77C\uBC18\uB860, "\uB2F9\uC2E0\uC740 \uC62C\uD574 ~\uD55C \uD0DC\uB3C4\uB85C")
   - career: \uC9C1\uC5C5\xB7\uC7AC\uBB3C \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9 ("Q3 \uBD84\uAE30 \uD68C\uC758\uC5D0\uC11C ~\uD560 \uB54C ~\uD558\uC138\uC694")
   - relationship: \uAD00\uACC4 \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9
   - health: \uAC74\uAC15 \uAD00\uB9AC \uAD6C\uCCB4 \uD589\uB3D9\xB7\uACC4\uC808\uC131\xB7\uC2DD\uB2E8
   - daeunSummary: \uD604 \uB300\uC6B4 \uAD6C\uAC04\uC774 \uC62C\uD574\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uACFC \uBD84\uAE30\uBCC4 \uD0C0\uC774\uBC0D
4. \uD589\uB3D9 \uC9C0\uCE68\uC740 "\uADF8\uB798\uC11C \uC5B4\uB5BB\uAC8C" \uC758 \uC218\uC900\uAE4C\uC9C0. \uCD94\uC0C1\uC801 \uC870\uC5B8("\uADE0\uD615 \uC7A1\uC73C\uC138\uC694") \uAE08\uC9C0. \uC0C1\uD669\xB7\uC2DC\uAC04\xB7\uB300\uC0C1\uC744 \uBA85\uC2DC.
5. citations: \uC778\uC6A9\uD55C \uACE0\uC804/\uC804\uC801\uC758 \uD3B8\uBA85\uAE4C\uC9C0 \uBA85\uC2DC. \uCD5C\uC18C 2\uAC1C.`;
var KO_BODY2 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4+\uC2E0\uC0B4, \uC62C\uD574 \uC138\uC6B4]

\uD55C\uAD6D\uC2DD \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC790\uD3C9\uC9C4\uC804\uC758 \uACA9\uAD6D\uB860\uC744 \uAE30\uBCF8\uC73C\uB85C \uD558\uB418, \uC870\uD6C4(\u8ABF\u5019 \u2014 \uBA85\uC870\uC758 \uAE30\uC628\xB7\uC2B5\uB3C4 \uC870\uC808)\uC640 \uC2E0\uC0B4(\u795E\u715E \u2014 \uD2B9\uC815 \uAC04\uC9C0 \uC870\uD569\uC774 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uAE38\uD749 \uD45C\uC9C0)\uC744 \uC11C\uAD6C\uC2DD \uC790\uD3C9\uBCF4\uB2E4 \uBE44\uC911 \uC788\uAC8C \uD65C\uC6A9.
- \uBC15\uC7AC\uC644\xB7\uBC15\uCCAD\uD654 \uACC4\uC5F4\uC758 \uC784\uC0C1 \uC0AC\uC8FC: \uACA9\uAD6D\uC774 \uC131\uB9BD\uD574\uB3C4 \uC870\uD6C4\uAC00 \uBB34\uB108\uC9C0\uBA74 '\uACA9\uC740 \uC788\uC73C\uB098 \uC4F8 \uC218 \uC5C6\uB294 \uBA85' \uC73C\uB85C \uBCF8\uB2E4.
- \uC62C\uD574 \uC138\uC6B4 \uAC04\uC9C0\uAC00 \uBA85\uC870\uC758 \uACA9\uAD6D\xB7\uC870\uD6C4\xB7\uC2E0\uC0B4 \uD45C\uC9C0\uB97C \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC62C\uD574 \uC138\uC6B4 \uAC04\uC9C0\uAC00 \uBA85\uC870\uC758 \uC870\uD6C4\uB97C \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uD55C \uBB38\uB2E8 \uC774\uC0C1. "\uC62C\uD574 \u4E19\u5348 \uC138\uC6B4\uC740 \uBCF8\uBA85\uC758 \u5BD2\u6C23\uB97C \uAC15\uD558\uAC8C \uBCF4\uC644\uD574 ..." \uC2DD\uC73C\uB85C \uBA85\uC870 + \uC138\uC6B4 \uACB0\uD569\uC758 \uAE30\uD6C4 \uC0C1\uD0DC\uB97C \uACC4\uC808\xB7\uC624\uD589 \uC5B8\uC5B4\uB85C \uC124\uBA85.
- \uB4F1\uC7A5 \uC2E0\uC0B4 (\uAD34\uAC15\xB7\uB3C4\uD654\xB7\uC5ED\uB9C8\xB7\uD654\uAC1C \uB4F1) \uC774 \uC62C\uD574\uC5D0 \uC5B4\uB5BB\uAC8C \uBC1C\uD604\uB418\uB294\uC9C0 1~2\uBB38\uC7A5\uC529. \uB2E8\uC21C \uB098\uC5F4 \uAE08\uC9C0.
- schoolSpecific.joohuFocus \uC5D0 \uC62C\uD574 \uBCF4\uC644\uD574\uC57C \uD560 \uC624\uD589\uACFC \uADF8 \uADFC\uAC70\uB97C 70~120\uC790.
- schoolSpecific.shinsalNotes \uC5D0 \uBA85\uC870 + \uC138\uC6B4 \uACB0\uD569\uC73C\uB85C \uBC1C\uD604\uB418\uB294 \uC2E0\uC0B4\uBCC4 \uD574\uC11D\uC744 \uAC01 1~2\uBB38\uC7A5\uC529.

[\uAE08\uC9C0]
- \uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804 \uC778\uC6A9 ("\uC801\uCC9C\uC218 \uC6B4\uC6B4"). \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815 ("Q3 \uC5D0 \uBCC0\uB3D9"). \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var ZIPING_BODY2 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uC790\uD3C9\uC9C4\uC804\xB7\uC801\uCC9C\uC218, \uC62C\uD574 \uC138\uC6B4]

\uC790\uD3C9\uC9C4\uC804 \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uACA9\uAD6D(\u683C\u5C40 \u2014 \uC6D4\uC9C0 \uAE30\uC900\uC758 \uBA85\uC870 \uACE8\uACA9)\uACFC \uC6A9\uC2E0(\u7528\u795E \u2014 \uBA85\uC870\uC758 \uADE0\uD615\uC744 \uB9DE\uCD94\uB294 \uD575\uC2EC \uC624\uD589) \uC758 \uCCA0\uD559\uC801 \uBD84\uC11D \uC911\uC2EC.
- \uC801\uCC9C\uC218\xB7\uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804\uC758 \uB17C\uB9AC \uAD6C\uC870 ("\u8EAB\u5F37\u8EAB\u5F31, \u5F9E\u683C \u4E0D\u5F9E\u683C") \uB97C \uB530\uB77C\uAC00\uBA70 \uBA85\uC870\uC758 \uBCF8\uC9C8\uC744 \uCD94\uB860.
- \uC62C\uD574 \uC138\uC6B4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D\xB7\uC6A9\uC2E0\uACFC \uC5B4\uB5BB\uAC8C \uC0C1\uD638\uC791\uC6A9\uD558\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC62C\uD574 \uC138\uC6B4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5. \uC885\uACA9(\u5F9E\u683C \u2014 \uC77C\uAC04\uC774 \uD2B9\uC815 \uC624\uD589\uC5D0 \uC885\uC18D\uD558\uB294 \uD2B9\uC218\uACA9) \uCF00\uC774\uC2A4\uB294 \uC885\uC544\xB7\uC885\uC7AC\xB7\uC885\uC0B4 cascade \uC758 \uD750\uB984\uC744 \uD480\uC5B4 \uC124\uBA85.
- \uC6A9\uC2E0\uACFC \uC138\uC6B4 \uAC04\uC9C0\uC758 \uAD00\uACC4 (\u7528\u795E \uAC15\uD654 / \uC190\uC0C1 / \uC911\uB9BD) \uB97C \uBA85\uC2DC.
- \uC801\uCC9C\uC218\xB7\uC790\uD3C9\uC9C4\uC804\xB7\uC0BC\uBA85\uD1B5\uD68C \uB4F1 \uC6D0\uC804 \uC778\uC6A9\uC744 \uBCF8\uBB38\uC5D0 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB179\uC784.
- schoolSpecific.gyeokgukRationale \uC5D0 \uACA9\uAD6D\xB7\uC885\uACA9 \uC131\uB9BD \uC870\uAC74\uACFC \uC138\uC6B4 \uC601\uD5A5.
- schoolSpecific.yongshinAnalysis \uC5D0 \uC6A9\uC2E0 \uD6C4\uBCF4 \uBE44\uAD50\uC640 \uC138\uC6B4\uC5D0\uC11C\uC758 \uC791\uC6A9.

[\uAE08\uC9C0]
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var MANGPAI_BODY2 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uB9F9\uD30C \uB2E8\uAC74\uC5C5, \uC62C\uD574 \uC138\uC6B4]

\uB9F9\uD30C \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC751\uAE30(\u61C9\u671F \u2014 \uC0AC\uAC74\uC774 \uC77C\uC5B4\uB098\uB294 \uC2DC\uC810) \uC640 \uC0AC\uAC74\uC131(\u4E8B\u4EF6\u6027) \uC911\uC2EC. "\uC5B8\uC81C \uBB34\uC5C7\uC774 \uC77C\uC5B4\uB098\uB294\uAC00" \uB97C \uB2E8\uC815\uC801\uC73C\uB85C \uBCF8\uB2E4.
- \uACA9\uAD6D \uCCA0\uD559\xB7\uC2E0\uC0B4 \uD574\uC11D\uC740 \uAE4A\uAC8C \uB2E4\uB8E8\uC9C0 \uC54A\uC74C. \uB300\uC2E0 \uC62C\uD574 \uC138\uC6B4\uC774 \uBA85\uC870\uC5D0 \uC5B4\uB5A4 \uC0AC\uAC74\uC744 \uD2B8\uB9AC\uAC70\uD558\uB294\uC9C0\uC5D0 \uC9D1\uC911.
- \uB2E8\uAC74\uC5C5(\u6BB5\u5EFA\u696D) \uACC4\uC5F4 \uD1A4: \uC9C1\uC124\uC801\uC774\uACE0 \uB2E8\uC815\uC801. "\uD560 \uAC00\uB2A5\uC131\uC774 \uC788\uB2E4" \uBCF4\uB2E4 "\uD55C\uB2E4" \uC5D0 \uAC00\uAE4C\uC6B4 \uC5B4\uC870.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC62C\uD574 \uBD84\uAE30\uBCC4 (Q1\xB7Q2\xB7Q3\xB7Q4 \uB610\uB294 \uC6D4\uBCC4) \uC751\uAE30 \uC2DC\uC810\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C. \uCD94\uC0C1\uC801 "\uC62C\uD574 \uD6C4\uBC18" \uAE08\uC9C0.
- \uC0AC\uAC74\uC758 \uACB0\uC744 \uB2E8\uC5B4\uB85C \uD45C\uD604 (\uC7AC\uBB3C \uBCC0\uB3D9, \uAC00\uC871 \uBCC0\uACE0, \uC774\uB3D9\xB7\uC774\uC0AC, \uACB0\uD63C\xB7\uC774\uD63C, \uC9C1\uC7A5 \uBCC0\uACBD). \uBAA8\uD638\uD55C "\uBCC0\uD654" \uAE08\uC9C0.
- daeunSummary \uB294 \uD604 \uB300\uC6B4\uACFC \uC62C\uD574 \uC138\uC6B4\uC758 \uACB0\uD569\uC73C\uB85C \uBC1C\uC0DD\uD558\uB294 \uC0AC\uAC74 \uC608\uCE21\uC5D0 \uC9D1\uC911.
- schoolSpecific.eventTimings \uC5D0 \uC62C\uD574 \uBD84\uAE30\uBCC4 \uC751\uAE30 \uC2DC\uC810 3~6\uAC1C\uB97C (period, event) \uC30D\uC73C\uB85C \uBA85\uC2DC.

[\uAE08\uC9C0]
- "~\uD560 \uAC00\uB2A5\uC131\uC774 \uB192\uB2E4" \uB958\uC758 \uC57D\uD654 \uD45C\uD604 \uBE48\uCD9C (\uB9F9\uD30C \uD1A4 \uC190\uC0C1). \uB2E8\uC815\uD615 \uC6B0\uC120.
- \uACA9\uAD6D \uCCA0\uD559 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.`;
var JP_BODY2 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC77C\uBCF8 \uCD94\uBA85\uD559, \uC62C\uD574 \uC138\uC6B4]

\uC77C\uBCF8 \uCD94\uBA85\uD559\uC758 \uD2B9\uC9D5:
- 12\uAD81(\u547D\u5BAE\xB7\u8CA1\u5E1B\u5BAE\xB7\u5144\u5F1F\u5BAE\xB7\u7530\u5B85\u5BAE\xB7\u7537\u5973\u5BAE\xB7\u5974\u50D5\u5BAE\xB7\u59BB\u59BE\u5BAE\xB7\u75BE\u5384\u5BAE\xB7\u9077\u79FB\u5BAE\xB7\u5B98\u797F\u5BAE\xB7\u798F\u5FB7\u5BAE\xB7\u7236\u6BCD\u5BAE) \uB2E8\uC704\uB85C \uC778\uC0DD \uC601\uC5ED\uC744 \uB098\uB204\uACE0 \uAC01 \uAD81\uC758 \uCC98\uC138\uB97C \uBD84\uC11D.
- \uD1B5\uBCC0\uC131(\u901A\u8B8A\u661F \u2014 \uC77C\uAC04\uC744 \uAE30\uC900\uC73C\uB85C \uB2E4\uB978 \uAE00\uC790\uAC00 \uC5B4\uB5A4 \uC758\uBBF8\uB97C \uB760\uB294\uC9C0: \u6B63\u5B98\xB7\u504F\u8CA1\xB7\u98DF\u795E \uB4F1) \uC744 \uBE44\uC911 \uC788\uAC8C \uB2E4\uB8F8.
- \u9AD8\u6728\u4E58 \uACC4\uC5F4 \uD1A4: \uCC28\uBD84\uD558\uACE0 \uC2E4\uC6A9\uC801. \uACA9\uAD6D\xB7\uC2E0\uC0B4\uBCF4\uB2E4 \uCC98\uC138\xB7\uAD00\uACC4 \uC870\uC5B8 \uC911\uC2EC.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC62C\uD574 \uD65C\uC131\uD654\uB418\uB294 12\uAD81 5~8\uAC1C\uB97C \uACE8\uB77C \uAC01\uAC01\uC758 \uCC98\uC138 \uC694\uC9C0\uB97C \uB2E4\uB8F8.
- \uD1B5\uBCC0\uC131\uC73C\uB85C \uC138\uC6B4 \uAC04\uC9C0\uC758 \uC758\uBBF8\uB97C \uD574\uC124 (\uC608: "\uC62C\uD574 \uC138\uC6B4 \uCC9C\uAC04\uC774 \uC815\uAD00\uC774\uB77C \uC0AC\uD68C\uC801 \uCC45\uC784\uAC10\uACFC \uADDC\uC728\uC744 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uBC1B\uC544\uB4E4\uC774\uAC8C \uB41C\uB2E4").
- \uC77C\uBCF8 \uCD94\uBA85\uD559 \uD2B9\uC720\uC758 \uC6A9\uC5B4 (12\uAD81 \uBA85\uCE6D, \uD1B5\uBCC0\uC131) \uB294 \uCCAB \uB4F1\uC7A5 \uC2DC \uD55C\uC790 + \uD55C\uAE00 \uD480\uC774 + \uC758\uBBF8 1\uC904.
- schoolSpecific.palaceMap \uC5D0 \uC62C\uD574 \uD65C\uC131\uD654\uB418\uB294 5~8\uAC1C \uAD81\uC744 (palace, note) \uC30D\uC73C\uB85C \uBA85\uC2DC.

[\uAE08\uC9C0]
- \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.`;
var YEARLY_SCHOOL_PROMPTS = {
  ko: `${COMMON_HEADER2}

${KO_BODY2}`,
  "cn-ziping": `${COMMON_HEADER2}

${ZIPING_BODY2}`,
  "cn-mangpai": `${COMMON_HEADER2}

${MANGPAI_BODY2}`,
  jp: `${COMMON_HEADER2}

${JP_BODY2}`
};
var YEARLY_USER_SUFFIX = `\uC704 \uBA85\uC870\uB97C \uB2E4\uC74C JSON \uC2A4\uD0A4\uB9C8\uB85C\uB9CC \uB2F5\uD558\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4 \uD5E4\uB354, \uD39C\uC2A4, prose \uC124\uBA85, \uC778\uC0AC\uB9D0 \uBAA8\uB450 \uAE08\uC9C0. '{' \uB85C \uC2DC\uC791\uD574\uC11C '}' \uB85C \uB05D\uB098\uB294 JSON \uBCF8\uBB38\uB9CC \uCD9C\uB825:
{"narrativeText":"1200~1600\uC790 4~5\uBB38\uB2E8","sections":{"personality":"...","career":"...","relationship":"...","health":"...","daeunSummary":"...","keyTerms":[{"term":"...","gloss":"..."}],"cautions":["..."]},"schoolSpecific":{...\uD559\uD30C\uBCC4...},"citations":["\uCD9C\uCC981","\uCD9C\uCC982"]}`;
function buildYearlyPrompt(frame, school) {
  return {
    system: YEARLY_SCHOOL_PROMPTS[school],
    user: `\uBA85\uC870 \uBD84\uC11D:
${JSON.stringify(frame, null, 2)}

${YEARLY_USER_SUFFIX}`
  };
}

// src/prompts/monthly.ts
var COMMON_HEADER3 = `\uB2F9\uC2E0\uC740 30\uB144 \uACBD\uB825\uC758 \uC0AC\uC8FC \uBA85\uB9AC\uD559 \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uBE44\uC804\uBB38\uAC00 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC774\uBC88 \uB2EC \uD55C \uB2EC\uC758 \uD750\uB984\uC744 \uAE4A\uC774 \uC774\uD574\uC2DC\uD0A4\uB294 \uAC83\uC774 \uBAA9\uD45C\uC785\uB2C8\uB2E4.

[\uC791\uC131 \uC6D0\uCE59]
1. \uBD84\uB7C9: narrativeText \uC804\uCCB4 800~1200\uC790 (3\uBB38\uB2E8). \uAC01 sections \uD544\uB4DC\uB294 150~200\uC790.
2. \uC6A9\uC5B4 \uD480\uC774: \uD55C\uC790 \uC6A9\uC5B4\xB7\uBA85\uB9AC \uC804\uBB38\uC5B4\uAC00 \uCC98\uC74C \uB4F1\uC7A5\uD560 \uB54C \uC778\uB77C\uC778 \uAD04\uD638\uB85C \uD480\uC5B4 \uC124\uBA85. \uC608: \uC6D4\uC6B4(\u6708\u904B \u2014 \uC774\uBC88 \uB2EC \uD55C \uB2EC\uC758 \uC6B4), \uC751\uAE30(\u61C9\u671F \u2014 \uC0AC\uAC74\uC774 \uC77C\uC5B4\uB098\uB294 \uC2DC\uC810). \uB450 \uBC88\uC9F8 \uB4F1\uC7A5\uBD80\uD130\uB294 \uD480\uC774 \uC0DD\uB7B5.
3. \uC139\uC158\uBCC4 3\uCE35 \uAD6C\uC870:
   - personality: \uC774\uBC88 \uB2EC \uB4DC\uB7EC\uB098\uB294 \uAE30\uC9C8\xB7\uD0DC\uB3C4
   - career: \uC9C1\uC5C5\xB7\uC7AC\uBB3C \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9 ("\uC774\uBC88 \uB2EC \uC911\uC21C \uD68C\uC758\uC5D0\uC11C ~\uD560 \uB54C ~\uD558\uC138\uC694")
   - relationship: \uAD00\uACC4 \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9
   - health: \uAC74\uAC15 \uAD00\uB9AC \uAD6C\uCCB4 \uD589\uB3D9\xB7\uACC4\uC808\uC131
   - daeunSummary: \uD604 \uB300\uC6B4 + \uC62C\uD574 \uC138\uC6B4\uC774 \uC774\uBC88 \uB2EC\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uACFC \uC0C1\uC21C\xB7\uC911\uC21C\xB7\uD558\uC21C \uD0C0\uC774\uBC0D
4. \uD589\uB3D9 \uC9C0\uCE68\uC740 "\uADF8\uB798\uC11C \uC5B4\uB5BB\uAC8C" \uC758 \uC218\uC900\uAE4C\uC9C0. \uCD94\uC0C1\uC801 \uC870\uC5B8("\uADE0\uD615 \uC7A1\uC73C\uC138\uC694") \uAE08\uC9C0. \uC0C1\uD669\xB7\uC2DC\uAC04\xB7\uB300\uC0C1\uC744 \uBA85\uC2DC.
5. citations: \uC778\uC6A9\uD55C \uACE0\uC804/\uC804\uC801\uC758 \uD3B8\uBA85\uAE4C\uC9C0 \uBA85\uC2DC. \uCD5C\uC18C 2\uAC1C.`;
var KO_BODY3 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4+\uC2E0\uC0B4, \uC774\uBC88 \uB2EC \uC6D4\uC6B4]

\uD55C\uAD6D\uC2DD \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC790\uD3C9\uC9C4\uC804\uC758 \uACA9\uAD6D\uB860\uC744 \uAE30\uBCF8\uC73C\uB85C \uD558\uB418, \uC870\uD6C4(\u8ABF\u5019)\uC640 \uC2E0\uC0B4(\u795E\u715E)\uC744 \uBE44\uC911 \uC788\uAC8C \uD65C\uC6A9.
- \uBC15\uC7AC\uC644\xB7\uBC15\uCCAD\uD654 \uACC4\uC5F4\uC758 \uC784\uC0C1 \uC0AC\uC8FC.
- \uC774\uBC88 \uB2EC \uC6D4\uC6B4 \uAC04\uC9C0\uAC00 \uBA85\uC870 + \uC62C\uD574 \uC138\uC6B4 \uC870\uD569\uC758 \uC870\uD6C4\xB7\uC2E0\uC0B4\uC744 \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC774\uBC88 \uB2EC \uC6D4\uC6B4 \uAC04\uC9C0\uAC00 \uBA85\uC870\uC758 \uC870\uD6C4\uB97C \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uC9E7\uAC8C\uB77C\uB3C4 \uD55C \uB2E8\uB77D.
- \uB4F1\uC7A5 \uC2E0\uC0B4\uC774 \uC774\uBC88 \uB2EC\uC5D0 \uBC1C\uD604\uB418\uB294 \uC591\uC0C1.
- schoolSpecific.joohuFocus \uC5D0 \uC774\uBC88 \uB2EC \uBCF4\uC644\uD574\uC57C \uD560 \uC624\uD589\uACFC \uADFC\uAC70.
- schoolSpecific.shinsalNotes \uC5D0 \uC774\uBC88 \uB2EC \uD65C\uC131 \uC2E0\uC0B4.

[\uAE08\uC9C0]
- \uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804 \uC778\uC6A9. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var ZIPING_BODY3 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uC790\uD3C9\uC9C4\uC804\xB7\uC801\uCC9C\uC218, \uC774\uBC88 \uB2EC \uC6D4\uC6B4]

\uC790\uD3C9\uC9C4\uC804 \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uACA9\uAD6D(\u683C\u5C40)\uACFC \uC6A9\uC2E0(\u7528\u795E) \uC758 \uCCA0\uD559\uC801 \uBD84\uC11D \uC911\uC2EC.
- \uC774\uBC88 \uB2EC \uC6D4\uC6B4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D\xB7\uC6A9\uC2E0\uACFC \uC5B4\uB5BB\uAC8C \uC0C1\uD638\uC791\uC6A9\uD558\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC774\uBC88 \uB2EC \uC6D4\uC6B4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D\xB7\uC885\uACA9\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5.
- \uC6A9\uC2E0\uACFC \uC6D4\uC6B4 \uAC04\uC9C0\uC758 \uAD00\uACC4 (\uAC15\uD654 / \uC190\uC0C1 / \uC911\uB9BD).
- schoolSpecific.gyeokgukRationale \uC5D0 \uACA9\uAD6D\xB7\uC885\uACA9 \uC131\uB9BD \uC870\uAC74\uACFC \uC6D4\uC6B4 \uC601\uD5A5.
- schoolSpecific.yongshinAnalysis \uC5D0 \uC6A9\uC2E0\uACFC \uC6D4\uC6B4\uC758 \uC791\uC6A9.

[\uAE08\uC9C0]
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var MANGPAI_BODY3 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uB9F9\uD30C \uB2E8\uAC74\uC5C5, \uC774\uBC88 \uB2EC \uC6D4\uC6B4]

\uB9F9\uD30C \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC751\uAE30(\u61C9\u671F) \uC640 \uC0AC\uAC74\uC131 \uC911\uC2EC.
- \uB2E8\uAC74\uC5C5 \uACC4\uC5F4 \uD1A4: \uC9C1\uC124\uC801\xB7\uB2E8\uC815\uC801.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC774\uBC88 \uB2EC \uC0C1\uC21C\xB7\uC911\uC21C\xB7\uD558\uC21C \uC751\uAE30 \uC2DC\uC810\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C.
- \uC0AC\uAC74\uC758 \uACB0\uC744 \uB2E8\uC5B4\uB85C (\uC7AC\uBB3C \uBCC0\uB3D9, \uAD00\uACC4 \uAC08\uB4F1, \uC774\uB3D9, \uACB0\uC815).
- schoolSpecific.eventTimings \uC5D0 \uC774\uBC88 \uB2EC \uC751\uAE30 \uC2DC\uC810 3~5\uAC1C (period, event).

[\uAE08\uC9C0]
- "~\uD560 \uAC00\uB2A5\uC131\uC774 \uB192\uB2E4" \uB958 \uC57D\uD654 \uD45C\uD604. \uB2E8\uC815\uD615 \uC6B0\uC120.
- \uACA9\uAD6D \uCCA0\uD559 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.`;
var JP_BODY3 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC77C\uBCF8 \uCD94\uBA85\uD559, \uC774\uBC88 \uB2EC \uC6D4\uC6B4]

\uC77C\uBCF8 \uCD94\uBA85\uD559\uC758 \uD2B9\uC9D5:
- 12\uAD81 + \uD1B5\uBCC0\uC131 \uC911\uC2EC.
- \u9AD8\u6728\u4E58 \uACC4\uC5F4 \uD1A4: \uCC28\uBD84\uD558\uACE0 \uC2E4\uC6A9\uC801.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC774\uBC88 \uB2EC \uD65C\uC131\uD654\uB418\uB294 12\uAD81 3~5\uAC1C \uACE8\uB77C \uCC98\uC138.
- \uD1B5\uBCC0\uC131\uC73C\uB85C \uC6D4\uC6B4 \uAC04\uC9C0\uC758 \uC758\uBBF8 \uD574\uC124.
- schoolSpecific.palaceMap \uC5D0 (palace, note) \uC30D 3~6\uAC1C.

[\uAE08\uC9C0]
- \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.`;
var MONTHLY_SCHOOL_PROMPTS = {
  ko: `${COMMON_HEADER3}

${KO_BODY3}`,
  "cn-ziping": `${COMMON_HEADER3}

${ZIPING_BODY3}`,
  "cn-mangpai": `${COMMON_HEADER3}

${MANGPAI_BODY3}`,
  jp: `${COMMON_HEADER3}

${JP_BODY3}`
};
var MONTHLY_USER_SUFFIX = `\uC704 \uBA85\uC870\uB97C \uB2E4\uC74C JSON \uC2A4\uD0A4\uB9C8\uB85C\uB9CC \uB2F5\uD558\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4 \uD5E4\uB354, \uD39C\uC2A4, prose \uC124\uBA85, \uC778\uC0AC\uB9D0 \uBAA8\uB450 \uAE08\uC9C0. '{' \uB85C \uC2DC\uC791\uD574\uC11C '}' \uB85C \uB05D\uB098\uB294 JSON \uBCF8\uBB38\uB9CC \uCD9C\uB825:
{"narrativeText":"800~1200\uC790 3\uBB38\uB2E8","sections":{"personality":"...","career":"...","relationship":"...","health":"...","daeunSummary":"...","keyTerms":[{"term":"...","gloss":"..."}],"cautions":["..."]},"schoolSpecific":{...\uD559\uD30C\uBCC4...},"citations":["\uCD9C\uCC981","\uCD9C\uCC982"]}`;
function buildMonthlyPrompt(frame, school) {
  return {
    system: MONTHLY_SCHOOL_PROMPTS[school],
    user: `\uBA85\uC870 \uBD84\uC11D:
${JSON.stringify(frame, null, 2)}

${MONTHLY_USER_SUFFIX}`
  };
}

// src/prompts/daily.ts
var COMMON_HEADER4 = `\uB2F9\uC2E0\uC740 30\uB144 \uACBD\uB825\uC758 \uC0AC\uC8FC \uBA85\uB9AC\uD559 \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uBE44\uC804\uBB38\uAC00 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC624\uB298 \uD558\uB8E8\uC758 \uD750\uB984\uC744 \uAE4A\uC774 \uC774\uD574\uC2DC\uD0A4\uB294 \uAC83\uC774 \uBAA9\uD45C\uC785\uB2C8\uB2E4.

[\uC791\uC131 \uC6D0\uCE59]
1. \uBD84\uB7C9: narrativeText \uC804\uCCB4 800~1200\uC790 (3\uBB38\uB2E8). \uAC01 sections \uD544\uB4DC\uB294 150~200\uC790.
2. \uC6A9\uC5B4 \uD480\uC774: \uD55C\uC790 \uC6A9\uC5B4\xB7\uBA85\uB9AC \uC804\uBB38\uC5B4\uAC00 \uCC98\uC74C \uB4F1\uC7A5\uD560 \uB54C \uC778\uB77C\uC778 \uAD04\uD638\uB85C \uD480\uC5B4 \uC124\uBA85. \uC608: \uC77C\uC6B4(\u65E5\u904B \u2014 \uC624\uB298 \uD558\uB8E8\uC758 \uC6B4), \uC77C\uC9C4(\u65E5\u8FB0 \u2014 \uC624\uB298 \uD558\uB8E8\uC758 \uAC04\uC9C0). \uB450 \uBC88\uC9F8 \uB4F1\uC7A5\uBD80\uD130\uB294 \uD480\uC774 \uC0DD\uB7B5.
3. \uC139\uC158\uBCC4 3\uCE35 \uAD6C\uC870:
   - personality: \uC624\uB298 \uB4DC\uB7EC\uB098\uB294 \uAE30\uC9C8\xB7\uD0DC\uB3C4
   - career: \uC9C1\uC5C5\xB7\uC7AC\uBB3C \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9 ("\uC624\uB298 \uC624\uC804 \uD68C\uC758\uC5D0\uC11C ~\uD560 \uB54C ~\uD558\uC138\uC694")
   - relationship: \uAD00\uACC4 \uC7A5\uBA74 \uAD6C\uCCB4 \uD589\uB3D9
   - health: \uAC74\uAC15 \uAD00\uB9AC \uAD6C\uCCB4 \uD589\uB3D9\xB7\uACC4\uC808\uC131
   - daeunSummary: \uC624\uB298 \uD750\uB984 \uC694\uC57D \u2014 \uC77C\uC9C4 \uAC04\uC9C0\uAC00 \uBA85\uC870 + \uD604\uC7AC \uB300\uC6B4/\uC138\uC6B4/\uC6D4\uC6B4\uACFC \uC5B4\uB5BB\uAC8C \uD638\uC751\xB7\uCDA9\uB3CC\uD558\uB294\uC9C0
4. \uD589\uB3D9 \uC9C0\uCE68\uC740 "\uADF8\uB798\uC11C \uC5B4\uB5BB\uAC8C" \uC758 \uC218\uC900\uAE4C\uC9C0. \uCD94\uC0C1\uC801 \uC870\uC5B8("\uADE0\uD615 \uC7A1\uC73C\uC138\uC694") \uAE08\uC9C0. \uC2DC\uAC04\uB300\xB7\uC0C1\uD669\xB7\uB300\uC0C1\uC744 \uBA85\uC2DC.
5. citations: \uC778\uC6A9\uD55C \uACE0\uC804/\uC804\uC801\uC758 \uD3B8\uBA85\uAE4C\uC9C0 \uBA85\uC2DC. \uCD5C\uC18C 2\uAC1C.`;
var KO_BODY4 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uD55C\uAD6D\uC2DD \uC790\uD3C9+\uC870\uD6C4+\uC2E0\uC0B4, \uC624\uB298 \uD558\uB8E8 \uC77C\uC6B4]

\uD55C\uAD6D\uC2DD \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC790\uD3C9\uC9C4\uC804\uC758 \uACA9\uAD6D\uB860\uC744 \uAE30\uBCF8\uC73C\uB85C \uD558\uB418, \uC870\uD6C4(\u8ABF\u5019)\uC640 \uC2E0\uC0B4(\u795E\u715E)\uC744 \uBE44\uC911 \uC788\uAC8C \uD65C\uC6A9.
- \uBC15\uC7AC\uC644\xB7\uBC15\uCCAD\uD654 \uACC4\uC5F4\uC758 \uC784\uC0C1 \uC0AC\uC8FC.
- \uC624\uB298 \uC77C\uC9C4 \uAC04\uC9C0\uAC00 \uBA85\uC870\uC758 \uC870\uD6C4\xB7\uC2E0\uC0B4\uC744 \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC624\uB298 \uC77C\uC9C4 \uAC04\uC9C0\uAC00 \uBA85\uC870\uC758 \uC870\uD6C4\uB97C \uC5B4\uB5BB\uAC8C \uD754\uB4DC\uB294\uC9C0 \uC9E7\uAC8C\uB77C\uB3C4 \uD55C \uB2E8\uB77D.
- \uC624\uB298 \uD65C\uC131 \uC2E0\uC0B4\uC758 \uBC1C\uD604 \uC591\uC0C1.
- schoolSpecific.joohuFocus \uC5D0 \uC624\uB298 \uBCF4\uC644\uD574\uC57C \uD560 \uC624\uD589\uACFC \uADFC\uAC70.
- schoolSpecific.shinsalNotes \uC5D0 \uC624\uB298 \uD65C\uC131 \uC2E0\uC0B4.

[\uAE08\uC9C0]
- \uC790\uD3C9\uC9C4\uC804 \uC6D0\uC804 \uC778\uC6A9. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var ZIPING_BODY4 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uC790\uD3C9\uC9C4\uC804\xB7\uC801\uCC9C\uC218, \uC624\uB298 \uD558\uB8E8 \uC77C\uC6B4]

\uC790\uD3C9\uC9C4\uC804 \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uACA9\uAD6D(\u683C\u5C40)\uACFC \uC6A9\uC2E0(\u7528\u795E) \uC758 \uCCA0\uD559\uC801 \uBD84\uC11D \uC911\uC2EC.
- \uC624\uB298 \uC77C\uC9C4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D\xB7\uC6A9\uC2E0\uACFC \uC5B4\uB5BB\uAC8C \uC0C1\uD638\uC791\uC6A9\uD558\uB294\uC9C0 \uBCF8\uB2E4.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC624\uB298 \uC77C\uC9C4 \uAC04\uC9C0\uAC00 \uACA9\uAD6D\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5 (\uBCF4\uAC15 / \uC190\uC0C1 / \uC911\uB9BD).
- \uC6A9\uC2E0\uACFC \uC77C\uC9C4 \uAC04\uC9C0\uC758 \uAD00\uACC4.
- schoolSpecific.gyeokgukRationale \uC5D0 \uACA9\uAD6D \uC131\uB9BD \uC870\uAC74\uACFC \uC624\uB298 \uC77C\uC9C4 \uC601\uD5A5.
- schoolSpecific.yongshinAnalysis \uC5D0 \uC6A9\uC2E0\uACFC \uC624\uB298 \uC77C\uC9C4\uC758 \uC791\uC6A9.

[\uAE08\uC9C0]
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.
- \uC751\uAE30 \uC2DC\uC810 \uB2E8\uC815. \uADF8\uAC74 cn-mangpai \uC758 \uC601\uC5ED.`;
var MANGPAI_BODY4 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC911\uAD6D \uB9F9\uD30C \uB2E8\uAC74\uC5C5, \uC624\uB298 \uD558\uB8E8 \uC77C\uC6B4]

\uB9F9\uD30C \uC0AC\uC8FC\uC758 \uD2B9\uC9D5:
- \uC751\uAE30(\u61C9\u671F) \uC640 \uC0AC\uAC74\uC131 \uC911\uC2EC.
- \uB2E8\uAC74\uC5C5 \uACC4\uC5F4 \uD1A4: \uC9C1\uC124\uC801\xB7\uB2E8\uC815\uC801.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC624\uB298 \uD558\uB8E8 \uC548\uC758 \uC2DC\uAC04\uB300 \uC751\uAE30 \uC2DC\uC810\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C (\uC624\uC804/\uC815\uC624/\uC624\uD6C4/\uC800\uB141).
- \uC0AC\uAC74\uC758 \uACB0\uC744 \uB2E8\uC5B4\uB85C (\uC7AC\uBB3C \uBCC0\uB3D9, \uAD00\uACC4 \uAC08\uB4F1, \uC774\uB3D9, \uACB0\uC815).
- schoolSpecific.eventTimings \uC5D0 \uC624\uB298 \uC2DC\uAC04\uB300 \uC751\uAE30 \uC2DC\uC810 3~5\uAC1C (period, event).

[\uAE08\uC9C0]
- "~\uD560 \uAC00\uB2A5\uC131\uC774 \uB192\uB2E4" \uB958 \uC57D\uD654 \uD45C\uD604. \uB2E8\uC815\uD615 \uC6B0\uC120.
- \uACA9\uAD6D \uCCA0\uD559 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.`;
var JP_BODY4 = `[\uD559\uD30C \uACE0\uC720 \uAD00\uC810 \u2014 \uC77C\uBCF8 \uCD94\uBA85\uD559, \uC624\uB298 \uD558\uB8E8 \uC77C\uC6B4]

\uC77C\uBCF8 \uCD94\uBA85\uD559\uC758 \uD2B9\uC9D5:
- 12\uAD81 + \uD1B5\uBCC0\uC131 \uC911\uC2EC.
- \u9AD8\u6728\u4E58 \uACC4\uC5F4 \uD1A4: \uCC28\uBD84\uD558\uACE0 \uC2E4\uC6A9\uC801.

[\uC791\uC131 \uC2DC \uAC15\uC870\uC810]
- \uC624\uB298 \uD65C\uC131\uD654\uB418\uB294 12\uAD81 3~5\uAC1C \uACE8\uB77C \uCC98\uC138.
- \uD1B5\uBCC0\uC131\uC73C\uB85C \uC77C\uC9C4 \uAC04\uC9C0\uC758 \uC758\uBBF8 \uD574\uC124.
- schoolSpecific.palaceMap \uC5D0 (palace, note) \uC30D 3~6\uAC1C.

[\uAE08\uC9C0]
- \uACA9\uAD6D \uC131\uB9BD/\uD30C\uAD34 \uD1A0\uB860. \uADF8\uAC74 cn-ziping \uC758 \uC601\uC5ED.
- \uC2E0\uC0B4\uC744 \uBA54\uC778\uC73C\uB85C \uB2E4\uB8E8\uAE30. \uADF8\uAC74 ko \uC758 \uC601\uC5ED.`;
var DAILY_SCHOOL_PROMPTS = {
  ko: `${COMMON_HEADER4}

${KO_BODY4}`,
  "cn-ziping": `${COMMON_HEADER4}

${ZIPING_BODY4}`,
  "cn-mangpai": `${COMMON_HEADER4}

${MANGPAI_BODY4}`,
  jp: `${COMMON_HEADER4}

${JP_BODY4}`
};
var DAILY_USER_SUFFIX = `\uC704 \uBA85\uC870\uB97C \uB2E4\uC74C JSON \uC2A4\uD0A4\uB9C8\uB85C\uB9CC \uB2F5\uD558\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4 \uD5E4\uB354, \uD39C\uC2A4, prose \uC124\uBA85, \uC778\uC0AC\uB9D0 \uBAA8\uB450 \uAE08\uC9C0. '{' \uB85C \uC2DC\uC791\uD574\uC11C '}' \uB85C \uB05D\uB098\uB294 JSON \uBCF8\uBB38\uB9CC \uCD9C\uB825:
{"narrativeText":"800~1200\uC790 3\uBB38\uB2E8","sections":{"personality":"...","career":"...","relationship":"...","health":"...","daeunSummary":"...","keyTerms":[{"term":"...","gloss":"..."}],"cautions":["..."]},"schoolSpecific":{...\uD559\uD30C\uBCC4...},"citations":["\uCD9C\uCC981","\uCD9C\uCC982"]}`;
function buildDailyPrompt(frame, school) {
  return {
    system: DAILY_SCHOOL_PROMPTS[school],
    user: `\uBA85\uC870 \uBD84\uC11D:
${JSON.stringify(frame, null, 2)}

${DAILY_USER_SUFFIX}`
  };
}

// src/schemas/lifetime.ts
import { z as z2 } from "zod";

// src/schemas/common.ts
function normalizeStringArray(v) {
  const toStr = (item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return Object.entries(item).map(([k, val]) => `${k}: ${typeof val === "string" ? val : JSON.stringify(val)}`).join(" / ");
    }
    return String(item);
  };
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.map(toStr);
  if (v && typeof v === "object") {
    return Object.entries(v).map(
      ([k, val]) => `${k}: ${typeof val === "string" ? val : JSON.stringify(val)}`
    );
  }
  return v;
}
function normalizeEventTiming(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return v;
  const obj = v;
  if (!obj.period && (obj.time || obj.timing || obj.timeSlot)) {
    return { ...obj, period: obj.time ?? obj.timing ?? obj.timeSlot };
  }
  return v;
}

// src/schemas/lifetime.ts
var sectionsSchema = z2.object({
  personality: z2.string().min(80),
  career: z2.string().min(80),
  relationship: z2.string().min(80),
  health: z2.string().min(80),
  daeunSummary: z2.string().min(80),
  keyTerms: z2.array(
    z2.object({
      term: z2.string().min(1),
      gloss: z2.string().min(1)
    })
  ).max(10).optional().default([]),
  cautions: z2.array(z2.string().min(1)).max(5).optional().default([])
});
var baseOutputSchema = z2.object({
  narrativeText: z2.string().min(500).max(2500),
  sections: sectionsSchema,
  citations: z2.array(z2.string().min(1)).min(1)
});
var koSpecificSchema = z2.object({
  joohuFocus: z2.string().min(30),
  shinsalNotes: z2.preprocess(normalizeStringArray, z2.array(z2.string().min(1)).min(1))
});
var zipingSpecificSchema = z2.object({
  gyeokgukRationale: z2.string().min(40),
  yongshinAnalysis: z2.string().min(40)
});
var mangpaiSpecificSchema = z2.object({
  eventTimings: z2.array(
    z2.preprocess(
      normalizeEventTiming,
      z2.object({
        period: z2.string().min(1),
        event: z2.string().min(1)
      })
    )
  ).min(3).max(8)
});
var jpSpecificSchema = z2.object({
  palaceMap: z2.array(
    z2.object({
      palace: z2.string().min(1),
      note: z2.string().min(1)
    })
  ).min(5).max(12)
});
var koSchema = baseOutputSchema.extend({ schoolSpecific: koSpecificSchema });
var zipingSchema = baseOutputSchema.extend({
  schoolSpecific: zipingSpecificSchema
});
var mangpaiSchema = baseOutputSchema.extend({
  schoolSpecific: mangpaiSpecificSchema
});
var jpSchema = baseOutputSchema.extend({ schoolSpecific: jpSpecificSchema });
var LIFETIME_SCHOOL_SCHEMAS = {
  ko: koSchema,
  "cn-ziping": zipingSchema,
  "cn-mangpai": mangpaiSchema,
  jp: jpSchema
};

// src/schemas/yearly.ts
import { z as z3 } from "zod";
var sectionsSchema2 = z3.object({
  personality: z3.string().min(50),
  career: z3.string().min(50),
  relationship: z3.string().min(50),
  health: z3.string().min(50),
  daeunSummary: z3.string().min(50),
  keyTerms: z3.array(
    z3.object({
      term: z3.string().min(1),
      gloss: z3.string().min(1)
    })
  ).max(8).optional().default([]),
  cautions: z3.array(z3.string().min(1)).max(5).optional().default([])
});
var baseOutputSchema2 = z3.object({
  narrativeText: z3.string().min(300).max(2e3),
  sections: sectionsSchema2,
  citations: z3.array(z3.string().min(1)).min(1)
});
var koSpecificSchema2 = z3.object({
  joohuFocus: z3.string().min(20),
  shinsalNotes: z3.preprocess(normalizeStringArray, z3.array(z3.string().min(1)).min(1))
});
var zipingSpecificSchema2 = z3.object({
  gyeokgukRationale: z3.string().min(30),
  yongshinAnalysis: z3.string().min(30)
});
var mangpaiSpecificSchema2 = z3.object({
  eventTimings: z3.array(
    z3.preprocess(
      normalizeEventTiming,
      z3.object({
        period: z3.string().min(1),
        event: z3.string().min(1)
      })
    )
  ).min(3).max(6)
});
var jpSpecificSchema2 = z3.object({
  palaceMap: z3.array(
    z3.object({
      palace: z3.string().min(1),
      note: z3.string().min(1)
    })
  ).min(5).max(8)
});
var koSchema2 = baseOutputSchema2.extend({ schoolSpecific: koSpecificSchema2 });
var zipingSchema2 = baseOutputSchema2.extend({
  schoolSpecific: zipingSpecificSchema2
});
var mangpaiSchema2 = baseOutputSchema2.extend({
  schoolSpecific: mangpaiSpecificSchema2
});
var jpSchema2 = baseOutputSchema2.extend({ schoolSpecific: jpSpecificSchema2 });
var YEARLY_SCHOOL_SCHEMAS = {
  ko: koSchema2,
  "cn-ziping": zipingSchema2,
  "cn-mangpai": mangpaiSchema2,
  jp: jpSchema2
};

// src/schemas/monthly.ts
import { z as z4 } from "zod";
var sectionsSchema3 = z4.object({
  personality: z4.string().min(30),
  career: z4.string().min(30),
  relationship: z4.string().min(30),
  health: z4.string().min(30),
  daeunSummary: z4.string().min(30),
  keyTerms: z4.array(
    z4.object({
      term: z4.string().min(1),
      gloss: z4.string().min(1)
    })
  ).max(6).optional().default([]),
  cautions: z4.preprocess(
    (v) => Array.isArray(v) && v.length > 5 ? v.slice(0, 5) : v,
    z4.array(z4.string().min(1)).max(5).optional().default([])
  )
});
var baseOutputSchema3 = z4.object({
  narrativeText: z4.string().min(200).max(1500),
  sections: sectionsSchema3,
  citations: z4.array(z4.string().min(1)).min(1)
});
var koSpecificSchema3 = z4.object({
  joohuFocus: z4.string().min(20),
  shinsalNotes: z4.preprocess(normalizeStringArray, z4.array(z4.string().min(1)).min(1))
});
var zipingSpecificSchema3 = z4.object({
  gyeokgukRationale: z4.string().min(30),
  yongshinAnalysis: z4.string().min(30)
});
var mangpaiSpecificSchema3 = z4.object({
  eventTimings: z4.array(
    z4.preprocess(
      normalizeEventTiming,
      z4.object({
        period: z4.string().min(1),
        event: z4.string().min(1)
      })
    )
  ).min(3).max(5)
});
var jpSpecificSchema3 = z4.object({
  palaceMap: z4.array(
    z4.object({
      palace: z4.string().min(1),
      note: z4.string().min(1)
    })
  ).min(3).max(6)
});
var koSchema3 = baseOutputSchema3.extend({ schoolSpecific: koSpecificSchema3 });
var zipingSchema3 = baseOutputSchema3.extend({
  schoolSpecific: zipingSpecificSchema3
});
var mangpaiSchema3 = baseOutputSchema3.extend({
  schoolSpecific: mangpaiSpecificSchema3
});
var jpSchema3 = baseOutputSchema3.extend({ schoolSpecific: jpSpecificSchema3 });
var MONTHLY_SCHOOL_SCHEMAS = {
  ko: koSchema3,
  "cn-ziping": zipingSchema3,
  "cn-mangpai": mangpaiSchema3,
  jp: jpSchema3
};

// src/schemas/daily.ts
import { z as z5 } from "zod";
var sectionsSchema4 = z5.object({
  personality: z5.string().min(30),
  career: z5.string().min(30),
  relationship: z5.string().min(30),
  health: z5.string().min(30),
  daeunSummary: z5.string().min(30),
  keyTerms: z5.array(
    z5.object({
      term: z5.string().min(1),
      gloss: z5.string().min(1)
    })
  ).max(6).optional().default([]),
  cautions: z5.preprocess(
    (v) => Array.isArray(v) && v.length > 5 ? v.slice(0, 5) : v,
    z5.array(z5.string().min(1)).max(5).optional().default([])
  )
});
var baseOutputSchema4 = z5.object({
  narrativeText: z5.string().min(200).max(1500),
  sections: sectionsSchema4,
  citations: z5.array(z5.string().min(1)).min(1)
});
var koSpecificSchema4 = z5.object({
  joohuFocus: z5.string().min(20),
  shinsalNotes: z5.preprocess(normalizeStringArray, z5.array(z5.string().min(1)).min(1))
});
var zipingSpecificSchema4 = z5.object({
  gyeokgukRationale: z5.string().min(30),
  yongshinAnalysis: z5.string().min(30)
});
var mangpaiSpecificSchema4 = z5.object({
  eventTimings: z5.array(
    z5.preprocess(
      normalizeEventTiming,
      z5.object({
        period: z5.string().min(1),
        event: z5.string().min(1)
      })
    )
  ).min(3).max(5)
});
var jpSpecificSchema4 = z5.object({
  palaceMap: z5.array(
    z5.object({
      palace: z5.string().min(1),
      note: z5.string().min(1)
    })
  ).min(3).max(6)
});
var koSchema4 = baseOutputSchema4.extend({ schoolSpecific: koSpecificSchema4 });
var zipingSchema4 = baseOutputSchema4.extend({
  schoolSpecific: zipingSpecificSchema4
});
var mangpaiSchema4 = baseOutputSchema4.extend({
  schoolSpecific: mangpaiSpecificSchema4
});
var jpSchema4 = baseOutputSchema4.extend({ schoolSpecific: jpSpecificSchema4 });
var DAILY_SCHOOL_SCHEMAS = {
  ko: koSchema4,
  "cn-ziping": zipingSchema4,
  "cn-mangpai": mangpaiSchema4,
  jp: jpSchema4
};
export {
  ALGORITHM_VERSION,
  BRANCHES,
  BRANCH_ELEMENT,
  BRANCH_KO,
  DAILY_SCHOOL_PROMPTS,
  DAILY_SCHOOL_SCHEMAS,
  ELEMENT_HANJA,
  ELEMENT_KO,
  LIFETIME_SCHOOL_PROMPTS,
  LIFETIME_SCHOOL_SCHEMAS,
  MONTHLY_SCHOOL_PROMPTS,
  MONTHLY_SCHOOL_SCHEMAS,
  PROMPT_VERSIONS,
  STEMS,
  STEM_ELEMENT,
  STEM_KO,
  TEN_GOD_KO,
  YEARLY_SCHOOL_PROMPTS,
  YEARLY_SCHOOL_SCHEMAS,
  buildDailyLiteCnMangpai,
  buildDailyLiteCnZiping,
  buildDailyLiteJp,
  buildDailyLiteKo,
  buildDailyPrompt,
  buildLifetimePrompt,
  buildMonthlyCnMangpai,
  buildMonthlyCnZiping,
  buildMonthlyJp,
  buildMonthlyKo,
  buildMonthlyPrompt,
  buildTriNationDailyLite,
  buildTriNationDailyLiteFromBirth,
  buildTriNationLifetime,
  buildTriNationMonthly,
  buildTriNationMonthlyFromBirth,
  buildTriNationYearly,
  buildTriNationYearlyFromBirth,
  buildYearlyCnMangpai,
  buildYearlyCnZiping,
  buildYearlyJp,
  buildYearlyKo,
  buildYearlyPrompt,
  buildYongshinCnMangpai,
  buildYongshinCnZiping,
  buildYongshinJp,
  buildYongshinKo,
  computeDayPillar,
  computeFrameHash,
  computeInteractions,
  computeMonthPillars,
  computeSajuChart,
  computeShensha,
  computeYearPillar,
  computeYearPillarFromDate,
  dailyFortuneHourSlotSchema,
  dailyFortunePayloadSchema,
  dailyFortuneRemedySchema,
  dailyFortuneScoreSchema,
  deriveDaeunDirection,
  findCity,
  hashProfile,
  resolveChartContext,
  resolveTrueSolar,
  searchCities,
  tenGodsForPillar,
  verifyConsensus
};
//# sourceMappingURL=index.js.map