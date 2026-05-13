"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type AnalyticsCardProps = {
  title?: string;
  accent?: React.ReactNode;
  children?: React.ReactNode; // chart or content
  className?: string;
};

export default function AnalyticsCard({ title, accent, children, className }: AnalyticsCardProps) {
  return (
    <div className={cn("card border-soft overflow-hidden relative group hover:shadow-dash-md transition-transform hover:-translate-y-0.5", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div>
          {title && <div className="text-sm font-semibold text-strong">{title}</div>}
        </div>
        {accent && <div className="text-sm">{accent}</div>}
      </div>

      <div className="p-4">
        <div className="min-h-[140px]">{children}</div>
      </div>

      {/* border glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 blur-3xl" style={{ boxShadow: '0 20px 60px rgba(56,189,248,0.06)' }} />
      </div>
    </div>
  );
}
