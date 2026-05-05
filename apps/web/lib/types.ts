export type InterviewPhase =
  | "intro"
  | "resume_deep_dive"
  | "technical_probe"
  | "behavioral_alignment"
  | "candidate_questions"
  | "closing";

/** Session lifecycle — evidence-based review workflow (not auto-hire). */
export type InterviewLifecycleStatus =
  | "created"
  | "lobby"
  | "active"
  | "completed"
  | "grading"
  | "reviewed";

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  role_applied: string;
  created_at: string;
}

export interface InterviewMessage {
  id: string;
  session_id: string;
  sender: "ai" | "candidate";
  content: string;
  phase: InterviewPhase;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  candidate_id: string;
  phase: InterviewPhase;
  lifecycle_status: InterviewLifecycleStatus;
  started_at: string;
  ended_at?: string;
  /** Present when the backend records which interviewer logic produced turns. */
  interviewer_prompt_version?: string | null;
}

export interface RedFlag {
  label: string;
  severity: "low" | "medium" | "high";
  evidence: string;
}

export interface Scorecard {
  session_id: string;
  technical_score: number;
  communication_score: number;
  ownership_score: number;
  alignment_score: number;
  match_score: number;
  strengths: string[];
  growth_areas: string[];
  red_flags: RedFlag[];
  evidence: string[];
  grader_version?: string;
  prompt_version?: string | null;
}

export interface ReviewerNote {
  id: string;
  candidate_id: string;
  note: string;
  created_at: string;
}

export interface ResumeSummary {
  skills: string[];
  projects: string[];
  experience: string[];
  suggested_probe_topics: string[];
}

export interface ApplicantDetail {
  candidate: Candidate;
  session: InterviewSession;
  transcript: InterviewMessage[];
  scorecard?: Scorecard | null;
  reviewer_notes: ReviewerNote[];
}

export interface InterviewTurnResponse {
  message: string;
  phase: InterviewPhase;
  should_continue: boolean;
}
