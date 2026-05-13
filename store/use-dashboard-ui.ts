"use client";

import { create } from "zustand";

type DashboardUIState = {
  mobileSidebarOpen: boolean;
  collapsed: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
};

export const useDashboardUI = create<DashboardUIState>((set) => ({
  mobileSidebarOpen: false,
  collapsed: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
}));
