"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import type { TrendDatum } from "@/lib/report-analytics";

export function ComplianceTrendChart({ data }: { data: TrendDatum[] }) {
  const chartData = useMemo(() => data?.length ? data : [{ month: "—", score: 0 }], [data]);
  const domain = useMemo(() => {
    const scores = chartData.map((d) => d.score).filter((n) => Number.isFinite(n));
    if (!scores.length) return [0, 100] as [number, number];
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const pad = Math.max(5, Math.round((max - min) * 0.15));
    return [Math.max(0, min - pad), Math.min(100, max + pad)] as [number, number];
  }, [chartData]);

  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">Risk score trend</h4>
        <span className="text-[10px] uppercase tracking-[0.14em] text-cyan-300">Live</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis axisLine={false} tickLine={false} dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis hide domain={domain} />
            <Area type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={2} fill="url(#trendFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
