"use client";

import {
  Activity,
  AlertTriangle,
  Anchor,
  Globe,
  Search,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

import { ReportRiskBadge } from "@/components/report/risk-badge";
import { fadeUp, stagger } from "@/components/shared/motion";
import { auditFlagCards } from "@/lib/mock/report-data";
import type { ReportSeverity } from "@/lib/mock/report-data";
import type { ReportRiskTone } from "@/components/report/risk-badge";

const icons = {
  alert: AlertTriangle,
  globe: Globe,
  search: Search,
  shield: Shield,
  activity: Activity,
  anchor: Anchor,
} as const;

function sevToTone(s: ReportSeverity): ReportRiskTone {
  return s;
}

export function AuditFlagsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.06 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6"
    >
      <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        04 — Audit Flags
      </motion.p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {auditFlagCards.map((flag) => {
          const Icon = icons[flag.icon];
          return (
            <motion.article
              key={flag.id}
              variants={fadeUp}
              whileHover={{
                boxShadow: "0 0 28px rgba(6,182,212,0.08)",
                borderColor: "rgba(63, 63, 70, 1)",
              }}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-5 backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-2">
                <Icon className="size-4 shrink-0 text-zinc-500" />
                <ReportRiskBadge tone={sevToTone(flag.severity)}>
                  {flag.severity} • {flag.id}
                </ReportRiskBadge>
              </div>
              <h3 className="mt-4 font-geist text-base font-semibold leading-snug text-zinc-100">{flag.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{flag.body}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-800/70 pt-3">
                {flag.meta.map((m) => (
                  <span
                    key={m}
                    className="rounded border border-zinc-800/90 bg-zinc-900/60 px-2 py-0.5 text-[10px] text-zinc-500"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
