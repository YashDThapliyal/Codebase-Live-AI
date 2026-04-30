import Link from "next/link";
import { ApplicantDetail } from "@/lib/types";
import { Card } from "@/components/shared/Card";

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
              <th className="py-2">Match Score</th>
              <th className="py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((item) => (
              <tr key={item.candidate.id} className="border-t border-slate-200">
                <td className="py-3">{item.candidate.full_name}</td>
                <td className="py-3">{item.candidate.role_applied}</td>
                <td className="py-3 font-semibold">{item.scorecard.match_score}</td>
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
