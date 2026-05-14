"use client";

import { useMemo } from "react";

import { selectAnalysisCards } from "@/lib/report-analytics";
import { useReportsStore } from "@/store/useReportsStore";

export function AnalysisCards() {
  const reports = useReportsStore((s) => s.reports);
  const cards = useMemo(() => selectAnalysisCards(reports), [reports]);

  return (
    <section className="mt-5">
      <div className="grid gap-3 xl:grid-cols-3">
        {cards.map((card) => {
          const pctRaw = Number.parseFloat(String(card.score).replace(/[^0-9.]/g, ""));
          const pct = Number.isFinite(pctRaw) ? Math.min(100, Math.max(0, pctRaw)) : 0;
          return (
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
                <div
                  className="h-full rounded bg-cyan-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </article>
        );
        })}
      </div>
    </section>
  );
}
