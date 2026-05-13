"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";

import { useDashboardUI } from "@/store/use-dashboard-ui";

export function TopNavbar() {
  const setMobileSidebarOpen = useDashboardUI((s) => s.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060d18]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-md border border-white/10 bg-zinc-900/70 p-2 text-zinc-300 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-4" />
        </button>

        <div className="flex max-w-xl flex-1 items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-3 py-2">
          <Search className="size-4 text-zinc-500" />
          <input
            className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
            placeholder="Search documents, regulations, flags..."
          />
          <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">⌘K</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300 md:flex">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            AI System: Nominal
          </div>
          <button className="hidden items-center gap-1 rounded-md border border-white/10 bg-zinc-900/70 px-2.5 py-1.5 text-xs text-zinc-300 md:flex">
            FinTech Corp <ChevronDown className="size-3.5" />
          </button>
          <button className="rounded-md border border-white/10 bg-zinc-900/70 p-2 text-zinc-300">
            <Bell className="size-4" />
          </button>
          <div className="grid size-8 place-content-center rounded-full bg-cyan-500/80 text-xs font-semibold text-cyan-950">
            MR
          </div>
        </div>
      </div>
    </header>
  );
}
