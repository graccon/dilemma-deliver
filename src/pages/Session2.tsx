import { useEffect, useState } from "react";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import MoralCase from "../models/MoralCase";
import problems from "../assets/data/problems.json";
import { resetShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCaseDisplay from "../components/MoralCaseDisplay";
import ConfidenceSlider from "../components/ConfidenceSilder";
import colors from "../styles/colors";
import agentChatData from "../assets/data/agentChats.json";
import { useConfidenceStore } from "../stores/useConfidenceStore";

export default function Session2() {
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState(50); 
  const total = problems.length;

  const addConfidence = useConfidenceStore((state) => state.addConfidence);
  const INDEX_KEY = import.meta.env.VITE_S2_I_KEY 
  const agentLabel: Record<string, string> = {
    Stat: "Stat",
    Rule: "Rlue",
    Narr: "Molu",
  };

interface AgentChat {
  agent: string;
  message: string;
}
const [agentChats, setAgentChats] = useState<AgentChat[]>([]);

  useEffect(() => {
      const savedIndex = localStorage.getItem(INDEX_KEY);
      if (savedIndex !== null) {
        resetShuffledProblems();
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
    
        const caseId = caseData.id;;
        const groupId = "1"; 

        const caseEntry = agentChatData.find((entry) => entry.caseId === caseId);
    if (caseEntry) {
      const groupData = caseEntry.groups?.[groupId];
      if (groupData && Array.isArray(groupData.rounds)) {
        const flattenedChats = groupData.rounds.flatMap((round) => [
          { agent: "Stat", message: round.Stat.message },
          { agent: "Rule", message: round.Rule.message },
          { agent: "Narr", message: round.Narr.message },
        ]);
        console.log(flattenedChats);
        setAgentChats(flattenedChats);

      } else {
        setAgentChats([]);
      }
    } else {
      setAgentChats([]);
    }
    
    
      }
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
          <ChatList>
              {agentChats.map((chat, idx) => (
                <ChatBubble key={idx} agent={chat.agent}>
                  <strong>{agentLabel[chat.agent] || chat.agent}</strong>: {chat.message}
                </ChatBubble>
              ))}
            </ChatList>
          </ChatContainer>
        </Layout>
      </MainLayout>
  );
}

export const Layout = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 3rem;
  width: 100wh; 
  gap: 1rem; 
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  overflow-y: auto;
`;

const ChatBubble = styled.div<{ agent?: string }>`
  background-color: ${({ agent }) =>
    agent === "Stat" ? "#D0F0FF" :
    agent === "Rule" ? "#FFEFD0" :
    agent === "Narr" ? "#FADADD" :
    "#f0f0f0"};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 90%;
  font-size: 0.95rem;
`;

export const ChatContainer = styled.div`
  flex: 4;
  display: flex;
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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