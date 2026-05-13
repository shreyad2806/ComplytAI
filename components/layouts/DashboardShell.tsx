"use client";

import * as React from "react";
import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import TopNav from "@/components/layouts/TopNav";
import { cn } from "@/lib/utils";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col">
        <TopNav onOpenSidebar={() => setMobileOpen(true)} />

        <main className={cn("flex-1 container mx-auto px-4 py-6 w-full")}>{children}</main>
      </div>
    </div>
  );
}
