"use client";

import { motion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/components/landing/motion";

const metrics = [
  { label: "Compliance score", value: "94.2%", detail: "7.2% this fiscal week" },
  { label: "Audit flags", value: "12", detail: "3 require immediate action" },
  { label: "Risk score", value: "Low - 18", detail: "Within policy threshold" },
];

const flags = [
  { title: "Policy mismatch in Q4 vendor disclosure", severity: "high", score: 8.4 },
  { title: "KYC document expiry in 3 domains", severity: "med", score: 5.2 },
  { title: "SOC2 control drift detected", severity: "low", score: 2.1 },
];

export function DashboardPreview() {
  return (
    <section className="relative mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
        className="rounded-2xl border border-cyan-300/20 bg-zinc-950/80 p-4 shadow-[0_0_80px_rgba(34,211,238,0.07)] backdrop-blur-xl sm:p-6"
      >
        <motion.div
          variants={fadeUp}
          className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"
        >
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="size-2 rounded-full bg-cyan-300" />
            Complyt AI
            <span className="text-zinc-600">|</span>
            Compliance intelligence dashboard
          </div>
          <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-200">
            AI Active
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid gap-3 md:grid-cols-3"
        >
          {metrics.map((metric) => (
            <motion.article
              key={metric.label}
              variants={fadeUp}
              className="rounded-xl border border-white/10 bg-zinc-900/70 p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {metric.label}
              </p>
              <p className="mt-2 font-geist text-2xl font-semibold text-cyan-300">
                {metric.value}
              </p>
              <p className="mt-2 text-xs text-zinc-500">{metric.detail}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]"
        >
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Risk trend - 6 months
            </p>
            <div className="mt-4 flex h-36 items-end gap-2">
              {[62, 52, 71, 45, 37, 49, 42, 56, 44, 51, 39, 47].map((value, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-cyan-600/45 to-cyan-300/75"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Audit flags
            </p>
            <div className="mt-4 space-y-3">
              {flags.map((flag) => (
                <div key={flag.title} className="rounded-lg border border-white/10 bg-zinc-950/80 p-3">
                  <p className="text-xs text-zinc-300">{flag.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] uppercase">
                    <span className="text-zinc-500">{flag.severity}</span>
                    <span className="text-cyan-300">{flag.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
