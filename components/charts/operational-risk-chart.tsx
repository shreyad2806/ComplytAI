"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "AML", v: 68 },
  { name: "KYC", v: 54 },
  { name: "SOX", v: 49 },
  { name: "OFAC", v: 35 },
  { name: "Fraud", v: 61 },
  { name: "Basel", v: 42 },
  { name: "Dodd", v: 52 },
];

export function OperationalRiskChart() {
  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Operational Risk by Category</h4>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis hide />
            <Bar dataKey="v" radius={[3, 3, 0, 0]} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
