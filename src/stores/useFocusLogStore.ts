// stores/useFocusLogStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FocusLog = {
  page: string;
  type: "focus" | "blur";
  timestamp: number;
};

interface FocusLogState {
  logs: FocusLog[];
  addLog: (page: string, type: "focus" | "blur") => void;
  clearLogs: () => void;
}

export const useFocusLogStore = create<FocusLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (page, type) =>
        set((state) => ({
          logs: [...state.logs, { page, type, timestamp: Date.now() }],
        })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "focus-log-storage",
    }
  )
);

export function getBlurCountByPage(logs: FocusLog[]) {
    const blurCountByPage: Record<string, number> = {};
  
    logs.forEach((log) => {
      if (log.type === "blur") {
        if (!blurCountByPage[log.page]) {
          blurCountByPage[log.page] = 0;
        }
        blurCountByPage[log.page]++;
      }
    });
  
    return blurCountByPage;
  }