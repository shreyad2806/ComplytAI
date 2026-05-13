"use client";

import { motion } from "framer-motion";
import { Bot, FileUp, ShieldCheck, Sparkles, SquareChartGantt, Telescope } from "lucide-react";

import { fadeUp, staggerContainer } from "@/components/landing/motion";

const workflow = [
  { icon: FileUp, title: "Upload documents" },
  { icon: Bot, title: "AI analysis" },
  { icon: SquareChartGantt, title: "Risk engine" },
  { icon: Sparkles, title: "Compliance intelligence" },
  { icon: ShieldCheck, title: "Executive reports" },
  { icon: Telescope, title: "Continuous monitoring" },
];

export function Workflow() {
  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-10"
      >
        <motion.p
          variants={fadeUp}
          className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300"
        >
          How it works
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 text-center font-geist text-3xl font-semibold text-zinc-100 sm:text-4xl"
        >
          From documents to intelligence in minutes
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-3xl text-center text-zinc-400">
          Complyt AI ingests your financial and compliance documents and delivers
          actionable intelligence automatically.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-12 grid gap-3 md:grid-cols-6"
        >
          {workflow.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className="relative rounded-xl border border-white/10 bg-zinc-900/70 p-4 text-center"
            >
              <div className="mx-auto grid size-11 place-content-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-200">
                <step.icon className="size-5" />
              </div>
              <p className="mt-3 text-sm text-zinc-300">{step.title}</p>
              <span className="absolute right-2 top-2 text-[10px] text-zinc-600">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
