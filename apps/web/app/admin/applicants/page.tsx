import { ApplicantTable } from "@/components/admin/ApplicantTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { listApplicants } from "@/lib/api";

export default async function ApplicantsPage() {
  const applicants = await listApplicants();

  return (
    <div className="space-y-4">
      <PageHeader title="Admin Applicants" subtitle="Applicants sorted by overall match score" />
      <ApplicantTable applicants={applicants} />
    </div>
  );
}
