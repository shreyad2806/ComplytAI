"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MetricCardProps = {
  title: string;
  value: React.ReactNode;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  className?: string;
};

export default function MetricCard({ title, value, delta, trend = "flat", icon, className }: MetricCardProps) {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <div className={cn("card hover:shadow-dash-md transition-transform transform hover:-translate-y-0.5 group", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">{title}</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold text-strong">{value}</div>
            {delta && (
              <div className={cn("px-2 py-0.5 text-xs rounded-md font-medium", trendColor, "bg-muted/8")}>{delta}</div>
            )}
          </div>
        </div>

        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
    </div>
  );
}
