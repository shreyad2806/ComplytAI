"use client";

const items = [
  { label: "FinCEN SAR Filing", value: "72h", width: "92%", color: "bg-rose-400" },
  { label: "FFIEC Exam Prep", value: "18 days", width: "64%", color: "bg-amber-400" },
  { label: "Annual SOX Audit", value: "47 days", width: "38%", color: "bg-emerald-400" },
  { label: "PCI-DSS Assessment", value: "63 days", width: "31%", color: "bg-teal-400" },
];

export function AuditExposureChart() {
  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Audit Exposure Timeline</h4>
      <div className="space-y-4">
        {items.map((item) => (
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
