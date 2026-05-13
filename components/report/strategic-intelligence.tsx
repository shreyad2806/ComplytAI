"use client";

import { FileText, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { IntelligenceCard } from "@/components/report/intelligence-card";
import { fadeUp, stagger } from "@/components/shared/motion";
import { strategicIntelligenceCards } from "@/lib/mock/report-data";

export function StrategicIntelligenceSection() {
  const [primary, risk, regulatory] = strategicIntelligenceCards;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6"
    >
      <motion.div
        variants={fadeUp}
        className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-600"
      >
        <span className="h-px flex-1 bg-zinc-800" aria-hidden />
        <span className="shrink-0">5 of 7 — Strategic intelligence</span>
        <span className="h-px flex-1 bg-zinc-800" aria-hidden />
      </motion.div>

      <motion.div variants={fadeUp}>
        <IntelligenceCard
          kicker={primary.kicker}
          title={primary.title}
          body={primary.body}
          footerLeft={primary.footerLeft}
          footerBadge={primary.footerBadge}
          className="mb-4"
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <IntelligenceCard
          kicker={risk.kicker}
          kickerAdornment={<Shield className="size-3.5 text-pink-400" />}
          title={risk.title}
          body={risk.body}
          footerLeft={risk.footerLeft}
          footerBadge={risk.footerBadge}
        />
        <IntelligenceCard
          kicker={regulatory.kicker}
          kickerAdornment={<FileText className="size-3.5 text-cyan-400" />}
          title={regulatory.title}
          body={regulatory.body}
          footerLeft={regulatory.footerLeft}
          footerBadge={regulatory.footerBadge}
        />
      </div>
    </motion.section>
  );
}
