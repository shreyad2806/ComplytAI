"use client";

import { Clock } from "lucide-react";
import { motion } from "framer-motion";

import type { ReportRiskTone } from "@/components/report/risk-badge";
import { ReportRiskBadge } from "@/components/report/risk-badge";
import { SeverityIndicator } from "@/components/report/severity-indicator";
import { fadeUp, stagger } from "@/components/shared/motion";
export type RecommendationItem = {
  index: string;
  priority: string;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  effortBadge: string;
  effortTone: ReportRiskTone;
  dot: ReportRiskTone;
};

export function RecommendationTimeline({ items }: { items: RecommendationItem[] }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.08 }} variants={stagger} className="space-y-0">
      {items.map((item) => (
        <motion.div
          key={item.index}
          variants={fadeUp}
          className="group relative border-b border-zinc-800/70 py-8 first:pt-2 last:border-b-0"
        >
          <div className="absolute left-0 top-10 hidden font-geist text-6xl font-semibold leading-none text-zinc-800/80 sm:block">
            {item.index}
          </div>
          <div className="relative sm:pl-24">
            <div className="flex flex-wrap items-start gap-3">
              <SeverityIndicator tone={item.dot} />
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{item.priority}</p>
            </div>
            <h4 className="mt-3 font-geist text-lg font-semibold text-zinc-100 sm:text-xl">{item.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-zinc-800/90 bg-zinc-900/70 px-2 py-0.5 text-[10px] text-zinc-500"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Clock className="size-3.5 text-zinc-600" />
                {item.deadline}
              </span>
              <ReportRiskBadge tone={item.effortTone}>{item.effortBadge}</ReportRiskBadge>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
