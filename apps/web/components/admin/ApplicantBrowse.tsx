"use client";

import { useMemo, useState } from "react";
import type { ApplicantDetail } from "@/lib/types";
import { ApplicantTable } from "@/components/admin/ApplicantTable";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadApplicantsCsv(rows: ApplicantDetail[]) {
  const header = [
    "full_name",
    "email",
    "role_applied",
    "match_score",
    "lifecycle_status",
    "session_id"
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        csvEscape(r.candidate.full_name),
        csvEscape(r.candidate.email),
        csvEscape(r.candidate.role_applied),
        r.scorecard != null ? String(r.scorecard.match_score) : "",
        csvEscape(r.session.lifecycle_status),
        csvEscape(r.session.id)
      ].join(",")
    )
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ApplicantBrowse({ applicants }: { applicants: ApplicantDetail[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applicants;
    return applicants.filter((row) => {
      const { full_name, email, role_applied } = row.candidate;
      return (
        full_name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        role_applied.toLowerCase().includes(q)
      );
    });
  }, [applicants, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="block flex-1 text-sm text-slate-600">
          <span className="sr-only">Search applicants</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or role…"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>
        <button
          type="button"
          onClick={() => downloadApplicantsCsv(filtered)}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Export CSV ({filtered.length})
        </button>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No applicants match this search.</p>
      ) : (
        <ApplicantTable applicants={filtered} />
      )}
    </div>
  );
}
