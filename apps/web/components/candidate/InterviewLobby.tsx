import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { InterviewLobbyActions } from "./InterviewLobbyActions";

export function InterviewLobby() {
  return (
    <Card>
      <h3 className="text-base font-semibold">Interview Lobby</h3>
      <p className="mt-2 text-sm text-slate-600">
        You will complete a guided AI interview. Keep answers clear and concrete with project examples where possible.
      </p>
      <InterviewLobbyActions />
      <p className="mt-4 text-xs text-slate-500">
        Prefer voice? You can switch to the optional realtime path on the interview screen after starting.
      </p>
      <Link href="/candidate/interview" className="mt-2 inline-block text-xs text-slate-400 underline">
        Open interview page (if you already started)
      </Link>
    </Card>
  );
}
