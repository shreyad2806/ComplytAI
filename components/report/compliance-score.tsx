"use client";

import { motion } from "framer-motion";

import { ComplianceGauge } from "@/components/report/compliance-gauge";
import { ReportRiskBadge } from "@/components/report/risk-badge";
import { fadeUp, stagger } from "@/components/shared/motion";
import { complianceKeyMetrics, complianceScoreGauge } from "@/lib/mock/report-data";
import { cn } from "@/lib/utils";

const barTone: Record<string, string> = {
  rose: "bg-gradient-to-r from-rose-600 to-rose-400",
  amber: "bg-gradient-to-r from-amber-600 to-amber-400",
  yellow: "bg-gradient-to-r from-yellow-600 to-yellow-400",
  cyan: "bg-gradient-to-r from-cyan-700 to-cyan-400",
  emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400",
};

function severityToTone(s: string): "critical" | "high" | "medium" | "low" {
  const u = s.toUpperCase();
  if (u === "CRITICAL") return "critical";
  if (u === "HIGH") return "high";
  if (u === "PASS" || u === "LOW") return "low";
  return "medium";
}

export function ComplianceScoreSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6"
    >
      <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        02 — Compliance Score
      </motion.p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <motion.article
          variants={fadeUp}
          className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-6 backdrop-blur-md sm:p-8"
        >
          <ComplianceGauge score={complianceScoreGauge.score} label={complianceScoreGauge.label} />
          <div className="mt-6 space-y-3">
            {complianceScoreGauge.categories.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-[11px] text-zinc-500">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-zinc-400">{c.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={cn("h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.15)]", barTone[c.tone])}
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.div variants={stagger} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {complianceKeyMetrics.map((m) => (
            <motion.article
              key={m.title}
              variants={fadeUp}
              whileHover={{ borderColor: "rgba(34, 211, 238, 0.18)" }}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5 backdrop-blur-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{m.title}</p>
              <p className={cn("mt-2 font-geist text-3xl font-semibold tabular-nums", m.valueTone)}>{m.value}</p>
              <p className="mt-2 text-xs text-zinc-500">{m.sublabel}</p>
              <div className="mt-3">
                <ReportRiskBadge tone={severityToTone(m.badge)}>{m.badge}</ReportRiskBadge>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
