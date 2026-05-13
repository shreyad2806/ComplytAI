"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GradientText({ children, className }: GradientTextProps) {
  return <span className={cn("accent-gradient font-semibold", className)}>{children}</span>;
}
