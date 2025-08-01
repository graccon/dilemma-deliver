import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { loadAgentChats } from "../services/loadAgentChats";
import type { AgentChat } from "../services/loadAgentChats";
import ChatBubble from "../components/ChatBubble";

import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import MoralCase from "../models/MoralCase";
import problems from "../assets/data/problems.json";
import { initShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCaseDisplay from "../components/MoralCaseDisplay";
import ConfidenceSlider from "../components/ConfidenceSilder";
import colors from "../styles/colors";
import { useConfidenceStore } from "../stores/useConfidenceStore";


export default function Session2() {
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState(50); 
  const total = problems.length;
  const { group, prolificId, sessionId } = useUserStore();
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);

  const addConfidence = useConfidenceStore((state) => state.addConfidence);
  const INDEX_KEY = import.meta.env.VITE_S2_I_KEY 

    useEffect(() => {
      initShuffledProblems();
      const savedIndex = localStorage.getItem(INDEX_KEY);
      if (savedIndex !== null) {
        setCurrentIndex(Number(savedIndex));
      }
    }, []);

    useEffect(() => {
      const caseData = getProblemByIndex(currentIndex);
      if (caseData) {
        const instance = new MoralCase(caseData);
        setCurrentCase(instance);
        setIsAnswered(false);
        setCurrentConfidence(50);
      }

      async function fetchChats() {
        try {
          const chats = await loadAgentChats(caseData.id, "1", group); //case, turn, group
          setAgentChats(chats);
        } catch (error) {
          console.error("Error loading agent chats:", error);
        }
      }
      fetchChats();
    }, [currentIndex]);

    const handleNext = () => {
      addConfidence({
        sessionId: "session2",
        caseIndex: currentIndex,
        confidence: currentConfidence,
        timestamp: Date.now(),
        type: "final",
      });

      const nextIndex = currentIndex + 1;
      setCurrentIndex((prev) => prev + 1);
      localStorage.setItem(INDEX_KEY, nextIndex.toString());
  
      if (currentIndex < total - 1) {
      } else {
        window.location.href = "/postsurvey";
      }
    };

  return (
    <MainLayout
      footerButton={
        <FooterButton
          label={currentIndex < total - 1 ? "Next Question" : "Next Session"}
          onClick={handleNext}
          disabled={!isAnswered}
        />
      }
    > 
    <Layout>
      <ProblemContainer>
          <CaseContainer>
            {currentCase && (
              <MoralCaseDisplay
                caseData={currentCase}
                index={currentIndex}
                total={total}
              />
            )}
          </CaseContainer>
          <SliderContainer>
            <ConfidenceSlider
              key={currentIndex}
              initialValue={50}
              onChange={(value) => {
                console.log("confidence:", value);
                setIsAnswered(value !== 50);
              }}
              onTouchEnd={(value) => {
                addConfidence({
                  sessionId: "session2",
                  caseIndex: currentIndex,
                  confidence: value,
                  timestamp: Date.now(),
                  type: "onTouchEnd",
                });
              }}
            />
          </SliderContainer>
        </ProblemContainer>

          <ChatContainer>
            <ChatListWrapper>
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
            </ChatListWrapper>
            <MoreButtonWatter>I can't decide yet</MoreButtonWatter>
          </ChatContainer>
        </Layout>
      </MainLayout>
  );
}

export const Layout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100wh; 
  gap: 1rem; 
`;

export const ChatListWrapper = styled.div`
  flex: 10;
  overflow-y: auto;
 
`;

export const MoreButtonWatter = styled.div`
  flex: 1;
  margin: auto;
`;


export const ChatContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 78vh;
  padding: 10px;
`;


export const ProblemContainer = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  height: 78vh;
`;

export const CaseContainer = styled.div`
  flex: 10;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto; 
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const SliderContainer = styled.div`
  flex: 2;
  width: 100%;
  margin: 0 auto;
  border-radius: 1rem;
  background-color: ${colors.white};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatListItem = styled.li`
  margin-bottom: 24px;
`;