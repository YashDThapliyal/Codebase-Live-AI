import { notFound } from "next/navigation";
import Link from "next/link";
import { getApplicant } from "@/lib/api";
import { TranscriptView } from "@/components/admin/TranscriptView";
import { ScorecardView } from "@/components/admin/ScorecardView";
import { ReviewerNotes } from "@/components/admin/ReviewerNotes";
import { cn } from "@/lib/utils";

function getMatchColor(score: number): string {
  if (score >= 85) return "from-emerald-500 to-teal-500";
  if (score >= 70) return "from-brand-500 to-violet-500";
  if (score >= 55) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const detail = await getApplicant(params.id);
  if (!detail) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back nav */}
      <Link
        href="/admin/applicants"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All applicants
      </Link>

      {/* Candidate header */}
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-lg font-bold text-white shadow-sm",
            getMatchColor(detail.scorecard.match_score)
          )}
        >
          {getInitials(detail.candidate.full_name)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-slate-950">
            {detail.candidate.full_name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{detail.candidate.role_applied}</span>
            <span className="text-slate-300">·</span>
            <span>{detail.candidate.email}</span>
            <span className="text-slate-300">·</span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-semibold",
                detail.session.status === "completed"
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-amber-100 bg-amber-50 text-amber-700"
              )}
            >
              {detail.session.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">Match score</p>
          <p className="font-display text-3xl font-extrabold text-slate-950">
            {detail.scorecard.match_score}
            <span className="text-lg font-medium text-slate-400">/100</span>
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left: scorecard */}
        <div>
          <ScorecardView scorecard={detail.scorecard} />
        </div>

        {/* Right: transcript + notes */}
        <div className="space-y-5">
          <TranscriptView messages={detail.transcript} />
          <ReviewerNotes notes={detail.reviewer_notes} />
        </div>
      </div>
    </div>
  );
}
