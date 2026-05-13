"use client";

import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

import { fadeUp, stagger } from "@/components/shared/motion";
import {
  complianceTrendPoints,
  operationalExposureBars,
  riskDistributionBars,
  severityBreakdown,
} from "@/lib/mock/report-data";
import { cn } from "@/lib/utils";

const totalFindings = severityBreakdown.reduce((a, b) => a + b.value, 0);

export function AnalyticsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.06 }}
      variants={stagger}
      className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6"
    >
      <motion.p variants={fadeUp} className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        06 — Analytics
      </motion.p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <motion.article
          variants={fadeUp}
          className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur-md lg:col-span-1"
        >
          <h3 className="text-sm font-medium text-zinc-200">Risk distribution by category</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={riskDistributionBars} margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={40} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10}>
                  {riskDistributionBars.map((e) => (
                    <Cell key={e.name} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article
          variants={fadeUp}
          className="relative rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur-md"
        >
          <h3 className="text-sm font-medium text-zinc-200">Severity breakdown</h3>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityBreakdown} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={2}>
                  {severityBreakdown.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-6">
              <div className="text-center">
                <p className="font-geist text-2xl font-semibold text-zinc-100">{totalFindings}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Findings</p>
              </div>
            </div>
          </div>
          <ul className="mt-2 space-y-1.5 border-t border-zinc-800/70 pt-3">
            {severityBreakdown.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-[11px] text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="tabular-nums text-zinc-400">{s.value}</span>
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article variants={fadeUp} className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-200">Compliance score trend</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-400">Live</span>
          </div>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrendPoints}>
                <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#22d3ee", strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Q1 2025: <span className="text-zinc-300">68.2</span> → Now: <span className="text-cyan-300">74.8</span>
          </p>
        </motion.article>
      </div>

      <motion.article variants={fadeUp} className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5 backdrop-blur-md">
        <h3 className="text-sm font-medium text-zinc-200">Operational exposure</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {operationalExposureBars.map((row) => (
            <div key={row.name}>
              <div className="mb-1 flex justify-between text-xs text-zinc-500">
                <span>{row.name}</span>
                <span className="text-zinc-400">{row.label}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className={cn("h-full rounded-full", row.tone)} style={{ width: row.pct + "%" }} />
              </div>
            </div>
          ))}
        </div>
      </motion.article>
    </motion.section>
  );
}
