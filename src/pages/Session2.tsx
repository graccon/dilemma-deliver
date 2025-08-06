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
    canTakeTurn,
    likedIndex,
    updateLikedIndex, 
    shouldAnimate,
    isFetchingRef
  } = useSessionLogic();
  

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
    const currentIndex = parseInt(localStorage.getItem(INDEX_KEY) || "0", 10);
    if (currentIndex >= 5) {
      alert("You have already completed Session 2.");
      navigate("/postsurvey"); 
    }
  }, []);


  return (
    <MainLayout
      footerButton={
        <FooterButton
          label={currentIndex < total - 1 ? "Next Question" : "Next Session"}
          onClick={handleNext}
          disabled={!isAnswered || likedIndex === null}
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
                      
                      const hideToTag =
                          idx < agentChats.length - 1 &&
                          agentChats[idx + 1].type === "reply" &&
                          agentChats[idx + 1].to === chat.from;
                      const hideFromTag = chat.type === "reply";

                      return (
                        <ChatListItem key={idx} $isUser={chat.from === "me"}>
                          {chat.from === "me" ? (
                            <UserChatBubble message={chat.message} />
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
                    disabled={!canTakeTurn || isFetchingRef.current}
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


export const ChatListWrapper = styled.div<{ $isAnimating: boolean }>`
  flex: 10;
  padding: 12px 12px;
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
  background-color: transparent; // 기본 배경도 정의해줌
}
`;

export const MoreButtonWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding-top: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
`;


export const ChatContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
`;

export const ProblemContainer = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  height: 80vh;
`;

export const CaseContainer = styled.div`
  flex: 8;
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

const ChatListItem = styled.li<{ $isUser?: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;