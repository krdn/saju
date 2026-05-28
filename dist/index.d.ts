import { z } from 'zod';

declare const STEMS: readonly ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
type Stem = (typeof STEMS)[number];
declare const BRANCHES: readonly ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
type Branch = (typeof BRANCHES)[number];
declare const STEM_KO: Record<Stem, string>;
declare const BRANCH_KO: Record<Branch, string>;
type Element = "wood" | "fire" | "earth" | "metal" | "water";
declare const ELEMENT_KO: Record<Element, string>;
declare const ELEMENT_HANJA: Record<Element, string>;
declare const STEM_ELEMENT: Record<Stem, Element>;
declare const BRANCH_ELEMENT: Record<Branch, Element>;
type TenGod = "比肩" | "劫財" | "食神" | "傷官" | "偏財" | "正財" | "偏官" | "正官" | "偏印" | "正印";
declare const TEN_GOD_KO: Record<TenGod, string>;

interface Pillar {
    stem: Stem;
    branch: Branch;
}
interface SajuPillars {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
}
interface ElementCount {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
}
interface TenGodAssignment {
    yearStem: TenGod;
    yearBranch: TenGod;
    monthStem: TenGod;
    monthBranch: TenGod;
    dayBranch: TenGod;
    hourStem: TenGod | null;
    hourBranch: TenGod | null;
}
interface MajorFortune {
    startAge: number;
    startYear: number;
    stem: Stem;
    branch: Branch;
}
type Strength = "신강" | "신약" | "균형" | "종아" | "종재" | "종살";
interface SajuChart {
    pillars: SajuPillars;
    elements: ElementCount;
    strength: Strength;
    tenGods: TenGodAssignment;
    pattern: string;
    yongSin: Element[];
    giSin: Element[];
    majorFortunes: MajorFortune[];
    inputHash: string;
}
interface ComputeSajuInput {
    birthDate: string;
    birthTime: string | null;
    calendar: "solar" | "lunar";
    gender: "male" | "female";
    birthCity: string | null;
}

declare function computeSajuChart(input: ComputeSajuInput): SajuChart;

declare function hashProfile(input: ComputeSajuInput): string;

/** 양력 년도 → 그 해의 간지. 입춘 후 6월 1일 정오 기준. */
declare function computeYearPillar(year: number): Pillar;
/** 특정 양력 날짜 기준의 연주. 입춘 경계 정확히 반영. */
declare function computeYearPillarFromDate(date: string): Pillar;

interface MonthPillar {
    monthIndex: number;
    pillar: Pillar;
    startSolarDate: string;
    endSolarDate: string;
}
/**
 * 양력 년도 → 12개월 간지. 각 월의 15일 기준 EightChar.getMonthGan/Zhi 호출.
 * 절기 시작일은 정확히 계산하지 않고 YYYY-MM-15 근사값을 display 용으로 제공.
 */
declare function computeMonthPillars(year: number): MonthPillar[];

/** 양력 날짜 (YYYY-MM-DD) → 일진 간지. */
declare function computeDayPillar(date: string): Pillar;

/**
 * 일간 + 외부 간지 → 십신 쌍.
 * 세운·월운·일진 해석에서 일간 vs 그 시점 간지의 관계를 도출.
 */
declare function tenGodsForPillar(dayStem: Stem, pillar: Pillar): {
    stemTenGod: TenGod;
    branchTenGod: TenGod;
};

declare const dailyFortuneScoreSchema: z.ZodObject<{
    label: z.ZodString;
    score: z.ZodNumber;
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    label: string;
    score: number;
    note: string;
}, {
    label: string;
    score: number;
    note: string;
}>;
declare const dailyFortuneHourSlotSchema: z.ZodObject<{
    range: z.ZodString;
    vibe: z.ZodString;
    isGolden: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    range: string;
    vibe: string;
    isGolden?: boolean | undefined;
}, {
    range: string;
    vibe: string;
    isGolden?: boolean | undefined;
}>;
declare const dailyFortuneRemedySchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString, "many">;
    directions: z.ZodArray<z.ZodString, "many">;
    foods: z.ZodArray<z.ZodString, "many">;
    items: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    colors: string[];
    directions: string[];
    foods: string[];
    items: string[];
}, {
    colors: string[];
    directions: string[];
    foods: string[];
    items: string[];
}>;
declare const dailyFortunePayloadSchema: z.ZodObject<{
    forDate: z.ZodString;
    dayPillar: z.ZodString;
    summary: z.ZodString;
    overallScore: z.ZodNumber;
    scores: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        score: z.ZodNumber;
        note: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        score: number;
        note: string;
    }, {
        label: string;
        score: number;
        note: string;
    }>, "many">;
    hourly: z.ZodArray<z.ZodObject<{
        range: z.ZodString;
        vibe: z.ZodString;
        isGolden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        range: string;
        vibe: string;
        isGolden?: boolean | undefined;
    }, {
        range: string;
        vibe: string;
        isGolden?: boolean | undefined;
    }>, "many">;
    recommendations: z.ZodArray<z.ZodString, "many">;
    cautions: z.ZodArray<z.ZodString, "many">;
    remedy: z.ZodObject<{
        colors: z.ZodArray<z.ZodString, "many">;
        directions: z.ZodArray<z.ZodString, "many">;
        foods: z.ZodArray<z.ZodString, "many">;
        items: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        colors: string[];
        directions: string[];
        foods: string[];
        items: string[];
    }, {
        colors: string[];
        directions: string[];
        foods: string[];
        items: string[];
    }>;
    closing: z.ZodString;
}, "strip", z.ZodTypeAny, {
    forDate: string;
    dayPillar: string;
    summary: string;
    overallScore: number;
    scores: {
        label: string;
        score: number;
        note: string;
    }[];
    hourly: {
        range: string;
        vibe: string;
        isGolden?: boolean | undefined;
    }[];
    recommendations: string[];
    cautions: string[];
    remedy: {
        colors: string[];
        directions: string[];
        foods: string[];
        items: string[];
    };
    closing: string;
}, {
    forDate: string;
    dayPillar: string;
    summary: string;
    overallScore: number;
    scores: {
        label: string;
        score: number;
        note: string;
    }[];
    hourly: {
        range: string;
        vibe: string;
        isGolden?: boolean | undefined;
    }[];
    recommendations: string[];
    cautions: string[];
    remedy: {
        colors: string[];
        directions: string[];
        foods: string[];
        items: string[];
    };
    closing: string;
}>;
type DailyFortuneScore = z.infer<typeof dailyFortuneScoreSchema>;
type DailyFortuneHourSlot = z.infer<typeof dailyFortuneHourSlotSchema>;
type DailyFortuneRemedy = z.infer<typeof dailyFortuneRemedySchema>;
type DailyFortunePayload = z.infer<typeof dailyFortunePayloadSchema>;

