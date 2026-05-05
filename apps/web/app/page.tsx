import Link from "next/link";
import { cn } from "@/lib/utils";

const ctaBase =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10 pt-2">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-brand-50/50 to-white px-6 py-12 shadow-soft sm:px-10 sm:py-14 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-500/[0.12] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand-600/[0.08] blur-3xl"
        />
        <div className="relative max-w-2xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Codebase recruiting</p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Interview with consistency. Review with evidence.
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Run structured interviews, keep full transcripts, and score against a rubric—with evidence tied to what
            candidates actually said. Built for human review, not autopilot hiring.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/candidate/login"
              className={cn(ctaBase, "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600")}
            >
              I'm a candidate
            </Link>
            <Link
              href="/admin/applicants"
              className={cn(
                ctaBase,
                "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-brand-600"
              )}
            >
              Admin review
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Choose your path</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Candidates</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in, join the lobby, complete a text interview, then wrap up—we persist your session for reviewers.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="font-mono text-xs text-brand-600">01</span>
              <span>Create your profile</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-xs text-brand-600">02</span>
              <span>Start the guided interview</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-xs text-brand-600">03</span>
              <span>End &amp; submit for grading</span>
            </li>
          </ol>
          <Link
            href="/candidate/login"
            className="mt-5 inline-flex text-sm font-semibold text-brand-600 underline decoration-brand-600/30 underline-offset-4 hover:text-brand-700 hover:decoration-brand-600"
          >
            Go to candidate login →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Reviewers</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Browse applicants, open transcripts and scorecards, and note what stood out—all from one dashboard.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-brand-600" aria-hidden>
                ●
              </span>
              <span>Sorted view: graded rows first</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600" aria-hidden>
                ●
              </span>
              <span>Search and export CSV for triage</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600" aria-hidden>
                ●
              </span>
              <span>Session lifecycle and evidence on detail</span>
            </li>
          </ul>
          <Link
            href="/admin/applicants"
            className="mt-5 inline-flex text-sm font-semibold text-brand-600 underline decoration-brand-600/30 underline-offset-4 hover:text-brand-700 hover:decoration-brand-600"
          >
            Open admin applicants →
          </Link>
          </div>
        </div>
      </section>

      <p className="text-center text-xs leading-relaxed text-slate-500">
        Text interview MVP — voice stays optional where Realtime is configured. Point <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.65rem] text-slate-700">NEXT_PUBLIC_API_URL</code> at your API when not using mock data.
      </p>
    </div>
  );
}
