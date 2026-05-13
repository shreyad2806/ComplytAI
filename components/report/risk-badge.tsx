"use client";

import { cn } from "@/lib/utils";

const tones = {
  critical: "border-rose-400/35 bg-rose-500/12 text-rose-200",
  high: "border-orange-400/35 bg-orange-500/12 text-orange-200",
  medium: "border-amber-400/35 bg-amber-500/12 text-amber-200",
  low: "border-emerald-400/35 bg-emerald-500/12 text-emerald-200",
};

export type ReportRiskTone = keyof typeof tones;

export function ReportRiskBadge({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone: ReportRiskTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
