"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const active = resolvedTheme ?? theme;
  const isDark = active === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1 text-sm hover:bg-muted/5 transition"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
