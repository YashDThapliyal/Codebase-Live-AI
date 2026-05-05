"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  beginInterview,
  endInterview,
  getInterviewSession,
  getTranscript,
  gradeInterview,
  postInterviewMessage
} from "@/lib/api";
import { CLAI_SESSION_ID } from "@/lib/sessionStorageKeys";
import type { InterviewMessage, InterviewPhase, InterviewSession } from "@/lib/types";
import { Button } from "@/components/shared/Button";
import { InterviewStatusIndicator } from "./InterviewStatusIndicator";
import { cn } from "@/lib/utils";

type LoadState = "loading" | "ready" | "error";

export function TextInterview({
  compact = false,
  sessionIdOverride
}: {
  compact?: boolean;
  sessionIdOverride?: string | null;
}) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [lastTurn, setLastTurn] = useState<{ should_continue: boolean } | null>(null);

  const refresh = useCallback(async (sid: string) => {
    const [s, t] = await Promise.all([getInterviewSession(sid), getTranscript(sid)]);
    setSession(s);
    setMessages(t);
    return { session: s, transcript: t };
  }, []);

  useEffect(() => {
    const sid = sessionIdOverride ?? (typeof window !== "undefined" ? localStorage.getItem(CLAI_SESSION_ID) : null);
    if (!sid) {
      setLoadState("error");
      setError("No interview session. Start from the candidate lobby.");
      return;
    }
    setSessionId(sid);

    (async () => {
      try {
        let s = await getInterviewSession(sid);
        if (s.lifecycle_status === "lobby") {
          await beginInterview(sid);
        }
        const full = await getInterviewSession(sid);
        const t = await getTranscript(sid);
        setSession(full);
        setMessages(t);
        setLoadState("ready");
      } catch (e) {
        setLoadState("error");
        setError(e instanceof Error ? e.message : "Failed to load interview");
      }
    })();
  }, [sessionIdOverride]);

  const onSend = async () => {
    const sid = sessionId ?? (typeof window !== "undefined" ? localStorage.getItem(CLAI_SESSION_ID) : null);
    if (!sid || !input.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const turn = await postInterviewMessage(sid, input);
      setInput("");
      setLastTurn({ should_continue: turn.should_continue });
      await refresh(sid);
      setSession((prev) => (prev ? { ...prev, phase: turn.phase as InterviewPhase } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  const onEnd = async () => {
    const sid = sessionId ?? (typeof window !== "undefined" ? localStorage.getItem(CLAI_SESSION_ID) : null);
    if (!sid || ending) return;
    setEnding(true);
    setError(null);
    try {
      await endInterview(sid);
      try {
        await gradeInterview(sid);
      } catch {
        /* grading may fail if session not completed — still navigate */
      }
      router.push("/candidate/complete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not end interview");
    } finally {
      setEnding(false);
    }
  };

  if (loadState === "loading") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600",
          compact && "border-white/10 bg-white/5 text-white/70"
        )}
      >
        Loading interview…
      </div>
    );
  }

  if (loadState === "error" || !session) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800",
          compact && "border-red-400/30 bg-red-400/10 text-red-200"
        )}
      >
        <p className="font-medium">Interview unavailable</p>
        <p className="mt-1">{error}</p>
        <Link
          href="/candidate/lobby"
          className={cn("mt-3 inline-block text-sm font-medium underline", compact ? "text-white/80" : "text-brand-700")}
        >
          Return to lobby
        </Link>
      </div>
    );
  }

  const phase = session.phase;

  return (
    <div className={cn("space-y-4", compact && "rounded-2xl border border-white/10 bg-white/5 p-5")}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className={cn("font-display font-bold", compact ? "text-sm text-white/90" : "text-base text-slate-900")}>
            {compact ? "Text Fallback Interview" : "Text Interview"}
          </h3>
          <p className={cn("mt-0.5 text-xs", compact ? "text-white/40" : "text-slate-500")}>
            Answers are saved to the server for reviewer scorecards.
          </p>
        </div>
        <InterviewStatusIndicator phase={phase} />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{error}</p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-slate-500">Waiting for the first interviewer prompt…</p>
        ) : (
          messages.map((item) => (
            <div key={item.id} className={item.sender === "ai" ? "text-left" : "text-right"}>
              <div
                className={cn(
                  "inline-block max-w-xl rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  item.sender === "ai"
                    ? "border border-brand-100 bg-brand-50 text-slate-800"
                    : "bg-slate-900 text-white"
                )}
              >
                {item.content}
              </div>
              <p
                className={cn(
                  "mt-1 text-[10px] font-medium",
                  item.sender === "ai" ? "ml-1 text-slate-400" : "mr-1 text-right text-slate-400"
                )}
              >
                {item.sender === "ai" ? "AI Interviewer" : "You"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={session.lifecycle_status !== "active"}
          placeholder={
            session.lifecycle_status !== "active"
              ? "Interview is no longer accepting answers."
              : "Type your answer here..."
          }
          className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" disabled={sending || session.lifecycle_status !== "active"} onClick={() => void onSend()}>
            {sending ? "Sending…" : "Send Answer"}
          </Button>
          <button
            type="button"
            disabled={ending}
            onClick={() => void onEnd()}
            className="text-xs font-medium text-slate-500 transition hover:text-slate-700 disabled:opacity-50"
          >
            {ending ? "Ending…" : "End Interview"}
          </button>
        </div>
        {lastTurn && !lastTurn.should_continue ? (
          <p className="mt-2 text-xs text-slate-500">Closing phase reached — you can end the interview when ready.</p>
        ) : null}
        {session.lifecycle_status === "active" ? (
          <p className="mt-2 text-xs text-slate-500">When you finish, end the interview to queue grading for reviewers.</p>
        ) : null}
      </div>
    </div>
  );
}