interface CityInfo {
    name: string;
    nameKo: string;
    country: "KR" | "JP" | "CN";
    longitudeDeg: number;
    timezone: string;
}
declare function findCity(query: string): CityInfo | undefined;
declare function searchCities(prefix: string, limit?: number): CityInfo[];

interface ResolveInput {
    birthDateLocal: string;
    birthTimeLocal: string;
    timezone: string;
    longitudeDeg: number;
    calendar: "solar" | "lunar";
    gender: "male" | "female";
}
interface ResolvedMoment {
    utcInstant: Date;
    trueSolarMinutesOffset: number;
    ambiguityWindow?: {
        boundaryHour: number;
        candidateBranches: [Branch, Branch];
    };
    hourKnown: boolean;
}
declare function resolveTrueSolar(input: ResolveInput): ResolvedMoment;

/**
 * 만세력 합의 검증 — lunar-javascript 와 korean-lunar-calendar 두 라이브러리가
 * 동일한 일주를 반환하는지 비교한다. 라이브러리 업데이트로 인한 silent regression
 * 을 막기 위한 안전장치.
 */
interface ConsensusInput {
    /** "YYYY-MM-DD" (local date) */
    birthDateLocal: string;
    /** 현재는 solar 만 지원. lunar 은 추후 확장. */
    calendar: "solar" | "lunar";
}
type ConsensusResult = {
    ok: true;
    dayPillar: {
        stem: string;
        branch: string;
    };
} | {
    ok: false;
    libA: {
        stem: string;
        branch: string;
    };
    libB: {
        stem: string;
        branch: string;
    };
};
/**
 * 두 만세력 라이브러리가 동일 일자에 대해 같은 일주를 반환하는지 검증.
 * - libA: lunar-javascript (`Solar → Lunar → EightChar.getDayGan/Zhi`)
 * - libB: korean-lunar-calendar (`getChineseGapja().day`, e.g. "壬辰日")
 */
declare function verifyConsensus(input: ConsensusInput): ConsensusResult;

/**
 * 신살(神煞) — 사주의 길흉 보조 지표.
 * v0.1 은 핵심 3개만 구현: 괴강(魁罡), 천을귀인(天乙貴人), 도화(桃花).
 *
 * 출처 — 한국 정통 명리학 기준 (한국 비중 35% 가중치):
 * - 괴강: 일주 기준 (壬辰, 庚辰, 庚戌, 戊戌)
 * - 천을귀인: 일간 → 지지 매칭 (전체 사주 스캔)
 * - 도화: 년지 삼합국 패지 (子午卯酉 중 하나)
 */
interface ShenshaEntry {
    name: "괴강" | "천을귀인" | "도화";
    hanja: string;
    pillar: "year" | "month" | "day" | "hour";
    meaning: string;
}
declare function computeShensha(pillars: SajuPillars): ShenshaEntry[];

/**
 * 합충형(合冲刑) — 사주 지지 상호작용.
 * 순수 함수: 4기둥 입력 → {hap, chong, hyung}.
 *
 * - 육합(六合): 두 지지가 결합 (子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未)
 * - 충(冲):    두 지지가 정면 충돌 (子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥)
 * - 형(刑):    삼형(寅巳申, 丑戌未), 상형(子卯), 자형(辰辰·午午·酉酉·亥亥)
 */
type HyungType = "삼형" | "상형" | "자형";
interface Interactions {
    hap: Array<{
        branches: Branch[];
        type: "육합";
    }>;
    chong: Array<{
        branches: Branch[];
        type: "충";
    }>;
    hyung: Array<{
        branches: Branch[];
        type: HyungType;
    }>;
}
declare function computeInteractions(pillars: SajuPillars): Interactions;

type School = "ko" | "cn-ziping" | "cn-mangpai" | "jp";
type SchoolWithCompose = School | "compose";
/**
 * 진태양시(真太陽時) 메타데이터.
 *
 * - `trueSolarMinutesOffset`: 시계시 대비 진태양시 보정 분 (음수=시계시가 빠름).
 * - `hourKnown`: 출생 시각이 알려져 있는지 — false 면 시주 미상, 추명학 등은 정확도 ⚠.
 *
 * Phase 4 어댑터 공통 `ctx.trueSolar` 입력 + `TriNationLifetime.trueSolar` 출력에서
 * 공유 사용.
 */
