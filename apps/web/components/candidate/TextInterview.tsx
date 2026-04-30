"use client";

import { useState } from "react";
import Link from "next/link";

import { mockTranscript } from "@/lib/mockData";
import { Button } from "@/components/shared/Button";
import { InterviewStatusIndicator } from "./InterviewStatusIndicator";
import { cn } from "@/lib/utils";

export function TextInterview({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");

  return (
    <div className={cn("space-y-4", compact && "rounded-2xl border border-white/10 bg-white/5 p-5")}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("font-display font-bold", compact ? "text-sm text-white/90" : "text-base text-slate-900")}>
            {compact ? "Text Fallback Interview" : "Live Text Interview"}
          </h3>
          <p className={cn("mt-0.5 text-xs", compact ? "text-white/40" : "text-slate-500")}>
            Use this if voice is unavailable or you prefer typing.
          </p>
        </div>
        <InterviewStatusIndicator phase="technical_probe" />
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {mockTranscript.map((item) => (
          <div key={item.id} className={item.sender === "ai" ? "text-left" : "text-right"}>
            <div
              className={cn(
                "inline-block max-w-xl rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                item.sender === "ai"
                  ? "bg-brand-50 text-slate-800 border border-brand-100"
                  : "bg-slate-900 text-white"
              )}
            >
              {item.content}
            </div>
            <p className={cn("mt-1 text-[10px] font-medium", item.sender === "ai" ? "text-slate-400 ml-1" : "text-slate-400 mr-1 text-right")}>
              {item.sender === "ai" ? "AI Interviewer" : "You"}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer here..."
          className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button type="button" size="sm">Send Answer</Button>
          <Link
            href="/candidate/complete"
            className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
          >
            End Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
