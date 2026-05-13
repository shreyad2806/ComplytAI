import { quickIntelligence } from "@/lib/mock/dashboard-data";

export function QuickIntelligence() {
  return (
    <aside className="rounded-xl border border-white/10 bg-[#071225] p-3">
      <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Quick Intelligence</p>
      <div className="space-y-2">
        {quickIntelligence.map((item) => (
          <article key={item.title} className="rounded-md border border-white/10 bg-[#081326] p-3">
            <div className="mb-2 inline-flex rounded-md border border-cyan-400/30 bg-cyan-500/10 p-1.5 text-cyan-300">
              <item.icon className="size-3.5" />
            </div>
            <p className="text-sm font-medium text-zinc-200">{item.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{item.subtitle}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
