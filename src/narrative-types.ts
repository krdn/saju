export type NarrativeSchool = "ko" | "cn-ziping" | "cn-mangpai" | "jp";

export interface NarrativeKeyTerm {
  term: string;
  gloss: string;
}

export interface LifetimeNarrativeSections {
  personality: string;
  career: string;
  relationship: string;
  health: string;
  daeunSummary: string;
  keyTerms: NarrativeKeyTerm[];
  cautions: string[];
}

export interface YearlyNarrativeSections {
  personality: string;
  career: string;
  relationship: string;
  health: string;
  daeunSummary: string;
  keyTerms: NarrativeKeyTerm[];
  cautions: string[];
}

export interface MonthlyNarrativeSections {
  personality: string;
  career: string;
  relationship: string;
  health: string;
  daeunSummary: string;
  keyTerms: NarrativeKeyTerm[];
  cautions: string[];
}

export type SchoolSpecificKo = {
  joohuFocus: string;
  shinsalNotes: string[];
};

export type SchoolSpecificZiping = {
  gyeokgukRationale: string;
  yongshinAnalysis: string;
};

export type SchoolSpecificMangpai = {
  eventTimings: Array<{ period: string; event: string }>;
};

export type SchoolSpecificJp = {
  palaceMap: Array<{ palace: string; note: string }>;
};

export type SchoolSpecific =
  | SchoolSpecificKo
  | SchoolSpecificZiping
  | SchoolSpecificMangpai
  | SchoolSpecificJp;
