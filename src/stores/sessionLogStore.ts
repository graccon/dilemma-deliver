import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentChat } from "../services/loadAgentChats";

type SessionLog = {
  sessionId: string;
  caseId: string;
  confidence: number;
  durationMs: number;
  agentChats: AgentChat[] | null;
  turntakingCount: number | null;
};

interface SessionLogState {
  logs: SessionLog[];
  addLog: (log: SessionLog) => void;
  clearLogs: () => void;
}

export const useSessionLogStore = create<SessionLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) => set({ logs: [...get().logs, log] }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "session_logs",
    }
  )
);