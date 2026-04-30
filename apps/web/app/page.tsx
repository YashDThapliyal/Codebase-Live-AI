import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-16 text-center">
      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
        UC Berkeley Codebase
      </div>

      {/* Headline */}
      <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-6xl">
        AI Interview Platform
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-slate-500">
        Voice-powered interviews with structured scoring and evidence-backed evaluations.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/candidate/login"
          className="w-full rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md sm:w-auto"
        >
          Start Interview
        </Link>
        <Link
          href="/admin/applicants"
          className="w-full rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Subtle feature pills */}
      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {["Voice AI", "Live transcription", "Structured scorecards", "Red flag detection", "Text fallback"].map((f) => (
          <span
            key={f}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
