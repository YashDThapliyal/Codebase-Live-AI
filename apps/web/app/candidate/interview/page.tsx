import { PageHeader } from "@/components/shared/PageHeader";
import { TextInterview } from "@/components/candidate/TextInterview";

export default function CandidateInterviewPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Interview" subtitle="Answer one prompt at a time. Keep responses concise and concrete." />
      <TextInterview />
    </div>
  );
}
