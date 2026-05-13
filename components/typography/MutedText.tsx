"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MutedTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MutedText({ children, className }: MutedTextProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}
