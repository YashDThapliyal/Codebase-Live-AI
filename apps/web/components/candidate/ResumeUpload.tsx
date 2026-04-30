"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";

export function ResumeUpload() {
  const [filename, setFilename] = useState<string>("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (filename) setSaved(true);
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-slate-900">Resume</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Upload your PDF so the AI can ask more relevant questions.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 transition hover:border-brand-300 hover:bg-brand-50/30 hover:text-brand-600">
              <input
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => {
                  setFilename(e.target.files?.[0]?.name || "");
                  setSaved(false);
                }}
              />
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {filename ? filename : "Choose PDF file"}
              </span>
            </label>
            <Button
              type="button"
              variant={saved ? "secondary" : "primary"}
              onClick={handleSave}
              disabled={!filename}
              className="shrink-0 sm:min-w-[120px]"
            >
              {saved ? "✓ Saved" : "Save Resume"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
