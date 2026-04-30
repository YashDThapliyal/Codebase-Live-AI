"use client";

import { cn } from "@/lib/utils";

export type OrbState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended";

interface AIOrbProps {
  state: OrbState;
  size?: "sm" | "md" | "lg";
}

const orbConfigs: Record<OrbState, {
  gradient: string;
  glowClass: string;
  animationClass: string;
  showRings: boolean;
  ringColor: string;
  label: string;
  dotColor: string;
}> = {
  idle: {
    gradient: "radial-gradient(circle at 35% 30%, #818cf8, #4f46e5 50%, #312e81)",
    glowClass: "shadow-glow-indigo",
    animationClass: "animate-orb-idle",
    showRings: false,
    ringColor: "rgba(99, 102, 241, 0.35)",
    label: "Ready",
    dotColor: "bg-brand-400"
  },
  connecting: {
    gradient: "radial-gradient(circle at 35% 30%, #fcd34d, #f59e0b 50%, #d97706)",
    glowClass: "shadow-glow-amber",
    animationClass: "animate-pulse",
    showRings: true,
    ringColor: "rgba(245, 158, 11, 0.35)",
    label: "Connecting...",
    dotColor: "bg-amber-400"
  },
  listening: {
    gradient: "radial-gradient(circle at 35% 30%, #67e8f9, #06b6d4 50%, #0891b2)",
    glowClass: "shadow-glow-cyan",
    animationClass: "animate-orb-listen",
    showRings: true,
    ringColor: "rgba(6, 182, 212, 0.35)",
    label: "Listening",
    dotColor: "bg-cyan-400"
  },
  thinking: {
    gradient: "radial-gradient(circle at 35% 30%, #d8b4fe, #a855f7 50%, #7c3aed)",
    glowClass: "shadow-glow-violet",
    animationClass: "animate-orb-idle",
    showRings: false,
    ringColor: "rgba(168, 85, 247, 0.35)",
    label: "Thinking...",
    dotColor: "bg-violet-400"
  },
  speaking: {
    gradient: "radial-gradient(circle at 35% 30%, #6ee7b7, #10b981 50%, #059669)",
    glowClass: "shadow-glow-emerald",
    animationClass: "animate-orb-speak",
    showRings: true,
    ringColor: "rgba(16, 185, 129, 0.35)",
    label: "Speaking",
    dotColor: "bg-emerald-400"
  },
  ended: {
    gradient: "radial-gradient(circle at 35% 30%, #cbd5e1, #64748b 50%, #475569)",
    glowClass: "",
    animationClass: "",
    showRings: false,
    ringColor: "rgba(100, 116, 139, 0.2)",
    label: "Interview ended",
    dotColor: "bg-slate-400"
  }
};

const sizes = {
  sm: { orb: 80, ring: 80, fontSize: "text-sm" },
  md: { orb: 140, ring: 140, fontSize: "text-base" },
  lg: { orb: 200, ring: 200, fontSize: "text-lg" }
};

export function AIOrb({ state, size = "lg" }: AIOrbProps) {
  const config = orbConfigs[state];
  const dim = sizes[size];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center" style={{ width: dim.ring * 2.4, height: dim.ring * 2.4 }}>
        {config.showRings && (
          <>
            <div
              className="absolute rounded-full animate-ring-expand"
              style={{
                width: dim.orb,
                height: dim.orb,
                background: config.ringColor,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
            <div
              className="absolute rounded-full animate-ring-expand-delay"
              style={{
                width: dim.orb,
                height: dim.orb,
                background: config.ringColor,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          </>
        )}

        <div
          className={cn(
            "relative rounded-full",
            config.glowClass,
            config.animationClass
          )}
          style={{
            width: dim.orb,
            height: dim.orb,
            background: config.gradient
          }}
        >
          <div
            className="absolute rounded-full bg-white/25"
            style={{
              width: "28%",
              height: "22%",
              top: "16%",
              left: "18%",
              filter: "blur(4px)"
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            config.dotColor,
            state !== "idle" && state !== "ended" && "animate-pulse"
          )}
        />
        <span className={cn("font-medium text-white/80", dim.fontSize)}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
