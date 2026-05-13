"use client";

import React from "react";
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      {children}
    </NextThemeProvider>
  );
}

export function useTheme() {
  return useNextTheme();
}
