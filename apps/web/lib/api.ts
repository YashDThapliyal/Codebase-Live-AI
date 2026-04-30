import { ApplicantDetail, Candidate, InterviewMessage } from "./types";
import { mockApplicantDetails, mockCandidates, mockTranscript } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return { status: "mock-ok" };
  }
}

export async function listApplicants(): Promise<ApplicantDetail[]> {
  return [...mockApplicantDetails].sort((a, b) => b.scorecard.match_score - a.scorecard.match_score);
}

export async function getApplicant(id: string): Promise<ApplicantDetail | null> {
  return mockApplicantDetails.find((item) => item.candidate.id === id) ?? null;
}

export async function listCandidates(): Promise<Candidate[]> {
  return mockCandidates;
}

export async function getTranscript(_sessionId: string): Promise<InterviewMessage[]> {
  return mockTranscript;
}

export async function createRealtimeSession(preferredLanguage?: string): Promise<any> {
  const res = await fetch(`${API_URL}/realtime/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ preferred_language: preferredLanguage || "English" })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.error) {
    throw new Error(data?.error || "Failed to create realtime session");
  }

  return data;
}

export async function pushRealtimeDebugLog(payload: unknown): Promise<void> {
  await fetch(`${API_URL}/realtime/debug-log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).catch(() => undefined);
}
