import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  max?: number;
  description?: string;
  colorClass?: string;
}

function getScoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "bg-emerald-500";
  if (pct >= 0.6) return "bg-brand-500";
  if (pct >= 0.4) return "bg-amber-500";
  return "bg-red-500";
}

export function MetricCard({ label, value, max = 10, description, colorClass }: MetricCardProps) {
  const percentage = Math.round((value / max) * 100);
  const barColor = colorClass ?? getScoreColor(value, max);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="font-display text-xl font-bold text-slate-900">
          {value}
          <span className="ml-0.5 text-sm font-medium text-slate-400">/{max}</span>
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full score-bar-fill transition-all", barColor)}
          style={{ "--score-width": `${percentage}%` } as React.CSSProperties}
        />
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
