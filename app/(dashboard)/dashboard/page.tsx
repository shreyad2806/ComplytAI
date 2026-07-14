"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileUp, BarChart3, TrendingUp, AlertCircle } from "lucide-react";

import { fadeUp, stagger } from "@/components/shared/motion";
import { selectDashboardMetrics } from "@/lib/report-analytics";
import { useReportsStore } from "@/store/useReportsStore";

export default function DashboardPage() {
  const reports = useReportsStore((s) => s.reports);
  const metrics = useMemo(() => selectDashboardMetrics(reports), [reports]);

  const recentReports = reports.slice(0, 5);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <motion.section variants={fadeUp}>
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Compliance Operating System</p>
        <h1 className="mt-2 font-geist text-4xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">AI-powered workspace overview and compliance health</p>
      </motion.section>

      {/* Compliance Overview Section */}
      <motion.section variants={fadeUp}>
        <div className="mb-4">
          <h2 className="font-geist text-lg font-semibold text-zinc-100">Compliance Overview</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Total Reports</p>
                <p className="mt-2 font-geist text-3xl font-semibold text-zinc-100">{reports.length}</p>
              </div>
              <BarChart3 className="size-8 text-cyan-500/50" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Avg Risk Score</p>
                <p className="mt-2 font-geist text-3xl font-semibold text-zinc-100">
                  {metrics[1]?.value || "—"}
                </p>
              </div>
              <TrendingUp className="size-8 text-blue-500/50" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-orange-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Open Audit Flags</p>
                <p className="mt-2 font-geist text-3xl font-semibold text-zinc-100">{metrics[3]?.value || "0"}</p>
              </div>
              <AlertCircle className="size-8 text-orange-500/50" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Compliance Health</p>
                <p className="mt-2 font-geist text-3xl font-semibold text-zinc-100">{metrics[0]?.value || "—"}</p>
              </div>
              <div className="size-8 rounded-full border-2 border-green-500/50 flex items-center justify-center">
                <div className="size-3 rounded-full bg-green-500/70" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions Section */}
      <motion.section variants={fadeUp}>
        <div className="mb-4">
          <h2 className="font-geist text-lg font-semibold text-zinc-100">Quick Actions</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/copilot"
            className="group rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 transition hover:border-cyan-400/50 hover:from-cyan-500/15"
          >
            <div className="flex items-start justify-between">
              <div>
                <FileUp className="mb-3 size-5 text-cyan-400" />
                <h3 className="font-semibold text-zinc-100">Analyze New Document</h3>
                <p className="mt-1 text-sm text-zinc-400">Upload and analyze compliance documents with AI</p>
              </div>
              <ArrowRight className="size-5 text-cyan-400/60 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="group rounded-lg border border-white/10 bg-gradient-to-br from-zinc-500/10 to-transparent p-6 transition hover:border-white/20 hover:from-zinc-500/15"
          >
            <div className="flex items-start justify-between">
              <div>
                <BarChart3 className="mb-3 size-5 text-zinc-300" />
                <h3 className="font-semibold text-zinc-100">View Reports</h3>
                <p className="mt-1 text-sm text-zinc-400">Access all saved compliance reports</p>
              </div>
              <ArrowRight className="size-5 text-zinc-400/60 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* Recent Reports Section */}
      {recentReports.length > 0 && (
        <motion.section variants={fadeUp}>
          <div className="mb-4">
            <h2 className="font-geist text-lg font-semibold text-zinc-100">Recent Reports</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentReports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-zinc-900/30">
                    <td className="px-6 py-4 text-sm text-zinc-100">{report.document_title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium">
                        {report.risk_score > 70
                          ? "High"
                          : report.risk_score > 40
                            ? "Medium"
                            : "Low"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/report/${report.id}`}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                      >
                        View Report →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}

      {/* Recent Activity Section */}
      <motion.section variants={fadeUp}>
        <div className="mb-4">
          <h2 className="font-geist text-lg font-semibold text-zinc-100">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <div key={report.id} className="flex items-start gap-4 rounded-lg border border-white/5 bg-zinc-900/20 p-4">
                <div className="flex flex-shrink-0 items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-zinc-100">Analysis Completed</p>
                  <p className="text-xs text-zinc-400">{report.document_title}</p>
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-8 text-center">
              <p className="text-zinc-400">No recent activity. Start by analyzing a document.</p>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
