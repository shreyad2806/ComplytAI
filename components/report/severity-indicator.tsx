"use client";

import { cn } from "@/lib/utils";
import type { ReportRiskTone } from "@/components/report/risk-badge";

const dot: Record<ReportRiskTone, string> = {
  critical: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.45)]",
  high: "bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.35)]",
  medium: "bg-amber-400 shadow-[0_0_8px_rgba(234,179,8,0.35)]",
  low: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.35)]",
};

export function SeverityIndicator({ tone }: { tone: ReportRiskTone }) {
  return <span className={cn("inline-block size-2 rounded-full", dot[tone])} aria-hidden />;
}
