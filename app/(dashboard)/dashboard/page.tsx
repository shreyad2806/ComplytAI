"use client";

import { motion } from "framer-motion";

import { AnalyticsGrid } from "@/components/analytics/analytics-grid";
import { AnalysisCards } from "@/components/dashboard/analysis-card";
import { AnalysisHistoryTable } from "@/components/dashboard/analysis-history-table";
import { AuditFlagsPanel } from "@/components/dashboard/audit-flags-panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { fadeUp, stagger } from "@/components/shared/motion";
import { UploadPanel } from "@/components/upload/upload-panel";
import { metricCards } from "@/lib/mock/dashboard-data";

export default function DashboardPage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto w-full max-w-[1400px]">
      <motion.section variants={fadeUp} className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Compliance Operating System</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-geist text-3xl text-zinc-100">Complyt AI Workspace</h1>
            <p className="text-sm text-zinc-400">AI-powered risk intelligence and compliance analysis</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              Document Analysis
            </button>
            <button className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              AI Copilot
            </button>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </motion.section>

      <motion.section variants={fadeUp} className="mt-5 grid gap-3 xl:grid-cols-2">
        <UploadPanel />
        <AuditFlagsPanel />
      </motion.section>

      <AnalysisCards />
      <AnalyticsGrid />
      <AnalysisHistoryTable />
    </motion.div>
  );
}
