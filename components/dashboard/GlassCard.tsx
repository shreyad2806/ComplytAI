"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassCardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function GlassCard({ title, subtitle, children, className }: GlassCardProps) {
  return (
    <div className={cn("glass p-4 transition hover:shadow-glow-md hover:scale-[1.01]", className)}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <div className="text-sm font-semibold text-strong">{title}</div>}
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      )}

      <div className="min-h-[48px]">{children}</div>
    </div>
  );
}
