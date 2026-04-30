import { InterviewMessage } from "@/lib/types";
import { Card } from "@/components/shared/Card";

export function TranscriptView({ messages }: { messages: InterviewMessage[] }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Transcript</h3>
      <div className="mt-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-700">{msg.sender.toUpperCase()}</p>
            <p className="text-slate-600">{msg.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
