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
  },
  {
    id: "cand_003",
    full_name: "Sam Rivera",
    email: "sam@example.com",
    role_applied: "Frontend Engineer",
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
    content: "Walk me through a recent API you designed and one key tradeoff you made.",
    phase: "technical_probe",
    created_at: new Date().toISOString()
  },
  {
    id: "m2",
    session_id: "sess_001",
    sender: "candidate",
    content: "I designed a task queue API with idempotency keys to handle retries safely. The tradeoff was added complexity in state tracking vs. reliability under failure.",
    phase: "technical_probe",
    created_at: new Date().toISOString()
  },
  {
    id: "m3",
    session_id: "sess_001",
    sender: "ai",
    content: "How did you test the idempotency behavior under concurrent requests?",
    phase: "technical_probe",
    created_at: new Date().toISOString()
  },
  {
    id: "m4",
    session_id: "sess_001",
    sender: "candidate",
    content: "We used a distributed test harness that fired parallel requests with the same idempotency key and validated that exactly one task was created.",
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
      strengths: ["Strong backend fundamentals", "Clear tradeoff reasoning", "Concrete production examples"],
      growth_areas: ["Could improve depth in observability strategy"],
      red_flags: [
        {
          label: "Vague incident ownership",
          severity: "low",
          evidence: "Provided general answer without a concrete production incident example."
        }
      ],
      evidence: [
        "Explained idempotency and failure handling with a concrete queue example.",
        "Referenced API retry semantics and data consistency concerns.",
        "Described parallel test harness for idempotency validation."
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
  },
  {
    candidate: mockCandidates[1],
    session: { ...mockSession, id: "sess_002", candidate_id: "cand_002", status: "completed", phase: "closing" },
    transcript: [
      {
        id: "m5",
        session_id: "sess_002",
        sender: "ai",
        content: "Describe a complex feature you shipped end-to-end and what you would do differently.",
        phase: "resume_deep_dive",
        created_at: new Date().toISOString()
      },
      {
        id: "m6",
        session_id: "sess_002",
        sender: "candidate",
        content: "I led the migration of our billing service from a monolith to microservices. In hindsight, I would have invested more in integration testing earlier.",
        phase: "resume_deep_dive",
        created_at: new Date().toISOString()
      }
    ],
    scorecard: {
      session_id: "sess_002",
      technical_score: 9,
      communication_score: 8,
      ownership_score: 9,
      alignment_score: 8,
      match_score: 92,
      strengths: ["Strong ownership mindset", "Deep full-stack experience", "Self-aware about past decisions"],
      growth_areas: ["Could improve public communication and documentation"],
      red_flags: [],
      evidence: [
        "Led billing microservices migration with measurable impact.",
        "Demonstrated reflection on technical tradeoffs.",
        "Described concrete lessons learned from the project."
      ]
    },
    reviewer_notes: []
  },
  {
    candidate: mockCandidates[2],
    session: { ...mockSession, id: "sess_003", candidate_id: "cand_003", status: "completed", phase: "closing" },
    transcript: [
      {
        id: "m7",
        session_id: "sess_003",
        sender: "ai",
        content: "Tell me about a frontend performance optimization you drove.",
        phase: "technical_probe",
        created_at: new Date().toISOString()
      },
      {
        id: "m8",
        session_id: "sess_003",
        sender: "candidate",
        content: "I reduced bundle size by 40% using code splitting and lazy loading. Also fixed a render bottleneck by memoizing expensive selectors.",
        phase: "technical_probe",
        created_at: new Date().toISOString()
      }
    ],
    scorecard: {
      session_id: "sess_003",
      technical_score: 7,
      communication_score: 8,
      ownership_score: 6,
      alignment_score: 7,
      match_score: 68,
      strengths: ["Solid React and performance knowledge", "Clear communicator"],
      growth_areas: ["Ownership of larger features", "Backend integration experience"],
      red_flags: [
        {
          label: "Limited backend exposure",
          severity: "medium",
          evidence: "Struggled to explain API design decisions in depth."
        },
        {
          label: "Unclear on production incidents",
          severity: "low",
          evidence: "Could not provide a concrete example of resolving a production issue."
        }
      ],
      evidence: [
        "40% bundle size reduction via code splitting.",
        "Memoization strategy for expensive selectors.",
        "Clear understanding of React rendering lifecycle."
      ]
    },
    reviewer_notes: []
  }
];