interface TrueSolarMeta {
    trueSolarMinutesOffset: number;
    hourKnown: boolean;
}
interface ExtendedChart {
    shensha: ShenshaEntry[];
    interactions: Interactions;
    trueSolarMinutesOffset: number;
    hourAmbiguity?: {
        boundaryHour: number;
        candidateBranches: [Branch, Branch];
    };
}
interface PillarAnnotation {
    pillar: "year" | "month" | "day" | "hour";
    stem: Stem;
    branch: Branch;
    tenGod?: TenGod;
    stage12?: string;
    note?: string;
}
interface DaeunHighlight {
    startAge: number;
    pillar: "year" | "month" | "day" | "hour";
    significance: "길" | "흉" | "평" | "변화";
    reason: string;
}
interface LifetimeFrame {
    school: School;
    pillarsAnnotated: PillarAnnotation[];
    formatGyeokguk: {
        name: string;
        reasoning: string;
    };
    yongshin?: {
        element: Element;
        reasoning: string;
    };
    daeunHighlights: DaeunHighlight[];
    careerHints: string[];
    relationshipHints: string[];
    healthHints: string[];
    cautions: string[];
    schoolSpecific: Record<string, unknown>;
}
interface ConsensusReport {
    consensus: boolean;
    schools: Partial<Record<School, string>>;
}
interface Conflict {
    field: "yongshin" | "gyeokguk";
    schools: Partial<Record<School, string>>;
}
interface TriNationLifetime {
    chart: ExtendedChart;
    /** 원본 SajuChart (pillars/elements/pattern/tenGods/strength/majorFortunes). ExtendedChart는 학파 통합 확장. */
    rawChart: SajuChart;
    /**
     * 대운 시작 정보. 10개 대운 pillar 자체는 rawChart.majorFortunes 를 참조한다
     * (stem/branch/startAge + startYear). 여기서는 학파 공통 메타데이터만 보관.
     */
    daeun: {
        startAge: number;
        direction: "forward" | "backward";
    };
    trueSolar: TrueSolarMeta;
    frames: {
        ko: LifetimeFrame;
        cnZiping: LifetimeFrame;
        cnMangpai: LifetimeFrame;
        jp: LifetimeFrame;
    };
    crossCheck: {
        pillarsAgree: boolean;
        gyeokgukConsensus: ConsensusReport;
        yongshinConflicts: Conflict[];
    };
}
type Result<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: SajuError;
};
interface SajuError {
    code: "INVALID_INPUT" | "OUT_OF_RANGE" | "AMBIGUOUS_HOUR" | "MISSING_HOUR" | "LIBRARY_MISMATCH";
    message: string;
    details?: unknown;
}

/** buildTriNationLifetime 입력 — 출생 정보 + 성별. */
interface BirthInputResolved {
    birthDateLocal: string;
    birthTimeLocal: string;
    timezone: string;
    longitudeDeg: number;
    calendar: "solar" | "lunar";
    gender: "male" | "female";
}
/**
 * 양간(陽干): 甲丙戊庚壬 (index 짝수), 음간(陰干): 乙丁己辛癸 (index 홀수).
 *
 * 명리학 규칙:
 * - 양간 + 男 → 순행(forward)
 * - 양간 + 女 → 역행(backward)
 * - 음간 + 男 → 역행(backward)
 * - 음간 + 女 → 순행(forward)
 */
declare function deriveDaeunDirection(yearStem: Stem, gender: "male" | "female"): "forward" | "backward";
/**
 * Phase 5 compose — 4 학파 어댑터 통합 + 만세력 합의 검증 + crossCheck.
 *
 * 입력은 `BirthInputResolved`(생일/생시/타임존/경도/달력/성별). 출력은 `Result<TriNationLifetime>`
 * — 만세력 라이브러리 불일치 시 `error.code = "LIBRARY_MISMATCH"`. 그 외 어댑터별 예외는
 * `safe()` 폴백으로 흡수해 4 frame 항상 노출 (single-school failure 가 전체 응답을 막지 않음).
 *
 * 설계 결정:
 * - **sync 함수**: 하부 모듈(resolveTrueSolar/verifyConsensus/computeSajuChart/어댑터 4종) 모두
 *   sync. async 래핑은 불필요 — KISS.
 * - **`TriNationLifetime.chart` = `ExtendedChart` 4 필드만**: plan 의 chart spread 패턴은
 *   typed contract 위배. shensha/interactions/trueSolarMinutesOffset/hourAmbiguity 만 구성.
 *   Phase 6 API serialization 단계에서 raw chart(pillars/elements/...) 노출 필요 시 별도 필드 추가.
 * - **daeun.direction**: `computeMajorFortunes` 가 direction 을 반환하지 않으므로 연간 stem 양음
 *   + 성별로 derive (`daeun/extended.test.ts` 의 "음년(丁未) 男 → 역행" 규칙 일치).
 * - **yongshinConflicts**: v0.1 의 4 어댑터 모두 `yongshin: undefined` (3개 학파는 미구현,
 *   jp 학파는 본래 미사용) → trivial 빈 배열. Phase 6+ 어댑터 본격 구현 시 실 비교 필요.
 * - **pillarsAgree**: v0.1 의 4 어댑터 모두 `pillarsAnnotated: []` (미구현) → trivial true.
 *   Phase 6+ 어댑터 본격 구현 시 실 비교 필요.
 *
 * @throws verifyConsensus 내부에서 throw 발생 가능 (예: lunar calendar 입력 처리 중). LIBRARY_MISMATCH는 throw 가 아닌 Result.error로 반환된다.
 */
