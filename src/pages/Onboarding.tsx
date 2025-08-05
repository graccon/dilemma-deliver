import { useRef, useEffect, useState } from "react";
import colors from "../styles/colors";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import { useOnboardingLogic } from "../services/useOnboardingLogic";
import MoreButton from "../components/MoreButton";
import OnboardingCaseDisplay from "../components/OnboardingCasedisplay";
import ConfidenceSliderInOnboarding from "../components/ConfidenceSilderInOnboarding";
import ChatBubble from "../components/ChatBubble";
import type { AgentChat } from "../services/loadAgentChats";
import UserChatBubble from "../components/UserChatBubble";


export default function Onboarding() {
  const {
    isAnswered,
    caseData,
    agentChats,
    likedIndex,
    missionStep,
    advanceMission,
    shouldAnimate,
    setSliderValue,
    appendUserChat,
    getLabelByMissionStep,
    updateLikedIndex,
  } = useOnboardingLogic();

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
    }, []);

  return (
    <MainLayout
      footerButton={
        <FooterButton label="Next Session" to="/session1" disabled={!isAnswered || likedIndex === null} />}
    >
      <Layout>
        <ProblemContainer>
          <CaseContainer>
            {caseData && (
              <OnboardingCaseDisplay disabled={missionStep < 2} caseData={caseData} />
            )}
          </CaseContainer>
          <SliderContainer>
            <ConfidenceSliderInOnboarding 
              initialValue={50}
              key={missionStep} 
              onChange={(value) => {
                setSliderValue(value);
              }}
              disabled={missionStep < 2}
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
                    return (
                      <ChatListItem key={idx} $isUser={chat.from === "me"}>
                        {chat.from === "me" ? (
                          <UserChatBubble message={chat.message}/>
                        ) : (
                          <ChatBubble 
                            chat={chat}
                            mode={missionStep < 4 ? "explain" : "onboarding"}
                            replyTo={replyTarget}
                            liked={likedIndex === idx}
                            shouldAnimate={shouldAnimate ?? true}
                            onLike={() => updateLikedIndex(idx)}
                          />
                        )}
                
                      </ChatListItem>
                    );
                  })}
                  <div ref={chatEndRef} />
                </ChatList>
              )}
          </ChatListWrapper>
          <MoreButtonWrapper>
          <MoreButton
                label={getLabelByMissionStep(missionStep)}
                onClick={() => {
                  const label = getLabelByMissionStep(missionStep);
                  appendUserChat(label);
                  advanceMission();
                }}
                disabled = {missionStep > 6}
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

export const MoreButtonWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding-top: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChatListWrapper = styled.div<{ $isAnimating: boolean }>`
  flex: 10;
  padding: 12px 12px;
  overflow-y: ${({ $isAnimating }) => ($isAnimating ? "hidden" : "auto")};
  scrollbar-width: ${({ $isAnimating }) => ($isAnimating ? "none" : "auto")};
  scrollbar-gutter: stable;
  &::-webkit-scrollbar {
    display: ${({ $isAnimating }) => ($isAnimating ? "none" : "block")};
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
  margin-bottom: 24px;
`;