export type Perspective = 'received' | 'spoken_by_user';

export interface EvidenceSpan {
  text: string;
  manipulation_types: string[];
  reason: string;
}

export interface Explanation {
  what_is_happening: string;
  why_harmful: string;
  contrast_example: string;
}

export interface Suggestion {
  style: string;
  text: string;
}

export interface AnalysisResult {
  overall_risk_score: number;
  manipulation_present: boolean;
  manipulation_types: string[];
  highlighted_text: EvidenceSpan[];
  explanation: Explanation;
  response_suggestions: Suggestion[];
  rewrite_suggestions_if_self_spoken: Suggestion[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}