declare function buildTriNationLifetime(input: BirthInputResolved): Result<TriNationLifetime>;

interface ChartContext {
    chart: SajuChart;
    daeun: MajorFortune[];
    trueSolar: ResolvedMoment;
}
/**
 * 출생 정보 → 검증된 차트 컨텍스트.
 *
 * 4개 시간축(lifetime/yearly/monthly/daily) FromBirth wrapper 가 공유하는
 * 파이프라인: resolveTrueSolar → verifyConsensus → computeSajuChart + computeMajorFortunes.
 * 만세력 라이브러리 불일치 시 LIBRARY_MISMATCH Result.error 반환.
 */
declare function resolveChartContext(input: BirthInputResolved): Result<ChartContext>;

type ShenVerdict = "신강" | "신약" | "균형" | "종아" | "종재" | "종살";

interface KoYongshin {
    school: "ko";
    primary: Element;
    secondary?: Element;
    gisin: Element[];
    basisShenStrength: ShenVerdict;
    basisJohuMode: "한랭" | "조열" | "균형";
    rationale?: string;
}
interface CnZipingYongshin {
    school: "cn-ziping";
    primary: Element;
    gisin: Element[];
    basisShenStrength: ShenVerdict;
    structureHint?: "식신생재" | "관인상생" | "기타";
    rationale?: string;
}
interface CnMangpaiYongshin {
    school: "cn-mangpai";
    primary: Element;
    gisin: Element[];
    emergenceHint: string;
}
interface JpYongshin {
    school: "jp";
    favorable: string[];
    unfavorable: string[];
}
type Yongshin = KoYongshin | CnZipingYongshin | CnMangpaiYongshin | JpYongshin;
interface ShenStrengthBasis {
    dayStem: Stem;
    monthBranch: string;
    supportScore: number;
    drainScore: number;
    verdict: ShenVerdict;
}

interface YearlyFrame {
    school: "ko" | "cn-ziping" | "cn-mangpai" | "jp";
    targetYear: number;
    yearGanji: {
        stem: Stem;
        branch: Branch;
    };
    currentDaeun: {
        startAge: number;
        endAge: number;
        ganji: {
            stem: Stem;
            branch: Branch;
        };
    };
    daeunTransition: {
        willTransitionAt: number;
        nextGanji: {
            stem: Stem;
            branch: Branch;
        };
    } | null;
    ganjiInteractions: {
        type: "충" | "합" | "형" | "파" | "해";
        subject: {
            pillar: "year" | "month" | "day" | "hour";
            element: Stem | Branch;
        };
        object: Stem | Branch;
    }[];
    yongShinDelta: {
        reinforced: Element[];
        weakened: Element[];
        netVerdict: "favorable" | "unfavorable" | "mixed";
    };
    schoolSpecificHints: Record<string, string>;
    shensha: {
        name: string;
        pillar: string;
    }[];
    yongShinUsed: Yongshin;
}
interface TriNationYearly {
    targetYear: number;
    frames: {
        ko: YearlyFrame;
        cnZiping: YearlyFrame;
        cnMangpai: YearlyFrame;
        jp: YearlyFrame;
    };
    crossCheck: {
        agreement: "high" | "medium" | "low";
        notes: string[];
    };
}

/**
 * 한국식 자평 + 조후 혼합 — v0.3.
 *
 * 우선순위:
 *  1. 종격 (jonggyeokKind != null)
 *  2. 격국 분기 (4 격국 × 2 신강도)
 *  3. fallback — 기본 자평
 *
 * 조후 보조용신은 항상 결합 — 한랭 → 火 / 조열 → 水.
 */
declare function buildYongshinKo(chart: SajuChart): KoYongshin;

/**
 * 한국식 년운 어댑터 — 세군 ↔ 원국 충/합 + 용신 강약 변화 + 대운 전환 hint.
 */
declare function buildYearlyKo(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    yongShin: KoYongshin;
    currentAge: number;
}): YearlyFrame;

/**
 * 중국 자평 — 억부 단일 룰 (조후 미반영) — v0.3.
 *
 * 우선순위: 종격 → 격국 → fallback.
 */
declare function buildYongshinCnZiping(chart: SajuChart): CnZipingYongshin;

/**
 * 중국 자평 년운 어댑터 — KO 와 동일 구조, schoolSpecificHints 만 structureHint
 * 기반. yongShin 에 secondary 가 없으므로 reinforced 룰도 단순 (primary 만 검사).
 */
declare function buildYearlyCnZiping(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    yongShin: CnZipingYongshin;
    currentAge: number;
}): YearlyFrame;

/**
 * 중국 맹파 — 단건업(段建業) 체계.
 *
 * 본 학파는 용신을 "응기 시점 시그널" 로 해석한다. v0.2 는 일간별 대표 용신
 * 1개(식상) + 월지에서 응기 hint 도출. 전체 120 조합 표는 v0.3.
 */
declare function buildYongshinCnMangpai(chart: SajuChart): CnMangpaiYongshin;

/**
 * 중국 맹파 년운 어댑터 — schoolSpecificHints 에 응기(emergence) hint 노출.
 */
declare function buildYearlyCnMangpai(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    yongShin: CnMangpaiYongshin;
    currentAge: number;
}): YearlyFrame;

