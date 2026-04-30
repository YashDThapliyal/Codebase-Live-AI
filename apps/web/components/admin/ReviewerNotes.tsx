import { ReviewerNote } from "@/lib/types";

export function ReviewerNotes({ notes }: { notes: ReviewerNote[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slate-500">
          Reviewer notes
        </h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-700">{note.note}</p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(note.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-400">No notes yet.</p>
          <p className="mt-1 text-xs text-slate-400">Reviewer notes will appear here once added.</p>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Writable reviewer notes are available in the Production Integration phase.
      </p>
    </div>
  );
}
