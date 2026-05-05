import { Card } from "@/components/shared/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { CandidateLoginForm } from "./CandidateLoginForm";

export default function CandidateLoginPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Candidate Login"
        subtitle="Create a local profile so your interview transcript and scorecard can be stored for human review."
      />
      <Card className="max-w-lg">
        <CandidateLoginForm />
      </Card>
    </div>
  );
}