/**
 * 일본 추명학 — 阿部泰山 12궁 통변성 우선순위.
 *
 * 룰: 통변성 5종 (비겁/식상/재성/관성/인성) 중 처세에 유리/불리한 통변성을
 * 분리. v0.2 는 일간 무관 기본 우선순위 사용 (재성·관성·인성 favorable /
 * 식상·비겁 unfavorable).
 *
 * v0.3 에서 일간별 12궁 위치 (생/욕/대/관/왕/쇠/병/사/묘/절/태/양) 별 미세
 * 조정 도입 예정.
 */
declare function buildYongshinJp(_chart: SajuChart): JpYongshin;

/**
 * 일본 추명학 년운 어댑터 — 12궁 통변성 favorable/unfavorable hint 노출.
 *
 * JP yongShin 은 오행 단위가 아닌 통변성 (재성/관성/인성 vs 식상/비겁) 단위라
 * yongShinDelta 는 항상 비어있고 netVerdict 는 "mixed".
 */
declare function buildYearlyJp(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    yongShin: JpYongshin;
    currentAge: number;
}): YearlyFrame;

declare function buildTriNationYearly(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    currentAge: number;
}): TriNationYearly;
declare function buildTriNationYearlyFromBirth(args: {
    input: BirthInputResolved;
    targetYear: number;
    currentAge: number;
}): Result<TriNationYearly>;

/**
 * 사주 알고리즘 전체 버전.
 *
 * - v1: v0.2 종료 시점 (단순 개수 룰 + 종격 무, 격국-용신 미연동)
 * - v2: v0.3 도입 (자평 룰 통합 + 종격 + 격국-용신 연동, ko/cn-ziping)
 *
 * bump 트리거: shen-strength / jonggyeok / gyeokguk-yongshin 모듈 변경 시.
 * 캐시 키 (saju_charts, yearly_tri, lifetime_narrative, yearly_narrative) 에 모두 포함되어 자동 무효화.
 */
declare const ALGORITHM_VERSION = 2;

interface MonthlyFrame {
    school: "ko" | "cn-ziping" | "cn-mangpai" | "jp";
    targetYear: number;
    targetMonth: number;
    monthGanji: {
        stem: Stem;
        branch: Branch;
    };
    currentDaeun: {
        startAge: number;
        endAge: number;
        ganji: {
            stem: Stem;
            branch: Branch;
        };
    };
    daeunTransition: {
        willTransitionAt: number;
        nextGanji: {
            stem: Stem;
            branch: Branch;
        };
    } | null;
    ganjiInteractions: {
        type: "충" | "합" | "형" | "파" | "해";
        subject: {
            pillar: "year" | "month" | "day" | "hour";
            element: Stem | Branch;
        };
        object: Stem | Branch;
    }[];
    yongShinDelta: {
        reinforced: Element[];
        weakened: Element[];
        netVerdict: "favorable" | "unfavorable" | "mixed";
    };
    schoolSpecificHints: Record<string, string>;
    shensha: {
        name: string;
        pillar: string;
    }[];
    yongShinUsed: Yongshin;
}
interface TriNationMonthly {
    targetYear: number;
    targetMonth: number;
    frames: {
        ko: MonthlyFrame;
        cnZiping: MonthlyFrame;
        cnMangpai: MonthlyFrame;
        jp: MonthlyFrame;
    };
    crossCheck: {
        agreement: "high" | "medium" | "low";
        notes: string[];
    };
}

/**
 * 한국식 월운 어댑터 — 월간지 ↔ 원국 충/합 + 용신 강약 + 대운 전환 hint.
 *
 * yearly KO 와 거의 동일하되 yearGanji → monthGanji 치환 + targetMonth 추가.
 * daeunTransition 의미: monthly 에서도 "currentAge+1 에 transition" 으로 yearly 와 동일
 * 로직 — 1년 안에 대운 전환이 있는 달들 모두 동일 hint 받음 (의도된 동작).
 */
declare function buildMonthlyKo(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    targetMonth: number;
    yongShin: KoYongshin;
    currentAge: number;
}): MonthlyFrame;

/**
 * 중국 자평 월운 어댑터 — KO 와 동일 구조, schoolSpecificHints 만 structureHint 기반.
 * yongShin 에 secondary 가 없어 reinforced 룰은 단순 (primary 만 검사 + 종격 cascade).
 */
declare function buildMonthlyCnZiping(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    targetMonth: number;
    yongShin: CnZipingYongshin;
    currentAge: number;
}): MonthlyFrame;

/**
 * 중국 맹파 월운 어댑터 — schoolSpecificHints 에 응기(emergence) hint 노출.
 * yongShinDelta 는 primary 만 검사 (yearly mangpai 와 동일 — 종격 cascade 미적용).
 */
declare function buildMonthlyCnMangpai(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    targetMonth: number;
    yongShin: CnMangpaiYongshin;
    currentAge: number;
}): MonthlyFrame;

/**
 * 일본 추명학 월운 어댑터 — 12궁 통변성 favorable/unfavorable hint 노출.
 *
 * JP yongShin 은 오행 단위가 아닌 통변성 (재성/관성/인성 vs 식상/비겁) 단위라
 * yongShinDelta 는 항상 비어있고 netVerdict 는 "mixed" — yearly jp 와 동일.
 */
declare function buildMonthlyJp(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    targetMonth: number;
    yongShin: JpYongshin;
    currentAge: number;
}): MonthlyFrame;

