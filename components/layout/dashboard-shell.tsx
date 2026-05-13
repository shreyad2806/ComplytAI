"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isReportRoute = pathname?.startsWith("/dashboard/report") ?? false;

  return (
    <div className="min-h-screen bg-[#030814] text-zinc-100">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          {!isReportRoute && <TopNavbar />}
          <main
            className={cn(
              isReportRoute ? "px-0 pb-20 pt-0 sm:pb-6" : "px-3 pb-20 pt-4 sm:px-5 lg:pb-6"
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
