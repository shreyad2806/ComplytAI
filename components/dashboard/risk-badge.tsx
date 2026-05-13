import { cn } from "@/lib/utils";

const riskTone = {
  critical: "border-rose-400/30 bg-rose-500/15 text-rose-300",
  high: "border-amber-400/30 bg-amber-500/15 text-amber-300",
  med: "border-yellow-400/30 bg-yellow-500/15 text-yellow-300",
  low: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
};

export function RiskBadge({ level }: { level: keyof typeof riskTone }) {
  return (
    <span className={cn("rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] border", riskTone[level])}>
      {level}
    </span>
  );
}