declare function buildTriNationMonthly(args: {
    chart: SajuChart;
    daeun: MajorFortune[];
    targetYear: number;
    targetMonth: number;
    currentAge: number;
}): TriNationMonthly;
declare function buildTriNationMonthlyFromBirth(args: {
    input: BirthInputResolved;
    targetYear: number;
    targetMonth: number;
    currentAge: number;
}): Result<TriNationMonthly>;

interface DailyLiteFrame {
    school: "ko" | "cn-ziping" | "cn-mangpai" | "jp";
    /** 양력 날짜 (YYYY-MM-DD), KST. */
    forDate: string;
    /** 일진 간지. computeDayPillar(forDate) 결과. */
    dayGanji: {
        stem: Stem;
        branch: Branch;
    };
    /** 학파별 일진 평가 — 단순 3분류. */
    dayVibe: "auspicious" | "inauspicious" | "neutral";
    /** LLM narrative 프롬프트용 학파별 해석 힌트 (1-3 문장 권장). */
    hints: string[];
}
interface TriNationDailyLite {
    forDate: string;
    frames: {
        ko: DailyLiteFrame;
        cnZiping: DailyLiteFrame;
        cnMangpai: DailyLiteFrame;
        jp: DailyLiteFrame;
    };
    /**
     * 4학파 dayVibe 의 합의 — 3/4 학파 이상이 같으면 그 값, 아니면 neutral.
     * UI 의 day badge 색상 / fortune page 권고 톤에 사용.
     */
    overallVibe: "auspicious" | "inauspicious" | "neutral";
}

/**
 * 한국식 일진 어댑터 — 일진 간지 vs 용신 (primary + secondary + 종격 cascade) 비교.
 *
 * spec D6 단순화: yongShinDelta/ganjiInteractions 구조 미생성, dayVibe (3분류) + hints
 * (LLM 프롬프트용 문자열) 만 출력.
 *
 * 평가 로직:
 *  - dayStem/dayBranch 의 오행을 추출
 *  - 둘 다 primary/secondary/xishen 중 하나면 auspicious
 *  - 둘 다 gisin 이면 inauspicious
 *  - 그 외 (mixed 포함) neutral
 */
declare function buildDailyLiteKo(args: {
    chart: SajuChart;
    forDate: string;
    yongShin: KoYongshin;
}): DailyLiteFrame;

/**
 * 중국 자평 일진 어댑터 — secondary 없음, primary + 종격 cascade 만 평가.
 */
declare function buildDailyLiteCnZiping(args: {
    chart: SajuChart;
    forDate: string;
    yongShin: CnZipingYongshin;
}): DailyLiteFrame;

/**
 * 중국 맹파 일진 어댑터 — primary 만 평가 (종격 cascade 없음, mangpai 는
 * basisShenStrength 미보유). emergenceHint 를 hints 에 노출.
 */
declare function buildDailyLiteCnMangpai(args: {
    chart: SajuChart;
    forDate: string;
    yongShin: CnMangpaiYongshin;
}): DailyLiteFrame;

/**
 * 일본 추명학 일진 어댑터 — 오행 단위 평가 불가 (yongShin 이 통변성 단위).
 *
 * yearly jp 와 동일한 한계: dayVibe 는 항상 "neutral" 로 고정. hints 에 favorable /
 * unfavorable 통변성 목록을 노출해 LLM narrative 가 이를 활용할 수 있게 한다.
 * (메모리 `saju-tri-yearly-design` JP daily verdict 한계 관찰 — v0.4 개선 후보)
 */
declare function buildDailyLiteJp(args: {
    chart: SajuChart;
    forDate: string;
    yongShin: JpYongshin;
}): DailyLiteFrame;

declare function buildTriNationDailyLite(args: {
    chart: SajuChart;
    forDate: string;
}): TriNationDailyLite;
declare function buildTriNationDailyLiteFromBirth(args: {
    input: BirthInputResolved;
    forDate: string;
}): Result<TriNationDailyLite>;

type NarrativeSchool = "ko" | "cn-ziping" | "cn-mangpai" | "jp";
interface NarrativeKeyTerm {
    term: string;
    gloss: string;
}
interface LifetimeNarrativeSections {
    personality: string;
    career: string;
    relationship: string;
    health: string;
    daeunSummary: string;
    keyTerms: NarrativeKeyTerm[];
    cautions: string[];
}
interface YearlyNarrativeSections {
    personality: string;
    career: string;
    relationship: string;
    health: string;
    daeunSummary: string;
    keyTerms: NarrativeKeyTerm[];
    cautions: string[];
}
interface MonthlyNarrativeSections {
    personality: string;
    career: string;
    relationship: string;
    health: string;
    daeunSummary: string;
    keyTerms: NarrativeKeyTerm[];
    cautions: string[];
}
type SchoolSpecificKo = {
    joohuFocus: string;
    shinsalNotes: string[];
};
type SchoolSpecificZiping = {
    gyeokgukRationale: string;
    yongshinAnalysis: string;
};
type SchoolSpecificMangpai = {
    eventTimings: Array<{
        period: string;
        event: string;
    }>;
};
type SchoolSpecificJp = {
    palaceMap: Array<{
        palace: string;
        note: string;
    }>;
};
type SchoolSpecific = SchoolSpecificKo | SchoolSpecificZiping | SchoolSpecificMangpai | SchoolSpecificJp;

declare function computeFrameHash(frame: unknown): string;

declare const PROMPT_VERSIONS: {
    readonly lifetime: 3;
    readonly yearly: 3;
    readonly monthly: 4;
    readonly daily: 2;
};

