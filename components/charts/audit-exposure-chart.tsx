"use client";

import type { AuditBar } from "@/lib/report-analytics";

export function AuditExposureChart({ items }: { items: AuditBar[] }) {
  const data = items?.length ? items : [
    { label: "No data", value: "—", width: "8%", color: "bg-zinc-600" },
  ];

  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Audit exposure (latest run)</h4>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs text-zinc-400">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-1.5 rounded bg-zinc-800">
              <div className={`h-full rounded ${item.color}`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
