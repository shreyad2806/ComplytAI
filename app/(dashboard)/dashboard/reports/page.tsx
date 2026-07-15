"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Trash2, Plus } from "lucide-react";

import { fadeUp, stagger } from "@/components/shared/motion";
import { useReportsStore } from "@/store/useReportsStore";

export default function ReportsPage() {
  const reports = useReportsStore((s) => s.reports);
  const removeReport = useReportsStore((s) => s.removeReport);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      removeReport(id);
    }
  };

  const getRiskLevelColor = (score?: number) => {
    if (!score) return "text-zinc-400 bg-zinc-500/10 border-zinc-500/30";
    if (score > 70) return "text-red-400 bg-red-500/10 border-red-500/30";
    if (score > 40) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    return "text-green-400 bg-green-500/10 border-green-500/30";
  };

  const getRiskLevelLabel = (score?: number) => {
    if (!score) return null;
    if (score > 70) return "High";
    if (score > 40) return "Medium";
    return "Low";
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <motion.section variants={fadeUp}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Compliance Reports</p>
            <h1 className="mt-2 font-geist text-4xl font-semibold text-zinc-100">Reports</h1>
            <p className="mt-1 text-sm text-zinc-400">View and manage all compliance analysis reports</p>
          </div>
          <Link
            href="/dashboard/copilot"
            className="flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15"
          >
            <Plus className="size-4" />
            New Report
          </Link>
        </div>
      </motion.section>

      {/* Reports Table */}
      <motion.section variants={fadeUp}>
        {reports.length > 0 ? (
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
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-zinc-900/30">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-100">{report.document_title}</td>
                    <td className="px-6 py-4">
                      {getRiskLevelLabel(report.risk_score) && (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRiskLevelColor(
                            report.risk_score
                          )}`}
                        >
                          {getRiskLevelLabel(report.risk_score)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/report/${report.id}`}
                          className="rounded p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-cyan-400"
                          title="View Report"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="rounded p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
                          title="Delete Report"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-12 text-center">
            <p className="text-zinc-400">No reports yet. Start by analyzing a document.</p>
            <Link
              href="/dashboard/copilot"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15"
            >
              <Plus className="size-4" />
              Create Your First Report
            </Link>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
