import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConfidenceLog = {
    sessionId: string;
    caseIndex: number; 
    confidence: number;
    timestamp: number;
    type: ConfidenceLogType;
  };

type ConfidenceLogType = "onTouchEnd" | "final";

interface ConfidenceState {
  confidenceLogs: ConfidenceLog[];
  addConfidence: (log: ConfidenceLog) => void;
  clearConfidence: () => void;
}

export function getConfidenceLogs(sessionId: string) {
  const state = useConfidenceStore.getState();
  return state.confidenceLogs.filter((log) => log.sessionId === sessionId);
}

export const useConfidenceStore = create<ConfidenceState>()(
  persist(
    (set) => ({
      confidenceLogs: [],
      addConfidence: (log) =>
        set((state) => ({
          confidenceLogs: [...state.confidenceLogs, log],
        })),
      clearConfidence: () => set({ confidenceLogs: [] }),
    }),
    {
      name: "confidence-log-storage",
    }
  )
);