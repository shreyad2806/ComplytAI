"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const trendData = [
  { month: "Jun", score: 62 },
  { month: "Jul", score: 68 },
  { month: "Aug", score: 74 },
  { month: "Sep", score: 79 },
  { month: "Oct", score: 83 },
  { month: "Nov", score: 88 },
  { month: "Dec", score: 92 },
];

export function ComplianceTrendChart() {
  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">Compliance Trend - 12M</h4>
        <span className="text-[10px] uppercase tracking-[0.14em] text-cyan-300">Live</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis axisLine={false} tickLine={false} dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis hide domain={[55, 95]} />
            <Area type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={2} fill="url(#trendFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
