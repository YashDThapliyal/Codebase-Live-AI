import Link from "next/link";
import { Card } from "@/components/shared/Card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Codebase Live AI</h1>
        <p className="mt-2 text-sm text-slate-600">
          A simple interview demo: run candidate interviews, save transcripts, and review applicants in an admin dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/candidate/login" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Candidate Login
          </Link>
          <Link href="/admin/applicants" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            Admin Applicants
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">How This Demo Works</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Candidate creates an account and starts interview.</li>
          <li>Voice or text interview records messages in backend.</li>
          <li>Admin opens applicant detail to read transcript and scorecard.</li>
        </ol>
      </Card>
    </div>
  );
}
