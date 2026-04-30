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
