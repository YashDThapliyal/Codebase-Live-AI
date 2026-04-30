import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CandidateLoginPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Candidate Login" subtitle="Placeholder login for local demo flow" />
      <Card className="max-w-lg">
        <div className="space-y-3">
          <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="Email" />
          <input className="w-full rounded-lg border border-slate-300 p-2 text-sm" placeholder="Full name" />
          <Link href="/candidate/lobby"><Button>Continue</Button></Link>
        </div>
      </Card>
    </div>
  );
}
