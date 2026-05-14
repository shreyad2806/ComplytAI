import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PersistedReport } from "@/lib/normalize-report";

const STORAGE_KEY = "complyt-reports-v1";

type ReportsState = {
  reports: PersistedReport[];
  addReport: (report: PersistedReport) => void;
  getReport: (id: string) => PersistedReport | undefined;
  removeReport: (id: string) => void;
  clearReports: () => void;
};

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],

      addReport: (report) => {
        set((s) => ({
          reports: [
            report,
            ...s.reports.filter((r) => r.id !== report.id),
          ],
        }));
      },

      getReport: (id) => get().reports.find((r) => r.id === id),

      removeReport: (id) => {
        set((s) => ({
          reports: s.reports.filter((r) => r.id !== id),
        }));
      },

      clearReports: () => set({ reports: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ reports: state.reports }),
    }
  )
);
