import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <span className={cn("rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700", className)}>{children}</span>;
}
