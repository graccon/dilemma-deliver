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


export default function Session2() {
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
    updateLikedIndex
  } = useSessionLogic();

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
                                <ChatBubble 
                                chat={chat}
                                idx={idx}
                                replyTo={replyTarget}
                                liked={likedIndex === idx}
                                onLike={() => updateLikedIndex(idx)}
                              />
                              </ChatListItem>
                            );
                          })}
                        </ChatList>
                      )}
            </ChatListWrapper>
  
            <MoreButtonWrapper>
              <MoreButton
                    label={"I can't decide yet"}
                    onClick={handleMoreClick}
                    disabled={!canTakeTurn}
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

export const ChatListWrapper = styled.div`
  flex: 10;
  overflow-y: auto;
  padding: 12px 12px;
 
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