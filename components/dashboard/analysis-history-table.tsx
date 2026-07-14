"use client";

import Link from "next/link";
import { useMemo } from "react";

import { RiskBadge } from "@/components/dashboard/risk-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReportsStore } from "@/store/useReportsStore";

function severityToLevel(value: string): "critical" | "high" | "med" | "low" {
  const normalized = value.toLowerCase();
  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("med")) return "med";
  return "low";
}

function formatAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function AnalysisHistoryTable() {
  const reports = useReportsStore((s) => s.reports);

  const rows = useMemo(
    () =>
      [...reports].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reports]
  );

  return (
    <section className="mt-5 rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-geist text-lg text-zinc-100">Recent Analysis History</h3>
        <p className="text-xs text-zinc-500">{rows.length} document{rows.length === 1 ? "" : "s"}</p>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No analyses yet. Run AI Copilot to generate a compliance report.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-500">Document</TableHead>
              <TableHead className="text-zinc-500">Analysis Type</TableHead>
              <TableHead className="text-zinc-500">Risk Score</TableHead>
              <TableHead className="text-zinc-500">Risk Level</TableHead>
              <TableHead className="text-zinc-500">Flags</TableHead>
              <TableHead className="text-zinc-500">Status</TableHead>
              <TableHead className="text-zinc-500">Analyzed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const flags = Array.isArray(row.audit_flags) ? row.audit_flags.length : 0;
              return (
                <TableRow
                  key={row.id}
                  className="border-white/10 hover:bg-[#0a1730] cursor-pointer"
                >
                  <TableCell className="p-0 font-medium">
                    <Link
                      href={`/dashboard/report/${row.id}`}
                      className="block px-2 py-3 text-zinc-200 hover:text-cyan-200"
                    >
                      {row.fileName ?? row.prompt?.slice(0, 48) ?? row.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      {row.analysis_type}
                    </Link>
                  </TableCell>
                  <TableCell className="text-cyan-300">
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      {String(row.risk_score)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      <RiskBadge level={severityToLevel(String(row.risk_level ?? ""))} />
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      {flags}
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      Complete
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    <Link href={`/dashboard/report/${row.id}`} className="block py-3">
                      {formatAgo(row.createdAt)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
