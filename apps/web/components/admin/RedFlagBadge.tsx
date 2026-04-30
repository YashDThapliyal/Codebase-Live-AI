import { RedFlag } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  RedFlag["severity"],
  { label: string; classes: string }
> = {
  low: {
    label: "Low",
    classes: "border-amber-100 bg-amber-50 text-amber-700"
  },
  medium: {
    label: "Med",
    classes: "border-orange-100 bg-orange-50 text-orange-700"
  },
  high: {
    label: "High",
    classes: "border-red-100 bg-red-50 text-red-700"
  }
};

export function RedFlagBadge({ redFlag }: { redFlag: RedFlag }) {
  const config = severityConfig[redFlag.severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.classes
      )}
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.998L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.331.192 2.998 1.732 2.998z" />
      </svg>
      {redFlag.label}
      <span className="opacity-60">· {config.label}</span>
    </span>
  );
}
