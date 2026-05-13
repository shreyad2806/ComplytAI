"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SectionTitleProps = {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
};

export default function SectionTitle({ children, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg md:text-xl font-semibold text-strong">{children}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
