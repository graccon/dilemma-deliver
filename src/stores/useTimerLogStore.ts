// stores/useTimerLogStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Log = {
  page: string;
  timestamp: number;
};

interface TimerLogState {
  logs: Log[];
  addLog: (page: string) => void;
  clearLogs: () => void;
}

export const useTimerLogStore = create<TimerLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (page) =>
        set((state) => ({
          logs: [...state.logs, { page, timestamp: Date.now() }],
        })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "timer-log-storage",
    }
  )
);