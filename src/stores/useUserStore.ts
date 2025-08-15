import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  group: string;
  prolificId: string;
  sessionId: string;
  studyId: string;
  setUser: (group: string, prolificId: string, sessionId: string, studyId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      group: "",
      prolificId: "",
      sessionId: "",
      studyId: "",
      setUser: (group, prolificId, sessionId, studyId) =>
        set({ group, prolificId, sessionId, studyId}),
    }),
    {
      name: "user-storage", 
    }
  )
);