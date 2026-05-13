"use client";

import { motion } from "framer-motion";

import { ConfidenceBar } from "@/components/report/confidence-bar";
import { ReportRiskBadge } from "@/components/report/risk-badge";
import { fadeUp, stagger } from "@/components/shared/motion";
import { riskAnalysisCards } from "@/lib/mock/report-data";
import type { ReportSeverity } from "@/lib/mock/report-data";
import type { ReportRiskTone } from "@/components/report/risk-badge";

function mapSeverity(s: ReportSeverity): ReportRiskTone {
  return s;
}

export function RiskAnalysisSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.06 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6"
    >
      <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        03 — Risk Analysis
      </motion.p>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {riskAnalysisCards.map((card) => (
          <motion.article
            key={card.title}
            variants={fadeUp}
            whileHover={{ borderColor: "rgba(34, 211, 238, 0.15)" }}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-6 backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{card.category}</p>
              <ReportRiskBadge tone={mapSeverity(card.severity)}>{card.severity}</ReportRiskBadge>
            </div>
            <h3 className="mt-3 font-geist text-xl font-semibold text-zinc-100">{card.title}</h3>
            <ul className="mt-4 space-y-2">
              {card.bullets.map((b) => (
                <li key={b} className="border-l-2 border-cyan-500/25 pl-3 text-sm leading-relaxed text-zinc-400">
                  {b}
                </li>
              ))}
            </ul>
            <ConfidenceBar value={card.confidence} className="mt-6" />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
