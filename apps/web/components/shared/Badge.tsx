import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand";
}

export function Badge({ children, className, variant }: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        !variant && !className && "border border-slate-200 bg-slate-100 text-slate-700",
        variant === "default" && "border border-slate-200 bg-slate-100 text-slate-700",
        variant === "success" && "border border-emerald-100 bg-emerald-50 text-emerald-700",
        variant === "warning" && "border border-amber-100 bg-amber-50 text-amber-700",
        variant === "danger" && "border border-red-100 bg-red-50 text-red-700",
        variant === "info" && "border border-cyan-100 bg-cyan-50 text-cyan-700",
        variant === "brand" && "border border-brand-100 bg-brand-50 text-brand-700",
        className
      )}
    >
      {children}
    </span>
  );
}
