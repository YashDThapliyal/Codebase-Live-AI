"use client";

import { useState } from "react";

import { TextInterview } from "./TextInterview";
import { VoiceInterview } from "./VoiceInterview";

/**
 * Text interview is the reliable MVP path; voice is progressive enhancement (see README).
 */
export function CandidateInterviewShell() {
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="font-display text-lg font-bold text-white/90">Interview</h1>
        <p className="mt-1 text-sm text-white/40">
          Typed answers are persisted for evidence-based review. Voice is optional and requires backend OpenAI configuration.
        </p>
      </div>

      <TextInterview />

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
        <button
          type="button"
          onClick={() => setVoiceOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left text-sm font-medium text-white/50 transition hover:text-white/70"
        >
          <span>Optional: voice interview (realtime)</span>
          <span className="text-xs text-white/30">{voiceOpen ? "Hide" : "Show"}</span>
        </button>
        {voiceOpen ? (
          <div className="mt-4 border-t border-white/[0.07] pt-4">
            <VoiceInterview hideEmbeddedTextFallback />
          </div>
        ) : null}
      </div>
    </div>
  );
}
