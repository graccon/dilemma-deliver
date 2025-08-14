import { useRef, useEffect, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import MoralCaseDisplay from "../components/MoralCaseDisplay";
import ConfidenceSlider from "../components/ConfidenceSilder";
import colors from "../styles/colors";
import { useSessionLogic } from "../services/useSessionLogic";
import type { AgentChat } from "../services/loadAgentChats";
import MoreButton from "../components/MoreButton";
import { useNavigate } from "react-router-dom";
import UserChatBubble from "../components/UserChatBubble";
import { getCurrentSessionIndex } from "../services/sessionUtils";
import { restartCaseTimer } from "../stores/caseTurnTimerStorage";
import { usePerCaseTimer } from "../services/usePerCaseTimer";

export default function Session2() {
  const INDEX_KEY = import.meta.env.VITE_S2_I_KEY;

  const {
    isAnswered,
    setIsAnswered,
    currentIndex,
    currentCase,
    handleNext,
    total,
    addConfidence,
    agentChats,
    handleMoreClick,
    setCurrentConfidence,
    canTakeTurn,
    likedIndex,
    updateLikedIndex, 
    shouldAnimate,
    timerReady,
  } = useSessionLogic();

  const SESSION_ID = "session2";
  const PER_CASE_LIMIT_MS = 1 * 60 * 1000;
  const { remainingMs, resetFlags } = usePerCaseTimer(
      SESSION_ID,
      currentCase?.id,
      PER_CASE_LIMIT_MS,
      timerReady,
      () => {
        const ok = window.confirm("You’ve reached the 15-minute limit for this case. Restart the timer?");
        if (ok) {
          resetFlags();
          restartCaseTimer(SESSION_ID, currentCase!.id);
        }
      },
  );
  

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [agentChats]);

  const [isAnimating, setIsAnimating] = useState(true);

      useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 300); 
        return () => clearTimeout(timer);
  }, [agentChats]);

  const navigate = useNavigate();
  useEffect(() => {
    const currentIndex =  getCurrentSessionIndex(INDEX_KEY);
    if (currentIndex >= 5) {
      alert("You have already completed Session 2.");
      navigate("/postsurvey"); 
    }
  }, []);

  return (
    <MainLayout
      currentStep={4}
      footerButton={
        <FooterButton
          label={currentIndex < total - 1 ? "Next Question" : "Next Session"}
          onClick={handleNext}
          disabled={!isAnswered || likedIndex === null || !timerReady}
          isTimer={timerReady}         
          elapsedMs={remainingMs} 
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
                mode="ChatWith"
              />
            )}
          </CaseContainer>
          <SliderContainer>
            <ConfidenceSlider
              key={currentIndex}
              initialValue={50}
              onChange={(value) => {
                setIsAnswered(value !== 50);
                setCurrentConfidence(value);
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
            <ChatListWrapper $isAnimating={isAnimating}>
            {agentChats.length === 0 ? (
                <p></p>
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
                      const nextChat = agentChats[idx + 1];
                      const hideToTag = chat.to === "me" || nextChat?.type === "reply";
                      const hideFromTag = chat.type === "reply";

                      return (
                        <ChatListItem key={idx} $isUser={chat.from === "me"}>
                          {chat.from === "me" ? (
                              <UserChatBubble message={chat.message} 
                                />
                          ) : (
                            <ChatBubble
                              chat={chat}
                              mode="default"
                              replyTo={replyTarget}
                              liked={likedIndex === idx}
                              shouldAnimate={shouldAnimate ?? true}
                              onLike={() => updateLikedIndex(idx)}
                              hideFromTag={hideFromTag}
                              hideToTag={hideToTag}
                            />
                          )}
                        </ChatListItem>
                      );
                    })
                  }
                   <div ref={chatEndRef} />
                </ChatList>
                )}
            </ChatListWrapper>
  
            <MoreButtonWrapper>
              <MoreButton
                    label={"I can't decide yet"}
                    onClick={handleMoreClick}
                    disabled={!canTakeTurn}// || isFetchingRef.current
                  />
            </MoreButtonWrapper>
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

export const ChatContainer = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 78vh;
  padding: 10px 0px 10px 10px;
  background-color: ${colors.white};
`;

export const ProblemContainer = styled.div`
  flex: 10;
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

export const MoreButtonWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChatListWrapper = styled.div<{ $isAnimating: boolean }>`
  flex: 10;
  overflow-y: scroll;
  scrollbar-gutter: stable;
  scroll-padding-bottom: 40px; 
  padding-top: 10px; 
   &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray300};
    border-radius: 20px;
  }
    &::-webkit-scrollbar {
  width: 8px;
}
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatListItem = styled.li<{ $isUser?: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  margin-bottom: 5px;
`;