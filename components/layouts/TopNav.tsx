"use client";

import * as React from "react";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import {
  LucideMenu,
  LucideBell,
  LucideSearch,
  LucideChevronDown,
  LucideCheck,
  LucideActivity,
} from "lucide-react";

type TopNavProps = {
  onOpenSidebar?: () => void;
};

export default function TopNav({ onOpenSidebar }: TopNavProps) {
  const [notifCount] = useState(3);
  const [aiStatus] = useState("Ready");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/60 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            onClick={onOpenSidebar}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/6"
          >
            <LucideMenu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="font-semibold text-lg">Complyt AI</div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="mx-auto">
            <Input placeholder="Search policies, controls, audits..." className="max-w-2xl" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/6">
                <LucideSearch className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Search</SheetTitle>
                <div className="pt-2">
                  <Input placeholder="Search policies, controls, audits..." />
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {/* AI status */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/6">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm">AI: {aiStatus}</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/6">
                <LucideBell className="h-5 w-5" />
                {notifCount > 0 && (
                  <Badge className="absolute -top-1 -right-1" variant="destructive">{notifCount}</Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8} align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem>
                <div className="flex items-start gap-2">
                  <LucideActivity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">New policy evaluation completed</div>
                    <div className="text-xs text-muted-foreground">2m ago</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-start gap-2">
                  <LucideCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">Control drift detected</div>
                    <div className="text-xs text-muted-foreground">10m ago</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View all</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/6">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">J. Doe</span>
                <LucideChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={6} align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
