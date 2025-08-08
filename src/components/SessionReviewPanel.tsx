// components/SessionReviewPanel.tsx
import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import type { SessionLog } from "../stores/sessionLogStore";
import CaseSummary from "./CaseSummary";
import colors from "../styles/colors";
import SessionChoicePanel from "./SessionChoicePanel";
import type { AgentChat } from "../services/loadAgentChats";
import ChatBubble from "./ChatBubble";

type Props = {
    session1Logs: SessionLog[];
    session2Logs: SessionLog[];
    mode: Mode;
  };

type Mode = "confidenceChange" | "confidenceUnchange" | "Agent";


export default function SessionReviewPanel({ session1Logs, session2Logs, mode }: Props) {
  const session1Map = useMemo(() => new Map(session1Logs.map((log) => [log.caseId, log])), [session1Logs]);
  const session2Map = useMemo(() => new Map(session2Logs.map((log) => [log.caseId, log])), [session2Logs]);

  const commonCaseIds = useMemo(() => {
      return [...session1Map.keys()].filter((id) => {
          const log1 = session1Map.get(id);
          const log2 = session2Map.get(id);
          if (!log1 || !log2) return false;

          if (mode === "confidenceChange") {
              return log1.confidence !== log2.confidence;
          }
          if (mode === "confidenceUnchange") {
            return Math.abs(log1.confidence - log2.confidence) < 0.01; 
          }
          return true;
      });
  }, [session1Map, session2Map, mode]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(commonCaseIds[0] ?? null);

  const c1 = session1Map.get(selectedCaseId!)?.confidence;
  const c2 = session2Map.get(selectedCaseId!)?.confidence;
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);

  const bothSameSideOf50 = c1 != null && c2 != null && !((c1 < 50 && c2 < 50) || (c1 > 50 && c2 > 50));

  const isConfidenceChanged = c1 !== c2;

  useEffect(() => {
    if (!selectedCaseId) return;
  
    const chats = session2Map.get(selectedCaseId)?.agentChats ?? [];
    setAgentChats(chats);
  }, [selectedCaseId, session2Map]);

    return commonCaseIds.length === 0 ? (
      <OuterLayout>
        <NoCaseMessage>There are no cases for this Question.</NoCaseMessage>
      </OuterLayout>
    ) : (
      <OuterLayout>
        <CaseListSection>
          {commonCaseIds.map((caseId) => (
            <CaseButton key={caseId} onClick={() => setSelectedCaseId(caseId)}>
              CASE {caseId.replace("case_", "")}
            </CaseButton>
          ))}
        </CaseListSection>
    
        <CaseSummarySection>
          <CaseSummary caseId={selectedCaseId!} />
        </CaseSummarySection>
          
          {/* */}
          {mode === "Agent" ? (
            <AgentChatSection>
              {agentChats.map((chat, index) => (
                <ChatBubble
                  key={index}
                  chat={chat}
                  replyTo={null}
                  liked={true}
                  shouldAnimate={false}
                  onLike={() => {}}
                  hideFromTag={false}
                  hideToTag={false}
                />
              ))}
          </AgentChatSection>
          ) : (
            <MyChoiceSection>
              <SessionChoicePanel
                title="Session 1"
                confidence={c1}
                durationMs={session1Map.get(selectedCaseId!)?.durationMs}
                confidenceChange={false}
                decisionChange={false}
              />
              <Arrow src="/assets/icons/down_icon.png" alt="Scroll down icon" />
              <SessionChoicePanel
                title="Session 2"
                confidence={c2}
                durationMs={session2Map.get(selectedCaseId!)?.durationMs}
                confidenceChange={isConfidenceChanged}
                decisionChange={bothSameSideOf50}
              />
            </MyChoiceSection>
        )}
      </OuterLayout>
    );
  }

const OuterLayout = styled.div`
    display: flex;
    height: 100%;
`;

const CaseListSection = styled.div`
  width: 80px;
  display: flex;
  flex-direction: column;
`;

const CaseButton = styled.button`
    ${textStyles.bubbleText()};
    padding: 0.6rem;
    border: none;
    background-color: ${colors.gray300};
    font-weight: 700;
    cursor: pointer;
    &:hover {
        background-color: #bbb;
    }
`;

const CaseSummarySection = styled.div`
  height: 100%;
  flex: 5;
  overflow-y: auto;
`;

const MyChoiceSection = styled.div`
  flex: 4;
  background-color: ${colors.gray200};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Arrow = styled.img`
  height: 28px;
`;

const NoCaseMessage = styled.div`
  ${textStyles.h2()};
  padding: 2rem;
  text-align: center;
  width: 100%;
  color: ${colors.gray600};
`;

export const AgentChatSection = styled.div`
  flex: 1;
  background-color: ${colors.gray200};
  display: flex;
  justify-content: center;
  align-items: center;
`;