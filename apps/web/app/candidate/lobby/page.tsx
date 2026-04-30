import { PageHeader } from "@/components/shared/PageHeader";
import { ResumeUpload } from "@/components/candidate/ResumeUpload";
import { MicTestCard } from "@/components/candidate/MicTestCard";
import { InterviewLobby } from "@/components/candidate/InterviewLobby";

export default function CandidateLobbyPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Candidate Lobby" subtitle="Quick pre-check before starting your interview" />
      <ResumeUpload />
      <MicTestCard />
      <InterviewLobby />
    </div>
  );
}
