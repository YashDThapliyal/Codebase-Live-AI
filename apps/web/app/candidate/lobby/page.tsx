import { StepIndicator } from "@/components/shared/StepIndicator";
import { ResumeUpload } from "@/components/candidate/ResumeUpload";
import { MicTestCard } from "@/components/candidate/MicTestCard";
import { InterviewLobby } from "@/components/candidate/InterviewLobby";

const STEPS = [
  { label: "Setup" },
  { label: "Interview" },
  { label: "Complete" }
];

export default function CandidateLobbyPage() {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <StepIndicator steps={STEPS} currentStep={0} />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-950">
          Get ready for your interview
        </h1>
        <p className="max-w-md text-base text-slate-500">
          Take a moment to set up before you begin. The process usually takes 15–20 minutes.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <ResumeUpload />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <MicTestCard />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <InterviewLobby />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Your responses are recorded and reviewed securely. All data is handled with care.
      </p>
    </div>
  );
}
