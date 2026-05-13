"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DashboardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardTitle({ children, className }: DashboardTitleProps) {
  return (
    <h3 className={cn("text-2xl md:text-3xl font-semibold text-strong tracking-tight", className)}>
      {children}
    </h3>
  );
}
