import { ApplicantTable } from "@/components/admin/ApplicantTable";
import { listApplicants } from "@/lib/api";

export default async function ApplicantsPage() {
  const applicants = await listApplicants();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Admin</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">Applicant Review</h1>
        <p className="mt-2 text-base text-slate-500">
          {applicants.length} candidate{applicants.length !== 1 ? "s" : ""} · sorted by match score
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total applicants", value: applicants.length },
          {
            label: "High match (≥85)",
            value: applicants.filter((a) => a.scorecard.match_score >= 85).length
          },
          {
            label: "With red flags",
            value: applicants.filter((a) => a.scorecard.red_flags.length > 0).length
          },
          {
            label: "Avg. match score",
            value:
              applicants.length > 0
                ? Math.round(
                    applicants.reduce((sum, a) => sum + a.scorecard.match_score, 0) / applicants.length
                  )
                : 0
          }
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <ApplicantTable applicants={applicants} />
    </div>
  );
}
