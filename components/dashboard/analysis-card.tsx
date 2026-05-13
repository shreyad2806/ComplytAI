import { analysisCards } from "@/lib/mock/dashboard-data";

export function AnalysisCards() {
  return (
    <section className="mt-5">
      <div className="grid gap-3 xl:grid-cols-3">
        {analysisCards.map((card) => (
          <article key={card.title} className="rounded-xl border border-white/10 bg-[#071225] p-4">
            <div className="flex items-center justify-between">
              <p className="font-geist text-lg text-zinc-100">{card.title}</p>
              <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                {card.level}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="text-sm text-zinc-400">
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>AI Confidence</span>
                <span className="text-cyan-300">{card.score}%</span>
              </div>
              <div className="h-1.5 rounded bg-zinc-800">
                <div className="h-full rounded bg-cyan-400" style={{ width: `${card.score}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
