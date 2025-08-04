import styled, { keyframes } from "styled-components";
import colors from "../styles/colors";
import type { AgentChat } from "../services/loadAgentChats";
import NameTag from "./NameTag";
import { textStyles } from "../styles/textStyles";
import isPropValid from "@emotion/is-prop-valid";

interface ChatBubbleProps {
  chat: AgentChat;
  // idx: number; 
  replyTo?: AgentChat | null;
  liked: boolean;
  onLike: () => void;
  shouldAnimate?: boolean;
  mode?: ChatMode;
}
type ChatMode = "onboarding" | "default";
const agentAssets: Record<ChatMode, {
  label: Record<"stat" | "rule" | "narr" | "me", string>;
  color: Record<"stat" | "rule" | "narr" | "me", string>;
  icon: Record<"stat" | "rule" | "narr" | "me", string>;
}> = {
  onboarding: {
    label: {
      stat: "Agent 1",
      rule: "Agent 2",
      narr: "Agent 3",
      me: "ME"
    },
    color: {
      stat: colors.gray400,
      rule: colors.gray400,
      narr: colors.gray400,
      me: colors.gray400
    },
    icon: {
      stat: "/assets/icons/agent_agent1_icon.png",
      rule: "/assets/icons/agent_agent2_icon.png",
      narr: "/assets/icons/agent_agent3_icon.png",
      me: "/assets/icons/agent_me_icon.png"
    }
  },
  default: {
    label: {
      stat: "Veko",
      rule: "Lumi",
      narr: "Molu",
      me: "ME"
    },
    color: {
      stat: colors.highlightBlue,
      rule: colors.highlightRed,
      narr: colors.highlightGreen,
      me: colors.gray400
    },
    icon: {
      stat: "/assets/icons/agent_veko_icon.png",
      rule: "/assets/icons/agent_lumi_icon.png",
      narr: "/assets/icons/agent_molu_icon.png",
      me: "/assets/icons/agent_me_icon.png"
    }
  }
} as const;

export default function ChatBubble({ chat, replyTo, mode, liked=false, onLike, shouldAnimate = false  }: ChatBubbleProps) {
  const { message, type, from, to } = chat;
  const currentMode = mode ?? "default"; 
  const assets = agentAssets[currentMode];
  const fromKey = from.toLowerCase() as keyof typeof assets.label;
  const toKey = to.toLowerCase() as keyof typeof assets.label;

  const fromAgentName = assets.label[fromKey];
  const toAgentName = assets.label[toKey];

  const fromAgentColor = assets.color[fromKey];
  const toAgentColor = assets.color[toKey];

  const fromAgentIcon = assets.icon[fromKey];
  const toAgentIcon = assets.icon[toKey];


  return (
    <BubbleWrapper shouldAnimate={shouldAnimate}>
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
          {message}
        </Bubble>
        {!replyTo && (
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

const BubbleWrapperBase = styled.div`
  display: flex; 
  flex-direction: row; 
  margin-bottom: 12px;
  align-items: stretch;
`;

const BubbleWrapper = styled(BubbleWrapperBase).withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "shouldAnimate",
})<{ shouldAnimate?: boolean }>`
  animation: ${({ shouldAnimate }) => shouldAnimate && fadeInUp} 0.3s ease-out;
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

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;