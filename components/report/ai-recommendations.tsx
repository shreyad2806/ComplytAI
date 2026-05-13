"use client";

import { motion } from "framer-motion";

import { RecommendationTimeline } from "@/components/report/recommendation-timeline";
import { fadeUp, stagger } from "@/components/shared/motion";
import { aiRecommendations } from "@/lib/mock/report-data";

export function AIRecommendationsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          § 05 — AI Recommendations
        </motion.p>
        <motion.p variants={fadeUp} className="font-mono text-[11px] text-zinc-600">
          01 / 05
        </motion.p>
      </div>
      <motion.article
        variants={fadeUp}
        className="mt-4 rounded-xl border border-cyan-500/20 bg-zinc-950/40 p-2 shadow-[0_0_32px_rgba(6,182,212,0.06)] backdrop-blur-md sm:p-6"
      >
        <RecommendationTimeline items={aiRecommendations} />
      </motion.article>
      <div className="mt-6 flex justify-between border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-600">
        <span className="font-mono">§ 06 — Analytics</span>
        <span className="font-mono">05 / 05</span>
      </div>
    </motion.section>
  );
}
