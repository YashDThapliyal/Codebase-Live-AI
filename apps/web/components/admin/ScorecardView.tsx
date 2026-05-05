import { Card } from "@/components/shared/Card";
import type { InterviewSession, Scorecard } from "@/lib/types";
import { RedFlagBadge } from "./RedFlagBadge";

export function ScorecardView({
  scorecard,
  session
}: {
  scorecard?: Scorecard | null;
  session?: InterviewSession;
}) {
  if (!scorecard) {
    return (
      <Card>
        <h3 className="text-base font-semibold">Scorecard</h3>
        <p className="mt-2 text-sm text-slate-600">
          {session?.lifecycle_status === "completed" || session?.lifecycle_status === "grading"
            ? "Grading is in progress or pending. Refresh after the candidate run finishes."
            : "No scorecard yet. The candidate must complete the interview and trigger grading before a heuristic scorecard appears."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-base font-semibold">Scorecard</h3>
      {scorecard.grader_version ? (
        <p className="mt-1 text-xs text-slate-500">Grader: {scorecard.grader_version}</p>
      ) : null}
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <p>Technical: {scorecard.technical_score}/10</p>
        <p>Communication: {scorecard.communication_score}/10</p>
        <p>Ownership: {scorecard.ownership_score}/10</p>
        <p>Alignment: {scorecard.alignment_score}/10</p>
        <p className="font-semibold">Match: {scorecard.match_score}/100</p>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Strengths</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {scorecard.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Growth areas</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {scorecard.growth_areas.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Red Flags</h4>
        {scorecard.red_flags.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">None flagged by the heuristic review.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {scorecard.red_flags.map((flag) => (
              <RedFlagBadge key={flag.label} redFlag={flag} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 text-sm">
        <h4 className="font-semibold">Evidence</h4>
        <ul className="mt-2 list-disc pl-5 text-slate-600">
          {scorecard.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
