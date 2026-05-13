"use client";

import { motion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/components/landing/motion";

const tableRows = [
  ["AML threshold policy violation", "Regulatory", "High", "8.1"],
  ["Suspicious transaction pattern", "Financial", "Med", "6.4"],
  ["KYC document expiry - 2 accounts", "Operational", "Med", "5.2"],
  ["SOC2 control gap - vendor finding", "Audit", "Low", "2.1"],
];

export function DashboardShowcase() {
  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-zinc-950 p-4 shadow-[0_0_70px_rgba(8,145,178,0.08)] sm:p-6"
      >
        <div className="pointer-events-none absolute inset-x-16 -top-32 h-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <motion.p variants={fadeUp} className="text-center text-xs uppercase tracking-[0.18em] text-cyan-300">
          Platform preview
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 text-center font-geist text-3xl font-semibold text-zinc-100"
        >
          A compliance command center
        </motion.h2>

        <motion.div
          variants={fadeUp}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="relative mt-8 rounded-xl border border-white/10 bg-zinc-900/70 p-4"
        >
          <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
            <aside className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Workspace</p>
              <div className="mt-3 space-y-2">
                {["Dashboard", "Risk Monitor", "Audit Flags", "AI Analysis", "Reports"].map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-300">
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-4">
                {["2,847", "94.2%", "12", "28"].map((metric, idx) => (
                  <div key={metric} className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Metric {idx + 1}</p>
                    <p className="mt-2 font-geist text-2xl text-cyan-300">{metric}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Risk descriptions</p>
                <div className="mt-3 overflow-hidden rounded-md border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 text-zinc-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">Risk description</th>
                        <th className="px-3 py-2 font-medium">Category</th>
                        <th className="px-3 py-2 font-medium">Severity</th>
                        <th className="px-3 py-2 font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row[0]} className="border-t border-white/10 text-zinc-300">
                          <td className="px-3 py-2">{row[0]}</td>
                          <td className="px-3 py-2">{row[1]}</td>
                          <td className="px-3 py-2">{row[2]}</td>
                          <td className="px-3 py-2 text-cyan-300">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
