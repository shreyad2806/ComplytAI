"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type ComplianceGaugeProps = {
  score: number;
  label: string;
};

export function ComplianceGauge({ score, label }: ComplianceGaugeProps) {
  const rest = Math.max(0, 100 - score);
  const data = [
    { name: "score", value: score },
    { name: "rest", value: rest },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-full max-w-[280px] sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius="72%"
              outerRadius="100%"
              stroke="none"
              isAnimationActive
            >
              <Cell fill="url(#gaugeGrad)" />
              <Cell fill="rgba(39,39,42,0.65)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
          <p className="font-geist text-4xl font-semibold tracking-tight text-zinc-100 tabular-nums sm:text-5xl">{score}</p>
          <p className="mt-1 max-w-[200px] text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
