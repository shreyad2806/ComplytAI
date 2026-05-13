"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HeroTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-strong", className)}>
      {children}
    </h1>
  );
}
