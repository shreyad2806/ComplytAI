"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CircleDot,
  FileSearch,
  Flag,
  History,
  LayoutGrid,
  Menu,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useDashboardUI } from "@/store/use-dashboard-ui";

const primaryItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard#documents", label: "Document Analysis", icon: FileSearch },
  { href: "/dashboard/copilot", label: "AI Copilot", icon: Bot },
  { href: "/dashboard#risk", label: "Risk Intelligence", icon: ShieldAlert },
  { href: "/dashboard/report/RPT-2025-0847", label: "Reports", icon: FileSearch },
];

const secondaryItems = [
  { href: "/dashboard#flags", label: "Audit Flags", icon: Flag },
  { href: "/dashboard#history", label: "History", icon: History },
  { href: "/dashboard#settings", label: "Settings", icon: Settings },
];

function SidebarContent() {
  const pathname = usePathname();
  const collapsed = useDashboardUI((s) => s.collapsed);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-cyan-500 text-xs font-bold text-cyan-950">
            C
          </div>
          {!collapsed && <p className="font-geist text-sm font-semibold text-zinc-100">ComplytAI</p>}
        </div>
      </div>

      <nav className="space-y-6 px-3 py-4">
        <div className="space-y-1">
          {primaryItems.map((item) => {
            const active =
              item.href.startsWith("/dashboard/report")
                ? (pathname?.startsWith("/dashboard/report") ?? false)
                : item.href.includes("#")
                  ? pathname === "/dashboard"
                  : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition",
                  active
                    ? "border-cyan-400/35 bg-cyan-500/10 text-cyan-200"
                    : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <item.icon className="size-4" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>

        {!collapsed && <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-zinc-600">Compliance</p>}
        <div className="space-y-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-zinc-400 transition hover:border-white/10 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <item.icon className="size-4" />
              {!collapsed && item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-md border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
          <CircleDot className="size-3.5" />
          {!collapsed && "AI Engine Online"}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const collapsed = useDashboardUI((s) => s.collapsed);
  const toggleCollapsed = useDashboardUI((s) => s.toggleCollapsed);
  const mobileSidebarOpen = useDashboardUI((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useDashboardUI((s) => s.setMobileSidebarOpen);

  return (
    <>
      <aside
        className={cn(
          "hidden h-screen border-r border-white/10 bg-[#050b15] lg:block",
          collapsed ? "w-[84px]" : "w-[246px]"
        )}
      >
        <SidebarContent />
      </aside>

      <button
        onClick={toggleCollapsed}
        className="fixed bottom-4 left-4 z-40 hidden rounded-md border border-white/10 bg-zinc-900/90 p-2 text-zinc-300 lg:block"
        aria-label="Toggle sidebar size"
      >
        <Menu className="size-4" />
      </button>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[256px] border-r border-white/10 bg-[#050b15] lg:hidden"
            >
              <div className="flex items-center justify-end p-2">
                <button onClick={() => setMobileSidebarOpen(false)} className="rounded-md p-2 text-zinc-300">
                  <X className="size-4" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
