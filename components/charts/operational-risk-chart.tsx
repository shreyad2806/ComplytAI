"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function OperationalRiskChart({
  data,
}: {
  data: { name: string; v: number }[];
}) {
  const chartData = data?.length ? data : [{ name: "—", v: 0 }];

  return (
    <article className="rounded-xl border border-white/10 bg-[#071225] p-4">
      <h4 className="mb-3 text-sm font-medium text-zinc-200">Signals by category (AML / SOX / …)</h4>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="v" radius={[3, 3, 0, 0]} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
