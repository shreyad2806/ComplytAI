"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MetricTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MetricText({ children, className }: MetricTextProps) {
  return (
    <div className={cn("font-mono text-3xl md:text-4xl font-semibold text-strong tracking-tight", className)}>
      {children}
    </div>
  );
}
