import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  variant?: "default" | "elevated" | "bordered" | "ghost" | "dark";
}

export function Card({ children, className, variant = "default" }: PropsWithChildren<CardProps>) {
  return (
    <section
      className={cn(
        "rounded-2xl transition-shadow duration-200",
        variant === "default" && "border border-slate-100 bg-white p-6 shadow-card",
        variant === "elevated" && "border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_32px_-8px_rgba(79,70,229,0.10)] hover:shadow-card-hover",
        variant === "bordered" && "border border-slate-200 bg-transparent p-6",
        variant === "ghost" && "bg-slate-50 p-6",
        variant === "dark" && "border border-white/10 bg-white/5 p-6",
        className
      )}
    >
      {children}
    </section>
  );
}
