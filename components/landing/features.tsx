"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BriefcaseBusiness,
  BrainCircuit,
  Eye,
  FileBarChart2,
  ShieldAlert,
} from "lucide-react";

import { fadeUp, staggerContainer } from "@/components/landing/motion";

const features = [
  {
    title: "Compliance Risk Detection",
    copy: "Real-time financial risk issue regulatory framework correlation, AML, KYC, GDPR, and control benchmark analysis.",
    icon: ShieldAlert,
  },
  {
    title: "Audit Intelligence",
    copy: "AI-powered audit trail scoring, evidence mapping, and exception pattern analysis for trusted governance.",
    icon: Eye,
  },
  {
    title: "AI Financial Analysis",
    copy: "Deep financial statement analysis with trend detection and insight generation built for enterprise policy teams.",
    icon: BrainCircuit,
  },
  {
    title: "Operational Risk Monitoring",
    copy: "Continuous operational risk scoring with scenario modeling, impact quantification, and early warning indicators.",
    icon: Activity,
  },
  {
    title: "Policy Validation",
    copy: "Automated cross-referencing of internal policies against evolving regulations and enforcement actions.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Executive Reporting",
    copy: "Board-ready compliance summaries and risk impact narratives with AI attribution and drill-down support.",
    icon: FileBarChart2,
  },
];

export function Features() {
  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"
        >
          Platform capabilities
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-3 max-w-3xl text-center font-geist text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl"
        >
          Everything your compliance team needs
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-3xl text-center text-zinc-400">
          One unified intelligence layer across your entire financial compliance stack.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {features.map((item) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-white/10 bg-zinc-950/70 p-5 transition-shadow hover:shadow-[0_14px_50px_rgba(6,182,212,0.08)]"
            >
              <div className="mb-4 inline-flex rounded-md border border-cyan-300/30 bg-cyan-500/10 p-2.5 text-cyan-200">
                <item.icon className="size-4" />
              </div>
              <h3 className="font-geist text-lg font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.copy}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
