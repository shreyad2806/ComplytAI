"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { PieDatum } from "@/lib/report-analytics";

const EMPTY: PieDatum[] = [
  { name: "Critical", value: 1, color: "#f43f5e" },
  { name: "High", value: 1, color: "#f59e0b" },
  { name: "Medium", value: 1, color: "#eab308" },
  { name: "Low", value: 1, color: "#14b8a6" },
];

export function RiskDistributionChart({ data }: { data: PieDatum[] }) {
  const chartData = data?.length ? data : EMPTY;
  const total = chartData.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Risk Severity Distribution</h4>
      <div className="grid grid-cols-[120px_1fr] items-center gap-3">
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={32}
                outerRadius={45}
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {chartData.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} Risk
              </span>
              <span>
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
