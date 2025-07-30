import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  group: string;
  prolificId: string;
  sessionId: string;
  setUser: (group: string, prolificId: string, sessionId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      group: "",
      prolificId: "",
      sessionId: "",
      setUser: (group, prolificId, sessionId) =>
        set({ group, prolificId, sessionId }),
    }),
    {
      name: "user-storage", 
    }
  )
);