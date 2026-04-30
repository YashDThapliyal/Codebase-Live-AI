import { InterviewMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TranscriptView({ messages }: { messages: InterviewMessage[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wide text-slate-500">
        Interview transcript
      </h3>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.sender === "candidate" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                msg.sender === "ai"
                  ? "bg-brand-100 text-brand-700"
                  : "bg-slate-900 text-white"
              )}
            >
              {msg.sender === "ai" ? "AI" : "C"}
            </div>
            <div className={cn("max-w-[80%]", msg.sender === "candidate" && "text-right")}>
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide mb-1",
                  msg.sender === "ai" ? "text-brand-600" : "text-slate-500"
                )}
              >
                {msg.sender === "ai" ? "AI Interviewer" : "Candidate"}
              </p>
              <div
                className={cn(
                  "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.sender === "ai"
                    ? "border border-brand-100 bg-brand-50 text-slate-800"
                    : "bg-slate-900 text-white"
                )}
              >
                {msg.content}
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {msg.phase.replaceAll("_", " ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
