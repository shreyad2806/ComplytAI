"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportHeader({ reportId }: { reportId: string }) {
  const pathname = usePathname();
  const reportPath = `/dashboard/report/${encodeURIComponent(reportId)}`;
  const tabs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: reportPath, label: "Reports" },
    { href: "/dashboard#risk", label: "Risk Intel" },
    { href: "/dashboard#flags", label: "Audit Flags" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="grid size-8 place-content-center rounded-md bg-cyan-500 text-xs font-bold text-cyan-950">C</div>
            <span className="font-geist text-sm font-semibold tracking-tight text-zinc-100">ComplytAI</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {tabs.map((tab) => {
              const active =
                tab.label === "Reports"
                  ? pathname?.startsWith("/dashboard/report")
                  : pathname === tab.href.split("#")[0] || pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={cn(
                    "border-b-2 px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                    active ? "border-cyan-400 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-zinc-800/90 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-400">
            Report ID: {reportId}
          </span>
          <Button
            variant="outline"
            className="h-9 border-zinc-700/80 bg-zinc-950/50 text-zinc-300 hover:border-cyan-500/30 hover:bg-zinc-900"
          >
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button className="h-9 bg-cyan-600 text-cyan-950 shadow-[0_0_18px_rgba(6,182,212,0.25)] hover:bg-cyan-500">
            <Download className="size-3.5" />
            Export PDF
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
