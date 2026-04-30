import { Card } from "@/components/shared/Card";
import { Scorecard } from "@/lib/types";
import { RedFlagBadge } from "./RedFlagBadge";

export function ScorecardView({ scorecard }: { scorecard: Scorecard }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Scorecard</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <p>Technical: {scorecard.technical_score}/10</p>
        <p>Communication: {scorecard.communication_score}/10</p>
        <p>Ownership: {scorecard.ownership_score}/10</p>
        <p>Alignment: {scorecard.alignment_score}/10</p>
        <p className="font-semibold">Match: {scorecard.match_score}/100</p>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Red Flags</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {scorecard.red_flags.map((flag) => (
            <RedFlagBadge key={flag.label} redFlag={flag} />
          ))}
        </div>
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
