import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";

export default function CandidateCompletePage() {
  return (
    <Card className="max-w-xl text-center">
      <h1 className="text-xl font-bold">Interview Complete</h1>
      <p className="mt-2 text-sm text-slate-600">Thanks for completing your interview. The team will review your results soon.</p>
      <div className="mt-4">
        <Link href="/"><Button>Return Home</Button></Link>
      </div>
    </Card>
  );
}
