import Link from "next/link";
import { Button } from "@/components/shared/Button";

export default function CandidateLoginPage() {
  return (
    <div className="mx-auto max-w-md py-8 animate-fade-in-up">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-soft">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-950">Welcome, candidate</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your details to begin your interview session.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Email address
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Full name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Your full name"
            />
          </div>
          <Link href="/candidate/lobby" className="block">
            <Button className="w-full" size="lg">Continue to Setup</Button>
          </Link>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Your responses are recorded and reviewed by the hiring team.
        </p>
      </div>
    </div>
  );
}
