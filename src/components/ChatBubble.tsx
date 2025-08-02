import styled from "styled-components";
import colors from "../styles/colors";
import type { AgentChat } from "../services/loadAgentChats";
import NameTag from "./NameTag";
import { textStyles } from "../styles/textStyles";
import isPropValid from "@emotion/is-prop-valid";

interface ChatBubbleProps {
  chat: AgentChat;
  idx: number;
  replyTo?: AgentChat | null;
  liked: boolean;
  onLike: () => void;
}

const agentLabel = {
  stat: "Veko",
  rule: "Lumi",
  narr: "Molu",
  me: "ME"
} as const;

const agentColor = {
  stat: colors.highlightBlue,
  rule: colors.highlightRed,
  narr: colors.highlightGreen,
  me: colors.gray400,
} as const;

const agentIcon = {
  stat: "/assets/icons/agent_veko_icon.png",
  rule: "/assets/icons/agent_lumi_icon.png",
  narr: "/assets/icons/agent_molu_icon.png",
  me: "/assets/icons/agent_me_icon.png"
} as const;

export default function ChatBubble({ chat, idx, replyTo, liked=false, onLike }: ChatBubbleProps) {
  const { message, type, from, to } = chat;
  const fromKey = from.toLowerCase() as keyof typeof agentLabel;
  const toKey = to.toLowerCase() as keyof typeof agentLabel;

  const fromAgentName = agentLabel[fromKey];
  const toAgentName = agentLabel[toKey];

  const fromAgentColor = agentColor[fromKey];
  const toAgentColor = agentColor[toKey];

  const fromAgentIcon = agentIcon[fromKey];
  const toAgentIcon = agentIcon[toKey];

  return (
    <BubbleWrapper>
       {type === "reply" && <IsReplyWrapper />}
      <Container>
      <AgentName>
        <AgentTagWrapper>
          <AgentIcon src={fromAgentIcon} alt={fromAgentName} />
          <NameTag name={fromAgentName} color={fromAgentColor} />
        </AgentTagWrapper>

        {type === "reply" ? (
          <ReplyLabel>replied to</ReplyLabel>
        ) : (
          <ToIcon src="/assets/icons/to_icon.png" />
        )}
        <AgentTagWrapper>
          <AgentIcon src={toAgentIcon} alt={toAgentName} />
          <NameTag name={toAgentName} color={toAgentColor} />
        </AgentTagWrapper>
      </AgentName>

      <BubbleContainer>
        <Bubble liked={liked}>
          {replyTo && (
            <ReplyReference title={replyTo.message}>
            {replyTo.message.length > 50
              ? `${replyTo.message.slice(0, 40)}...`
              : replyTo.message}
          </ReplyReference>
          )}
          {idx} - {message}
        </Bubble>
        {replyTo && (
          <GoodIcon
            src={liked ? "/assets/icons/good_active_icon.png" : "/assets/icons/good_inactive_icon.png"}
            onClick={onLike}
          />
        )}
      </BubbleContainer>
      </Container>
    </BubbleWrapper>
  );
}

const ReplyLabel = styled.span`
  ${textStyles.replyLabel()}
`;

const BubbleWrapper = styled.div`
  display: flex; 
  flex-direction: row; 
  margin-bottom: 12px;
  align-items: stretch;
`;

const Container = styled.div`
  flex: 54; 
  display: flex;  
  flex-direction: column;
`;

const IsReplyWrapper = styled.div`
  flex: 1; 
  margin-right: 12px;
  background-color: ${colors.gray300};
  border-radius: 4px;
  height: auto;
`;

const AgentName = styled.div`
  display: flex;         
  align-items: center;
  gap: 10px;          
  padding: 0px 10px;
  margin-bottom: 3px;
`;

const BubbleBase = styled.div`
  padding: 8px 16px;
  border-radius: 12px 12px;
  border-width: 2px;
  ${textStyles.bubbleText()}
`;

const Bubble = styled(BubbleBase).withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "liked",
})<{ liked: boolean }>`
  background-color: ${({ liked }) => (liked ? colors.highlightYellow : colors.white)};
  border-style: solid;
  border-color: ${({ liked }) => (liked ? colors.gray800 : colors.gray300)};
`;

const BubbleContainer = styled.div`
  display: flex;    
  align-items: flex-end 
`;

const ReplyReference = styled.div`
  border-bottom: 1.2px solid rgba(128, 128, 128, 0.15);
  padding: 2px 2px 5px 2px;
  margin-bottom: 6px;
  ${textStyles.replyReferenceText()};
`;

const AgentTagWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const ToIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const AgentIcon = styled.img`
  width: 26px;
  height: 26px;
`;

const GoodIcon = styled.img`
  width: 28px;
  height: 28px;
`;