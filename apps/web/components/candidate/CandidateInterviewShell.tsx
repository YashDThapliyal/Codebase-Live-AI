"use client";

import { useState } from "react";

import { TextInterview } from "./TextInterview";
import { VoiceInterview } from "./VoiceInterview";

export function CandidateInterviewShell() {
  const [mode, setMode] = useState<"voice" | "text">("voice");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Interview</h1>
        <p className="mt-1 text-sm text-slate-600">Use voice or text mode. Voice ends automatically after 3 AI questions.</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
        <button
          type="button"
          onClick={() => setMode("voice")}
          className={`rounded-md px-3 py-1.5 text-sm ${mode === "voice" ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
        >
          Voice
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-md px-3 py-1.5 text-sm ${mode === "text" ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
        >
          I prefer text
        </button>
      </div>

      {mode === "voice" ? <VoiceInterview /> : <TextInterview />}
    </div>
  );
}
