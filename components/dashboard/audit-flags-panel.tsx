"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

import { RiskBadge } from "@/components/dashboard/risk-badge";
import { selectAuditFlagsPanel } from "@/lib/report-analytics";
import { useReportsStore } from "@/store/useReportsStore";

export function AuditFlagsPanel() {
  const reports = useReportsStore((s) => s.reports);
  const flags = useMemo(() => selectAuditFlagsPanel(reports), [reports]);

  return (
    <section className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-geist text-lg text-zinc-100">Active Audit Flags</h3>
        <span className="text-xs text-zinc-500">{flags.length} shown</span>
      </div>
      <div className="space-y-3">
        {flags.map((flag) => (
          <article key={`${flag.title}-${flag.ago}`} className="rounded-md border border-white/10 bg-[#081326] p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 text-rose-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">{flag.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{flag.subtitle}</p>
              </div>
              <div className="text-right">
                <RiskBadge level={flag.severity} />
                <p className="mt-1 text-[10px] text-zinc-600">{flag.ago}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
