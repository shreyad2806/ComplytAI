"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Critical", value: 25, color: "#f43f5e" },
  { name: "High", value: 45, color: "#f59e0b" },
  { name: "Low", value: 30, color: "#14b8a6" },
];

export function RiskDistributionChart() {
  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Risk Severity Distribution</h4>
      <div className="grid grid-cols-[120px_1fr] items-center gap-3">
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={32} outerRadius={45} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} Risk
              </span>
              {item.value}%
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
