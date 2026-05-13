import { AlertTriangle } from "lucide-react";

import { auditFlags } from "@/lib/mock/dashboard-data";
import { RiskBadge } from "@/components/dashboard/risk-badge";

export function AuditFlagsPanel() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-geist text-lg text-zinc-100">Active Audit Flags</h3>
        <button className="text-xs text-zinc-500 hover:text-zinc-300">View all</button>
      </div>
      <div className="space-y-3">
        {auditFlags.map((flag) => (
          <article key={flag.title} className="rounded-md border border-white/10 bg-[#081326] p-3">
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
