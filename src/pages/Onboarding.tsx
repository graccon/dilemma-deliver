import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import { loadAgentChats } from "../services/loadAgentChats";
import type { AgentChat } from "../services/loadAgentChats";
import ChatBubble from "../components/ChatBubble";
import styled from "styled-components";

export default function Onboarding() {
  const { group, prolificId, sessionId } = useUserStore();
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);

  useEffect(() => {
    if (!group) {
      console.warn("⚠️ group not loading.");
      return;
    }

    async function fetchChats() {
      try {
        const chats = await loadAgentChats("case_1", "1", group); //case, turn, group
        console.log("Loaded agent chats:", chats);
        setAgentChats(chats);
      } catch (error) {
        console.error("Error loading agent chats:", error);
      }
    }

    fetchChats();
  }, [group]);

  return (
    <MainLayout
      footerButton={<FooterButton label="Next" to="/session1" disabled={false} />}
    >
      <div>
        <h1>Hello this is onboarding page!</h1>
        <p>Group: {group || "(Not set)"}</p>
        <p>Prolific ID: {prolificId || "(Not set)"}</p>
        <p>Session ID: {sessionId || "(Not set)"}</p>

        <h1>Hello</h1>



        {agentChats.length === 0 ? (
          <p>Loading agent chats...</p>
        ) : (
          <ChatList>
            {agentChats.map((chat: AgentChat, idx: number) => {
              let replyTarget: AgentChat | null = null;

              if (chat.type === "reply") {
                replyTarget = agentChats
                  .slice(0, idx)
                  .reverse()
                  .find(prevChat => prevChat.type === "talk") || null;
              }
              return (
                <ChatListItem key={idx}>
                  <ChatBubble chat={chat} idx={idx} replyTo={replyTarget} />
                </ChatListItem>
              );
            })}
          </ChatList>
        )}
      </div>
    </MainLayout>
  );
}

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatListItem = styled.li`
  margin-bottom: 24px;
`;