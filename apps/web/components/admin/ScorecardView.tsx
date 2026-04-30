import { Scorecard } from "@/lib/types";
import { MetricCard } from "@/components/shared/MetricCard";
import { RedFlagBadge } from "./RedFlagBadge";
import { cn } from "@/lib/utils";

function getMatchColor(score: number): string {
  if (score >= 85) return "text-emerald-700";
  if (score >= 70) return "text-brand-700";
  if (score >= 55) return "text-amber-700";
  return "text-red-700";
}

function getMatchBg(score: number): string {
  if (score >= 85) return "from-emerald-500 to-teal-500";
  if (score >= 70) return "from-brand-500 to-violet-500";
  if (score >= 55) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

export function ScorecardView({ scorecard }: { scorecard: Scorecard }) {
  return (
    <div className="space-y-5">
      {/* Overall match */}
      <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
            getMatchBg(scorecard.match_score)
          )}
        >
          <span className="font-display text-2xl font-extrabold">{scorecard.match_score}</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Overall Match</p>
          <p className={cn("font-display text-xl font-bold", getMatchColor(scorecard.match_score))}>
            {scorecard.match_score >= 85
              ? "Strong fit"
              : scorecard.match_score >= 70
              ? "Good fit"
              : scorecard.match_score >= 55
              ? "Possible fit"
              : "Weak fit"}{" "}
            · {scorecard.match_score}/100
          </p>
        </div>
      </div>

      {/* Dimension scores */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Technical" value={scorecard.technical_score} />
        <MetricCard label="Communication" value={scorecard.communication_score} />
        <MetricCard label="Ownership" value={scorecard.ownership_score} />
        <MetricCard label="Alignment" value={scorecard.alignment_score} />
      </div>

      {/* Strengths */}
      {scorecard.strengths.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h4>
          <ul className="space-y-1.5">
            {scorecard.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Growth areas */}
      {scorecard.growth_areas.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Growth areas
          </h4>
          <ul className="space-y-1.5">
            {scorecard.growth_areas.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red flags */}
      {scorecard.red_flags.length > 0 && (
        <div className="rounded-2xl border border-red-50 bg-red-50/60 p-5">
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.998L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.331.192 2.998 1.732 2.998z" />
            </svg>
            Red flags
          </h4>
          <div className="space-y-3">
            {scorecard.red_flags.map((flag) => (
              <div key={flag.label} className="rounded-xl border border-red-100 bg-white p-3">
                <div className="flex items-center gap-2">
                  <RedFlagBadge redFlag={flag} />
                </div>
                <p className="mt-1.5 text-xs text-slate-600">{flag.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      {scorecard.evidence.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Supporting evidence
          </h4>
          <ul className="space-y-1.5">
            {scorecard.evidence.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
