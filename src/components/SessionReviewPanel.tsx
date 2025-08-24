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
import Spacer from "./Spacer";

type Props = {
    session1Logs: SessionLog[];
    session2Logs: SessionLog[];
    mode: Mode;
  };

type Mode = "confidenceChange" | "confidenceUnchange" | "Agent";

const agentIconMap: Record<string, string> = {
  stat: "/assets/icons/agent_veko_icon.png",
  rule: "/assets/icons/agent_lumi_icon.png",
  narr: "/assets/icons/agent_molu_icon.png",
};

function getAdjustedConfidence(confidence?: number): number {
  if (confidence === undefined) return 0;
  return confidence < 50 ? 100 - confidence : confidence;
}

export default function SessionReviewPanel({ session1Logs, session2Logs, mode }: Props) {
  const session1Map = useMemo(() => new Map(session1Logs.map((log) => [log.caseId, log])), [session1Logs]);
  const session2Map = useMemo(() => new Map(session2Logs.map((log) => [log.caseId, log])), [session2Logs]);

  const commonCaseIds = useMemo(() => {
    return [...session1Map.keys()]
      .filter((id) => {
        const log1 = session1Map.get(id);
        const log2 = session2Map.get(id);
        if (!log1 || !log2) return false;
  
        const diff = Math.abs(log1.confidence - log2.confidence);
  
        switch (mode) {
          case "confidenceChange":
            return diff >= 0.01;
          case "confidenceUnchange":
            return diff < 0.01;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const aNum = parseInt(a.replace("case_", ""));
        const bNum = parseInt(b.replace("case_", ""));
        return aNum - bNum;
      });
  }, [session1Map, session2Map, mode]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(commonCaseIds[0] ?? null);

  const c1 = session1Map.get(selectedCaseId!)?.confidence;
  const c2 = session2Map.get(selectedCaseId!)?.confidence;
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);

  const bothSameSideOf50 = c1 != null && c2 != null && !((c1 < 50 && c2 < 50) || (c1 > 50 && c2 > 50));

  const isConfidenceChanged = c1 !== c2;

  function getDecisionLetter(confidence?: number): "A" | "B" | "-" {
    if (confidence === undefined) return "-";
    return confidence < 50 ? "A" : "B";
  } 

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

        <CaseListSection $mode={mode}>
        {commonCaseIds.map((caseId) => {
          const log = session2Map.get(caseId);
          const from = log?.agentChats?.[0]?.from;
          const iconKey = from === "stat" || from === "rule" || from === "narr" ? from : "stat";
          const iconSrc = agentIconMap[iconKey];

          return (
            <CaseButton key={caseId} onClick={() => setSelectedCaseId(caseId)}>
              CASE {caseId.replace("case_", "")}
              {mode === "Agent" && (
                <AgentImage src={iconSrc} alt={"agent"} />
              )}
            </CaseButton>
          );
        })}
        </CaseListSection>
  
          {/* */}
          {mode === "Agent" ? (
            <AgentChatSection>
              <InfoRow>
                <InfoLabel>My decision : {getAdjustedConfidence(session2Map.get(selectedCaseId!)?.confidence)} 
                  ({getDecisionLetter(session2Map.get(selectedCaseId!)?.confidence)})</InfoLabel>
                <Spacer width="4px" />
                <InfoIcon src="/assets/icons/turntaking_icon.png" alt="time" />
                <InfoLabel>Turn count : {session2Map.get(selectedCaseId!)?.turntakingCount}</InfoLabel>
              </InfoRow>
              
              <Spacer height="20px" />
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
                title="Session 1 (without AI Agents)"
                confidence={c1}
                durationMs={session1Map.get(selectedCaseId!)?.durationMs}
                confidenceChange={false}
                decisionChange={false}
              />
              <Arrow src="/assets/icons/down_icon.png" alt="Scroll down icon" />
              <SessionChoicePanel
                title="Session 2 (with AI Agents)"
                confidence={c2}
                durationMs={session2Map.get(selectedCaseId!)?.durationMs}
                confidenceChange={isConfidenceChanged}
                decisionChange={bothSameSideOf50}
              />
            </MyChoiceSection>
        )}

        <CaseSummarySection>
          <CaseSummary caseId={selectedCaseId!} />
        </CaseSummarySection>
      </OuterLayout>
    );
  }

const OuterLayout = styled.div`
    display: flex;
    height: 100%;
`;

const CaseListSection = styled.div<{ $mode: string }>`
  width: ${({ $mode }) => ($mode === "Agent" ? "92px" : "80px")};
  display: flex;
  flex-direction: column;
`;

const CaseButton = styled.button`
    ${textStyles.bubbleText()};
    display: flex;
    justify-content: space-around;
    align-items: center;
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

const AgentImage = styled.img`
  height: 24px;
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
  padding: 10px 0px;
  flex-direction: column;
`;

const InfoIcon = styled.img`
    height: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width:100%;
  padding: 0px 20px;

`;

const InfoLabel = styled.p`
  ${textStyles.mentionTag()};

`;