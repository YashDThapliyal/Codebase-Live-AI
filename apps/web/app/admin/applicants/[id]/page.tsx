import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { getApplicant } from "@/lib/api";
import { TranscriptView } from "@/components/admin/TranscriptView";
import { ScorecardView } from "@/components/admin/ScorecardView";
import { ReviewerNotes } from "@/components/admin/ReviewerNotes";
import { SessionStatusPanel } from "@/components/admin/SessionStatusPanel";

export default async function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const detail = await getApplicant(params.id);
  if (!detail) notFound();

  return (
    <div className="space-y-4">
      <PageHeader
        title={`${detail.candidate.full_name} · ${detail.candidate.role_applied}`}
        subtitle="Evidence-based review: transcript, heuristic scorecard, and reviewer notes"
      />
      <SessionStatusPanel session={detail.session} />
      <ScorecardView scorecard={detail.scorecard} session={detail.session} />
      <TranscriptView messages={detail.transcript} />
      <ReviewerNotes notes={detail.reviewer_notes} />
    </div>
  );
}
