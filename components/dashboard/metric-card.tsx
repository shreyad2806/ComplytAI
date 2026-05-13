"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type MetricTone = "cyan" | "amber" | "emerald" | "rose";

const toneMap: Record<MetricTone, string> = {
  cyan: "text-cyan-300",
  amber: "text-amber-300",
  emerald: "text-emerald-300",
  rose: "text-rose-300",
};

export function MetricCard({
  title,
  value,
  delta,
  tone,
}: {
  title: string;
  value: string;
  delta: string;
  tone: MetricTone;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="rounded-lg border border-white/10 bg-[#071225] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{title}</p>
        <span className={cn("text-[10px] uppercase", toneMap[tone])}>live</span>
      </div>
      <p className={cn("mt-2 font-geist text-4xl leading-none", toneMap[tone])}>{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{delta}</p>
      <div className="mt-3 h-8 rounded bg-[linear-gradient(90deg,rgba(34,211,238,0.24)_0%,rgba(34,211,238,0.02)_100%)]" />
    </motion.article>
  );
}