interface PromptBundle {
    system: string;
    user: string;
}

declare const LIFETIME_SCHOOL_PROMPTS: Record<NarrativeSchool, string>;
declare function buildLifetimePrompt(frame: unknown, school: NarrativeSchool): PromptBundle;

declare const YEARLY_SCHOOL_PROMPTS: Record<NarrativeSchool, string>;
declare function buildYearlyPrompt(frame: unknown, school: NarrativeSchool): PromptBundle;

declare const MONTHLY_SCHOOL_PROMPTS: Record<NarrativeSchool, string>;
declare function buildMonthlyPrompt(frame: unknown, school: NarrativeSchool): PromptBundle;

declare const DAILY_SCHOOL_PROMPTS: Record<NarrativeSchool, string>;
declare function buildDailyPrompt(frame: unknown, school: NarrativeSchool): PromptBundle;

declare const LIFETIME_SCHOOL_SCHEMAS: {
    ko: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            joohuFocus: z.ZodString;
            shinsalNotes: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            joohuFocus: string;
            shinsalNotes: string[];
        }, {
            joohuFocus: string;
            shinsalNotes?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes: string[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes?: unknown;
        };
    }>;
    "cn-ziping": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            gyeokgukRationale: z.ZodString;
            yongshinAnalysis: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }>;
    "cn-mangpai": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            eventTimings: z.ZodArray<z.ZodEffects<z.ZodObject<{
                period: z.ZodString;
                event: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                period: string;
                event: string;
            }, {
                period: string;
                event: string;
            }>, {
                period: string;
                event: string;
            }, unknown>, "many">;
        }, "strip", z.ZodTypeAny, {
            eventTimings: {
                period: string;
                event: string;
            }[];
        }, {
            eventTimings: unknown[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: {
                period: string;
                event: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: unknown[];
        };
    }>;
    jp: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            palaceMap: z.ZodArray<z.ZodObject<{
                palace: z.ZodString;
                note: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                note: string;
                palace: string;
            }, {
                note: string;
                palace: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }>;
};
type LifetimeNarrativeOutput = {
    narrativeText: string;
    sections: LifetimeNarrativeSections;
    schoolSpecific: SchoolSpecific;
    citations: string[];
};

declare const YEARLY_SCHOOL_SCHEMAS: {
    ko: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            joohuFocus: z.ZodString;
            shinsalNotes: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            joohuFocus: string;
            shinsalNotes: string[];
        }, {
            joohuFocus: string;
            shinsalNotes?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes: string[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes?: unknown;
        };
    }>;
    "cn-ziping": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            gyeokgukRationale: z.ZodString;
            yongshinAnalysis: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }>;
    "cn-mangpai": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            eventTimings: z.ZodArray<z.ZodEffects<z.ZodObject<{
                period: z.ZodString;
                event: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                period: string;
                event: string;
            }, {
                period: string;
                event: string;
            }>, {
                period: string;
                event: string;
            }, unknown>, "many">;
        }, "strip", z.ZodTypeAny, {
            eventTimings: {
                period: string;
                event: string;
            }[];
        }, {
            eventTimings: unknown[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: {
                period: string;
                event: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: unknown[];
        };
    }>;
    jp: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            palaceMap: z.ZodArray<z.ZodObject<{
                palace: z.ZodString;
                note: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                note: string;
                palace: string;
            }, {
                note: string;
                palace: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: string[] | undefined;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }>;
};
type YearlyNarrativeOutput = {
    narrativeText: string;
    sections: YearlyNarrativeSections;
    schoolSpecific: SchoolSpecific;
    citations: string[];
};

declare const MONTHLY_SCHOOL_SCHEMAS: {
    ko: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            joohuFocus: z.ZodString;
            shinsalNotes: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            joohuFocus: string;
            shinsalNotes: string[];
        }, {
            joohuFocus: string;
            shinsalNotes?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes: string[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes?: unknown;
        };
    }>;
    "cn-ziping": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            gyeokgukRationale: z.ZodString;
            yongshinAnalysis: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }>;
    "cn-mangpai": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            eventTimings: z.ZodArray<z.ZodEffects<z.ZodObject<{
                period: z.ZodString;
                event: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                period: string;
                event: string;
            }, {
                period: string;
                event: string;
            }>, {
                period: string;
                event: string;
            }, unknown>, "many">;
        }, "strip", z.ZodTypeAny, {
            eventTimings: {
                period: string;
                event: string;
            }[];
        }, {
            eventTimings: unknown[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: {
                period: string;
                event: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: unknown[];
        };
    }>;
    jp: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            palaceMap: z.ZodArray<z.ZodObject<{
                palace: z.ZodString;
                note: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                note: string;
                palace: string;
            }, {
                note: string;
                palace: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }>;
};
type MonthlyNarrativeOutput = {
    narrativeText: string;
    sections: MonthlyNarrativeSections;
    schoolSpecific: SchoolSpecific;
    citations: string[];
};

