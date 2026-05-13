import { regulations } from "@/lib/mock/dashboard-data";

export function ContextInsights() {
  return (
    <aside className="rounded-xl border border-white/10 bg-[#071225] p-3">
      <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Context & Insights</p>

      <section className="rounded-md border border-white/10 bg-[#081326] p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Relevant Regulations</p>
        <ul className="mt-2 space-y-2">
          {regulations.map((item) => (
            <li key={item} className="text-xs text-zinc-400">
              • {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-md border border-white/10 bg-[#081326] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Risk Meter</p>
          <p className="text-[10px] text-rose-300">Medium</p>
        </div>
        <div className="h-1.5 rounded bg-zinc-800">
          <div className="h-full w-[64%] rounded bg-amber-400" />
        </div>
      </section>

      <section className="mt-3 rounded-md border border-white/10 bg-[#081326] p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">AI Confidence</p>
        <p className="mt-1 font-geist text-3xl text-cyan-300">96.2%</p>
      </section>

      <section className="mt-3 rounded-md border border-white/10 bg-[#081326] p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Recommended Actions</p>
        <ul className="mt-2 space-y-2 text-xs text-zinc-400">
          <li>File FinCEN SAR</li>
          <li>EDD review - 3 accounts</li>
          <li>Update OFAC screening</li>
          <li>SOX control remediation</li>
        </ul>
      </section>
    </aside>
  );
}
