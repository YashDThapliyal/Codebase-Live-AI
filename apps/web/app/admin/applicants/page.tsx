import { ApplicantBrowse } from "@/components/admin/ApplicantBrowse";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { listApplicants } from "@/lib/api";

export default async function ApplicantsPage() {
  let applicants: Awaited<ReturnType<typeof listApplicants>> = [];
  let loadError: string | null = null;
  try {
    applicants = await listApplicants();
  } catch {
    loadError = "Could not load applicants from the API. Is the backend running at NEXT_PUBLIC_API_URL?";
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Admin Applicants"
        subtitle="Scored applicants first (highest match on top), then sessions still awaiting grading. Search and export support review workflows."
      />
      {loadError ? (
        <EmptyState title="API unavailable" description={loadError} />
      ) : applicants.length === 0 ? (
        <EmptyState title="No applicants yet" description="Complete a candidate interview and grading to see rows here." />
      ) : (
        <ApplicantBrowse applicants={applicants} />
      )}
    </div>
  );
}
