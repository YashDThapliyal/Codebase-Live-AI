import {
  ApplicantDetail,
  Candidate,
  InterviewMessage,
  InterviewSession,
  InterviewTurnResponse,
  Scorecard
} from "./types";
import { mockApplicantDetails, mockCandidates, mockTranscript } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const USE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function register(payload: {
  email: string;
  password: string;
  role?: "candidate" | "admin";
}): Promise<{ user_id: string; email: string; role: string }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ user_id: string; email: string; role: string }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function me(): Promise<{ user_id: string; email: string; role: string }> {
  return apiFetch("/auth/me");
}

export async function logout(): Promise<{ ok: boolean }> {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function getHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return { status: "mock-ok" };
  }
}

export async function createCandidate(payload: {
  full_name: string;
  email: string;
  role_applied: string;
}): Promise<Candidate> {
  if (USE_MOCK_FALLBACK) {
    return mockCandidates[0];
  }
  return apiFetch<Candidate>("/candidates", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function startInterview(payload: {
  candidate_id: string;
  resume_text?: string | null;
}): Promise<InterviewSession> {
  if (USE_MOCK_FALLBACK) {
    return {
      id: "sess_mock",
      candidate_id: payload.candidate_id,
      phase: "intro",
      lifecycle_status: "lobby",
      started_at: new Date().toISOString()
    };
  }
  return apiFetch<InterviewSession>("/interviews/start", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function beginInterview(sessionId: string): Promise<InterviewSession> {
  if (USE_MOCK_FALLBACK) {
    return {
      id: sessionId,
      candidate_id: "cand_mock",
      phase: "intro",
      lifecycle_status: "active",
      started_at: new Date().toISOString()
    };
  }
  return apiFetch<InterviewSession>(`/interviews/${sessionId}/begin`, { method: "POST" });
}

export async function getInterviewSession(sessionId: string): Promise<InterviewSession> {
  if (USE_MOCK_FALLBACK) {
    return {
      id: sessionId,
      candidate_id: "cand_mock",
      phase: "intro",
      lifecycle_status: "active",
      started_at: new Date().toISOString()
    };
  }
  return apiFetch<InterviewSession>(`/interviews/${sessionId}`);
}

export async function getTranscript(sessionId: string): Promise<InterviewMessage[]> {
  if (USE_MOCK_FALLBACK) {
    return mockTranscript;
  }
  return apiFetch<InterviewMessage[]>(`/interviews/${sessionId}/transcript`);
}

export async function postInterviewMessage(sessionId: string, message: string): Promise<InterviewTurnResponse> {
  if (USE_MOCK_FALLBACK) {
    return {
      message: "Thanks — mock response. Connect the API for full flow.",
      phase: "intro",
      should_continue: true
    };
  }
  return apiFetch<InterviewTurnResponse>(`/interviews/${sessionId}/message`, {
    method: "POST",
    body: JSON.stringify({ message })
  });
}

export async function appendTranscriptMessage(
  sessionId: string,
  payload: { sender: "ai" | "candidate"; content: string }
): Promise<InterviewMessage> {
  if (USE_MOCK_FALLBACK) {
    return {
      id: `msg_mock_${Math.random().toString(36).slice(2, 8)}`,
      session_id: sessionId,
      sender: payload.sender,
      content: payload.content,
      phase: "intro",
      created_at: new Date().toISOString()
    };
  }
  return apiFetch<InterviewMessage>(`/interviews/${sessionId}/transcript-message`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function endInterview(sessionId: string): Promise<InterviewSession> {
  if (USE_MOCK_FALLBACK) {
    return {
      id: sessionId,
      candidate_id: "cand_mock",
      phase: "closing",
      lifecycle_status: "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString()
    };
  }
  return apiFetch<InterviewSession>(`/interviews/${sessionId}/end`, { method: "POST" });
}

export async function gradeInterview(sessionId: string): Promise<Scorecard> {
  if (USE_MOCK_FALLBACK) {
    return mockApplicantDetails[0].scorecard!;
  }
  return apiFetch<Scorecard>(`/grading/${sessionId}`, { method: "POST" });
}

export async function listApplicants(): Promise<ApplicantDetail[]> {
  if (USE_MOCK_FALLBACK) {
    return [...mockApplicantDetails].sort((a, b) => (b.scorecard?.match_score ?? 0) - (a.scorecard?.match_score ?? 0));
  }
  return apiFetch<ApplicantDetail[]>("/admin/applicants");
}

export async function getApplicant(id: string): Promise<ApplicantDetail | null> {
  if (USE_MOCK_FALLBACK) {
    return mockApplicantDetails.find((item) => item.candidate.id === id) ?? null;
  }
  try {
    return await apiFetch<ApplicantDetail>(`/admin/applicants/${id}`);
  } catch {
    return null;
  }
}

export async function createRealtimeSession(preferredLanguage?: string): Promise<unknown> {
  const res = await fetch(`${API_URL}/realtime/session`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ preferred_language: preferredLanguage || "English" })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || (data as { error?: string })?.error) {
    throw new Error((data as { error?: string })?.error || "Failed to create realtime session");
  }

  return data;
}

export async function pushRealtimeDebugLog(payload: unknown): Promise<void> {
  await fetch(`${API_URL}/realtime/debug-log`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).catch(() => undefined);
}
