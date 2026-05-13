"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  LucideHome,
  LucideBarChart2,
  LucideSettings,
  LucideShield,
  LucideChevronLeft,
  LucideChevronRight,
  LucideLogOut,
} from "lucide-react";

type SidebarProps = {
  mobileOpen: boolean;
  onClose?: () => void;
};

const nav = [
  { href: "/dashboard", name: "Overview", icon: LucideHome },
  { href: "/dashboard/analytics", name: "Analytics", icon: LucideBarChart2 },
  { href: "/dashboard/policies", name: "Policies", icon: LucideShield },
  { href: "/dashboard/settings", name: "Settings", icon: LucideSettings },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname() || "/";
  const [collapsed, setCollapsed] = React.useState(false);

  const desktopWidth = collapsed ? 72 : 256;

  return (
    <>
      {/* Desktop sidebar (collapsible) */}
      <motion.aside
        initial={false}
        animate={{ width: desktopWidth }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "hidden lg:flex flex-col border-r border-border/30 h-screen bg-transparent z-10",
          collapsed ? "w-18" : "w-64"
        )}
      >
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <div className="px-2 mb-3 flex items-center justify-between">
              <div className={cn("font-semibold truncate", collapsed && "hidden")}>Complyt AI</div>
              <button
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => setCollapsed((s) => !s)}
                className="p-1 rounded-md hover:bg-muted/6"
              >
                {collapsed ? <LucideChevronRight className="h-4 w-4" /> : <LucideChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            <nav className="space-y-1 px-1">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/6",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm truncate", collapsed && "hidden")}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-4 px-2">
            <div className={cn("flex items-center gap-3 p-2 rounded-md hover:bg-muted/6 transition-colors", collapsed && "justify-center")}> 
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">JD</div>
              <div className={cn("truncate", collapsed && "hidden")}>
                <div className="text-sm font-medium">J. Doe</div>
                <div className="text-xs text-muted-foreground">jane@complyt.ai</div>
              </div>
              <button className={cn("ml-auto", collapsed && "hidden")} aria-label="Sign out">
                <LucideLogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay (unchanged) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/20 p-4 lg:hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Complyt AI</div>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-muted/6">Close</button>
            </div>

            <nav className="space-y-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/6">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 lg:hidden bg-black/30" />
      )}
    </>
  );
}
