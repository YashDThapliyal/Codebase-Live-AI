import Link from "next/link";
import { StepIndicator } from "@/components/shared/StepIndicator";

const STEPS = [
  { label: "Setup" },
  { label: "Interview" },
  { label: "Complete" }
];

const nextSteps = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Your transcript is saved",
    description: "The AI has recorded your full conversation for the hiring team to review."
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Scorecard being generated",
    description: "The AI is analyzing your responses and generating a structured evaluation."
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "You'll hear back soon",
    description: "The team reviews results within 2–3 business days. No further action required."
  }
];

export default function CandidateCompletePage() {
  return (
    <div className="mx-auto max-w-xl animate-fade-in-up py-4">
      <div className="mb-10 flex justify-center">
        <StepIndicator steps={STEPS} currentStep={2} />
      </div>

      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-950">Interview Complete</h1>
        <p className="mx-auto mt-3 max-w-sm text-base text-slate-500">
          Great work. Your responses have been recorded and will be reviewed by the hiring team.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-slate-500">
          What happens next
        </h2>
        <div className="space-y-5">
          {nextSteps.map((step) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {step.icon}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-slate-900">{step.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
}
