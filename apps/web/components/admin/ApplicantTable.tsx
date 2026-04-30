import Link from "next/link";
import { ApplicantDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-100";
  if (score >= 70) return "text-brand-700 bg-brand-50 border-brand-100";
  if (score >= 55) return "text-amber-700 bg-amber-50 border-amber-100";
  return "text-red-700 bg-red-50 border-red-100";
}

function getScoreBarColor(score: number): string {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-brand-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-red-500";
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-brand-100 text-brand-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700"
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ApplicantTable({ applicants }: { applicants: ApplicantDetail[] }) {
  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-card">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="font-display text-sm font-bold text-slate-700">No applicants yet</p>
        <p className="mt-1 text-xs text-slate-500">Completed interviews will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applicants.map((item, index) => {
        const redFlagCount = item.scorecard.red_flags.length;
        const highRedFlags = item.scorecard.red_flags.filter((f) => f.severity === "high").length;

        return (
          <div
            key={item.candidate.id}
            className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:shadow-card-hover sm:flex-row sm:items-center"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                getAvatarColor(item.candidate.full_name)
              )}
            >
              {getInitials(item.candidate.full_name)}
            </div>

            {/* Name + role */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display font-bold text-slate-900">{item.candidate.full_name}</p>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {item.candidate.role_applied}
                </span>
                {redFlagCount > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      highRedFlags > 0
                        ? "border border-red-100 bg-red-50 text-red-700"
                        : "border border-amber-100 bg-amber-50 text-amber-700"
                    )}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.998L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.331.192 2.998 1.732 2.998z" />
                    </svg>
                    {redFlagCount} flag{redFlagCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{item.candidate.email}</p>
            </div>

            {/* Score */}
            <div className="flex flex-col gap-1.5 sm:w-40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Match score</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs font-bold",
                    getScoreColor(item.scorecard.match_score)
                  )}
                >
                  {item.scorecard.match_score}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn("h-full rounded-full score-bar-fill", getScoreBarColor(item.scorecard.match_score))}
                  style={{ "--score-width": `${item.scorecard.match_score}%` } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/admin/applicants/${item.candidate.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-200 hover:bg-brand-100"
            >
              Review
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
