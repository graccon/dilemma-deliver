import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentChat } from "../services/loadAgentChats";

export type SessionLog = {
  sessionId: string;
  caseId: string;
  confidence: number;
  durationMs: number;
  agentChats: AgentChat[] | null;
  turntakingCount: number | null;
};

export interface SessionLogState {
  logs: SessionLog[];
  addLog: (log: SessionLog) => void;
  clearLogs: () => void;
}

export function getSessionLogs(sessionId: string) {
  const { logs } = useSessionLogStore.getState();
  return logs.filter(l => l.sessionId === sessionId);
}

export const useSessionLogStore = create<SessionLogState>()(
  persist<SessionLogState>(
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