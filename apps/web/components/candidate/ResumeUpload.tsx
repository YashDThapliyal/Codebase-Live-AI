"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";

export function ResumeUpload() {
  const [filename, setFilename] = useState<string>("");

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900">Resume Upload (Optional)</h3>
      <p className="mt-1 text-sm text-slate-600">Upload a PDF resume for future personalization features.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFilename(e.target.files?.[0]?.name || "")}
          className="block w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
        />
        <Button type="button">Save</Button>
      </div>
      {filename ? <p className="mt-2 text-xs text-slate-500">Selected: {filename}</p> : null}
    </Card>
  );
}
