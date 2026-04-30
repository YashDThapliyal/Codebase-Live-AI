"use client";

import { useState } from "react";
import Link from "next/link";
import { mockTranscript } from "@/lib/mockData";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { InterviewStatusIndicator } from "./InterviewStatusIndicator";

export function TextInterview() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Live Text Interview</h3>
        <InterviewStatusIndicator phase="technical_probe" />
      </Card>

      <Card className="space-y-3">
        {mockTranscript.map((item) => (
          <div key={item.id} className={item.sender === "ai" ? "text-left" : "text-right"}>
            <p className="inline-block max-w-xl rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800">{item.content}</p>
          </div>
        ))}
      </Card>

      <Card>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="h-28 w-full rounded-lg border border-slate-300 p-3 text-sm"
        />
        <div className="mt-3 flex items-center gap-2">
          <Button type="button">Send Answer</Button>
          <Link href="/candidate/complete" className="text-sm text-slate-600 underline">
            End Interview (Demo)
          </Link>
        </div>
      </Card>
    </div>
  );
}