declare const DAILY_SCHOOL_SCHEMAS: {
    ko: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            joohuFocus: z.ZodString;
            shinsalNotes: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            joohuFocus: string;
            shinsalNotes: string[];
        }, {
            joohuFocus: string;
            shinsalNotes?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes: string[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            joohuFocus: string;
            shinsalNotes?: unknown;
        };
    }>;
    "cn-ziping": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            gyeokgukRationale: z.ZodString;
            yongshinAnalysis: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }, {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            gyeokgukRationale: string;
            yongshinAnalysis: string;
        };
    }>;
    "cn-mangpai": z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            eventTimings: z.ZodArray<z.ZodEffects<z.ZodObject<{
                period: z.ZodString;
                event: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                period: string;
                event: string;
            }, {
                period: string;
                event: string;
            }>, {
                period: string;
                event: string;
            }, unknown>, "many">;
        }, "strip", z.ZodTypeAny, {
            eventTimings: {
                period: string;
                event: string;
            }[];
        }, {
            eventTimings: unknown[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: {
                period: string;
                event: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            eventTimings: unknown[];
        };
    }>;
    jp: z.ZodObject<{
        narrativeText: z.ZodString;
        sections: z.ZodObject<{
            personality: z.ZodString;
            career: z.ZodString;
            relationship: z.ZodString;
            health: z.ZodString;
            daeunSummary: z.ZodString;
            keyTerms: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                term: z.ZodString;
                gloss: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                term: string;
                gloss: string;
            }, {
                term: string;
                gloss: string;
            }>, "many">>>;
            cautions: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
        }, "strip", z.ZodTypeAny, {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        }, {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        }>;
        citations: z.ZodArray<z.ZodString, "many">;
    } & {
        schoolSpecific: z.ZodObject<{
            palaceMap: z.ZodArray<z.ZodObject<{
                palace: z.ZodString;
                note: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                note: string;
                palace: string;
            }, {
                note: string;
                palace: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }, {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        narrativeText: string;
        sections: {
            cautions: string[];
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            keyTerms: {
                term: string;
                gloss: string;
            }[];
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }, {
        narrativeText: string;
        sections: {
            personality: string;
            career: string;
            relationship: string;
            health: string;
            daeunSummary: string;
            cautions?: unknown;
            keyTerms?: {
                term: string;
                gloss: string;
            }[] | undefined;
        };
        citations: string[];
        schoolSpecific: {
            palaceMap: {
                note: string;
                palace: string;
            }[];
        };
    }>;
};
type DailyNarrativeOutput = {
    narrativeText: string;
    sections: MonthlyNarrativeSections;
    schoolSpecific: SchoolSpecific;
    citations: string[];
};

export { ALGORITHM_VERSION, BRANCHES, BRANCH_ELEMENT, BRANCH_KO, type BirthInputResolved, type Branch, type ChartContext, type CityInfo, type CnMangpaiYongshin, type CnZipingYongshin, type ComputeSajuInput, type Conflict, type ConsensusReport, DAILY_SCHOOL_PROMPTS, DAILY_SCHOOL_SCHEMAS, type DaeunHighlight, type DailyFortuneHourSlot, type DailyFortunePayload, type DailyFortuneRemedy, type DailyFortuneScore, type DailyLiteFrame, type DailyNarrativeOutput, ELEMENT_HANJA, ELEMENT_KO, type Element, type ElementCount, type ExtendedChart, type Interactions, type JpYongshin, type KoYongshin, LIFETIME_SCHOOL_PROMPTS, LIFETIME_SCHOOL_SCHEMAS, type LifetimeFrame, type LifetimeNarrativeOutput, type LifetimeNarrativeSections, MONTHLY_SCHOOL_PROMPTS, MONTHLY_SCHOOL_SCHEMAS, type MajorFortune, type MonthPillar, type MonthlyFrame, type MonthlyNarrativeOutput, type MonthlyNarrativeSections, type NarrativeKeyTerm, type NarrativeSchool, PROMPT_VERSIONS, type Pillar, type PillarAnnotation, type PromptBundle, type Result, STEMS, STEM_ELEMENT, STEM_KO, type SajuChart, type SajuError, type SajuPillars, type School, type SchoolSpecific, type SchoolSpecificJp, type SchoolSpecificKo, type SchoolSpecificMangpai, type SchoolSpecificZiping, type SchoolWithCompose, type ShenStrengthBasis, type ShenshaEntry, type Stem, type Strength, TEN_GOD_KO, type TenGod, type TenGodAssignment, type TriNationDailyLite, type TriNationLifetime, type TriNationMonthly, type TriNationYearly, type TrueSolarMeta, YEARLY_SCHOOL_PROMPTS, YEARLY_SCHOOL_SCHEMAS, type YearlyFrame, type YearlyNarrativeOutput, type YearlyNarrativeSections, type Yongshin, buildDailyLiteCnMangpai, buildDailyLiteCnZiping, buildDailyLiteJp, buildDailyLiteKo, buildDailyPrompt, buildLifetimePrompt, buildMonthlyCnMangpai, buildMonthlyCnZiping, buildMonthlyJp, buildMonthlyKo, buildMonthlyPrompt, buildTriNationDailyLite, buildTriNationDailyLiteFromBirth, buildTriNationLifetime, buildTriNationMonthly, buildTriNationMonthlyFromBirth, buildTriNationYearly, buildTriNationYearlyFromBirth, buildYearlyCnMangpai, buildYearlyCnZiping, buildYearlyJp, buildYearlyKo, buildYearlyPrompt, buildYongshinCnMangpai, buildYongshinCnZiping, buildYongshinJp, buildYongshinKo, computeDayPillar, computeFrameHash, computeInteractions, computeMonthPillars, computeSajuChart, computeShensha, computeYearPillar, computeYearPillarFromDate, dailyFortuneHourSlotSchema, dailyFortunePayloadSchema, dailyFortuneRemedySchema, dailyFortuneScoreSchema, deriveDaeunDirection, findCity, hashProfile, resolveChartContext, resolveTrueSolar, searchCities, tenGodsForPillar, verifyConsensus };
