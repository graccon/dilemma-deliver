// services/useAgentChat.ts
import { useEffect, useState } from "react";
import { loadAgentChats } from "./loadAgentChats";
import type { AgentChat } from "../services/loadAgentChats";

export function useAgentChat(caseId: string, turnId: string, group: string) {
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        const chats = await loadAgentChats(caseId, turnId, group);
        setAgentChats(chats);
      } catch (error) {
        console.error("Error loading agent chats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [caseId, turnId, group]);

  return { agentChats, loading };
}