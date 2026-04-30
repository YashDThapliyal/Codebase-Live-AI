export function MicTestCard() {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-slate-900">Microphone Readiness</h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Voice AI interview is ready. We recommend a quiet environment and headphones for cleaner audio.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Quiet environment", "Headphones recommended", "Stable internet"].map((tip) => (
            <span
              key={tip}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {tip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
