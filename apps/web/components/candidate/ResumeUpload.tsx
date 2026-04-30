"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";

export function ResumeUpload() {
  const [filename, setFilename] = useState<string>("");

  return (
    <Card>
      <h3 className="text-base font-semibold">Resume Upload</h3>
      <p className="mt-1 text-sm text-slate-600">Upload a PDF resume to personalize interview questions.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFilename(e.target.files?.[0]?.name || "")}
          className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
        />
        <Button type="button">Save Resume</Button>
      </div>
      {filename ? <p className="mt-2 text-xs text-slate-500">Selected: {filename}</p> : null}
    </Card>
  );
}
