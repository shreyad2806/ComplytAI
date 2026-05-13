"use client";

import { FileText, Siren, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

import { ReportRiskBadge } from "@/components/report/risk-badge";
import { fadeUp, stagger } from "@/components/shared/motion";
import { executiveFindingCards, executiveSummaryBody } from "@/lib/mock/report-data";
import { cn } from "@/lib/utils";

function RichParagraph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-zinc-100">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

const findingStyles = {
  critical: "border-rose-500/25 bg-rose-500/5",
  high: "border-amber-500/25 bg-amber-500/5",
  regulatory: "border-violet-500/25 bg-violet-500/5",
} as const;

const findingIcons = {
  siren: Siren,
  triangle: TriangleAlert,
  document: FileText,
} as const;

export function ExecutiveSummary() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6"
    >
      <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        01 — Executive Summary
      </motion.p>
      <motion.article
        variants={fadeUp}
        className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-6 shadow-[0_0_40px_rgba(6,182,212,0.04)] backdrop-blur-md sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-geist text-2xl font-semibold text-zinc-100 sm:text-3xl">AI Executive Assessment</h2>
            <p className="mt-2 text-xs text-zinc-500">Compliance posture synthesised across AML, KYC, SOX, and sanctions domains.</p>
          </div>
          <ReportRiskBadge tone="critical">● Overall risk: High</ReportRiskBadge>
        </div>
        <div className="mt-6">
          <RichParagraph text={executiveSummaryBody} />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {executiveFindingCards.map((card) => {
            const Icon = findingIcons[card.icon];
            return (
              <div
                key={card.title}
                className={cn(
                  "rounded-lg border p-4 transition hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]",
                  findingStyles[card.variant]
                )}
              >
                <Icon className="size-4 text-zinc-400" />
                <p className="mt-3 font-geist text-sm font-semibold text-zinc-100">{card.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{card.description}</p>
              </div>
            );
          })}
        </div>
      </motion.article>
    </motion.section>
  );
}
