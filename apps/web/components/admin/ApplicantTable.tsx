import Link from "next/link";
import type { ApplicantDetail, InterviewLifecycleStatus } from "@/lib/types";
import { Card } from "@/components/shared/Card";

const LIFECYCLE_LABEL: Record<InterviewLifecycleStatus, string> = {
  created: "Created",
  lobby: "Lobby",
  active: "Active",
  completed: "Awaiting grade",
  grading: "Grading",
  reviewed: "Reviewed"
};

export function ApplicantTable({ applicants }: { applicants: ApplicantDetail[] }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Applicants</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Session</th>
              <th className="py-2">Match</th>
              <th className="py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((item) => (
              <tr key={item.candidate.id} className="border-t border-slate-200">
                <td className="py-3">
                  <div className="font-medium text-slate-900">{item.candidate.full_name}</div>
                  <div className="text-xs text-slate-500">{item.candidate.email}</div>
                </td>
                <td className="py-3">{item.candidate.role_applied}</td>
                <td className="py-3">
                  <span
                    className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                    title={item.session.id}
                  >
                    {LIFECYCLE_LABEL[item.session.lifecycle_status]}
                  </span>
                </td>
                <td className="py-3">
                  {item.scorecard != null ? (
                    <span className="font-semibold text-slate-900">{item.scorecard.match_score}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-slate-400">—</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        No scorecard yet
                      </span>
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <Link className="text-brand-600 underline" href={`/admin/applicants/${item.candidate.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
