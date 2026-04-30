import { Card } from "@/components/shared/Card";
import { ReviewerNote } from "@/lib/types";

export function ReviewerNotes({ notes }: { notes: ReviewerNote[] }) {
  return (
    <Card>
      <h3 className="text-base font-semibold">Reviewer Notes</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {notes.map((note) => (
          <p key={note.id} className="rounded-lg bg-slate-50 p-3">
            {note.note}
          </p>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">Placeholder: writable notes integration comes in Product Integration phase.</p>
    </Card>
  );
}
