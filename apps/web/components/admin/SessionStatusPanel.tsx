import { Card } from "@/components/shared/Card";
import type { InterviewSession } from "@/lib/types";

const LABELS: Record<InterviewSession["lifecycle_status"], string> = {
  created: "Created",
  lobby: "Lobby",
  active: "In progress",
  completed: "Completed — grading pending",
  grading: "Grading",
  reviewed: "Graded — ready for review"
};

export function SessionStatusPanel({ session }: { session: InterviewSession }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Session</h3>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Session ID</dt>
          <dd className="font-mono text-xs text-slate-800">{session.id}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Phase</dt>
          <dd className="capitalize text-slate-800">{session.phase.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Status</dt>
          <dd className="font-medium text-slate-800">{LABELS[session.lifecycle_status]}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Started</dt>
          <dd className="text-slate-700">{new Date(session.started_at).toLocaleString()}</dd>
        </div>
        {session.ended_at ? (
          <div>
            <dt className="text-slate-500">Ended</dt>
            <dd className="text-slate-700">{new Date(session.ended_at).toLocaleString()}</dd>
          </div>
        ) : null}
        {session.interviewer_prompt_version ? (
          <div>
            <dt className="text-slate-500">Interviewer</dt>
            <dd className="font-mono text-xs text-slate-800">{session.interviewer_prompt_version}</dd>
          </div>
        ) : null}
      </dl>
    </Card>
  );
}
