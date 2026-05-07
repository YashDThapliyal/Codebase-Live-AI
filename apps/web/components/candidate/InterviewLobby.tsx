import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { InterviewLobbyActions } from "./InterviewLobbyActions";

export function InterviewLobby() {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900">Interview Lobby</h3>
      <p className="mt-1 text-sm text-slate-600">Start your interview when ready. Your transcript is saved automatically.</p>
      <InterviewLobbyActions />
      <Link href="/candidate/interview" className="mt-3 inline-block text-sm text-brand-700 underline">
        Open interview page
      </Link>
    </Card>
  );
}
