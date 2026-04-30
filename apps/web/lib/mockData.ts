import { ApplicantDetail, Candidate, InterviewMessage, InterviewSession } from "./types";

export const mockCandidates: Candidate[] = [
  {
    id: "cand_001",
    full_name: "Avery Chen",
    email: "avery@example.com",
    role_applied: "Backend Engineer",
    created_at: new Date().toISOString()
  },
  {
    id: "cand_002",
    full_name: "Jordan Patel",
    email: "jordan@example.com",
    role_applied: "Full Stack Engineer",
    created_at: new Date().toISOString()
  }
];

export const mockSession: InterviewSession = {
  id: "sess_001",
  candidate_id: "cand_001",
  phase: "technical_probe",
  status: "active",
  started_at: new Date().toISOString()
};

export const mockTranscript: InterviewMessage[] = [
  {
    id: "m1",
    session_id: "sess_001",
    sender: "ai",
    content: "Walk me through a recent API you designed and one tradeoff you made.",
    phase: "technical_probe",
    created_at: new Date().toISOString()
  },
  {
    id: "m2",
    session_id: "sess_001",
    sender: "candidate",
    content: "I designed a task queue API with idempotency keys to handle retries safely.",
    phase: "technical_probe",
    created_at: new Date().toISOString()
  }
];

export const mockApplicantDetails: ApplicantDetail[] = [
  {
    candidate: mockCandidates[0],
    session: { ...mockSession, status: "completed", phase: "closing" },
    transcript: mockTranscript,
    scorecard: {
      session_id: "sess_001",
      technical_score: 8,
      communication_score: 7,
      ownership_score: 8,
      alignment_score: 7,
      match_score: 80,
      strengths: ["Strong backend fundamentals", "Clear tradeoff reasoning"],
      growth_areas: ["Could improve depth in monitoring strategy"],
      red_flags: [
        {
          label: "Vague incident ownership",
          severity: "low",
          evidence: "Provided general answer without a concrete production example."
        }
      ],
      evidence: [
        "Explained idempotency and failure handling with a concrete queue example.",
        "Referenced API retry semantics and data consistency concerns."
      ]
    },
    reviewer_notes: [
      {
        id: "rn_1",
        candidate_id: "cand_001",
        note: "Follow up with a system design deep dive in final round.",
        created_at: new Date().toISOString()
      }
    ]
  }
];
