import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { PageHeader } from "@/components/shared/PageHeader";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Codebase Live AI"
        subtitle="AI-powered interview screening with transcript evidence and structured scorecards"
      />
      <Card className="bg-gradient-to-r from-brand-50 to-white">
        <p className="max-w-2xl text-sm text-slate-700">
          Run consistent interview flows, evaluate candidates with evidence-backed grading, and review applicants from one
          admin dashboard.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/candidate/login"><Button>Candidate Area</Button></Link>
          <Link href="/admin/applicants"><Button className="bg-slate-900 hover:bg-slate-800">Admin Review</Button></Link>
        </div>
      </Card>
    </div>
  );
}
