import styled, { keyframes } from "styled-components";
import colors from "../styles/colors";
import type { AgentChat } from "../services/loadAgentChats";
import { textStyles } from "../styles/textStyles";
import isPropValid from "@emotion/is-prop-valid";
import LikeButton from "./LikeButton";
import AgentTag from "./AgentTag";

interface ChatBubbleProps {
  chat: AgentChat;
  // idx: number; 
  replyTo?: AgentChat | null;
  liked: boolean;
  onLike: () => void;
  shouldAnimate?: boolean;
  mode?: ChatMode;
  hideFromTag?: boolean;
  hideToTag?: boolean; 
}
type ChatMode = "onboarding" | "default" | "explain";

const onboardingMode = {
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
  }}

const agentAssets: Record<ChatMode, {
  label: Record<"stat" | "rule" | "narr" | "me", string>;
  color: Record<"stat" | "rule" | "narr" | "me", string>;
  icon: Record<"stat" | "rule" | "narr" | "me", string>;
}> = {
  explain: onboardingMode, 
  onboarding: onboardingMode,
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

const agentSpeakingIcons = {
  stat: "/assets/icons/agent_veko_speaking_icon.png",
  rule: "/assets/icons/agent_lumi_speaking_icon.png",
  narr: "/assets/icons/agent_molu_speaking_icon.png",
} as const;

const agentListeningIcons = {
  stat: "/assets/icons/agent_veko_listening_icon.png",
  rule: "/assets/icons/agent_lumi_listening_icon.png",
  narr: "/assets/icons/agent_molu_listening_icon.png",
} as const;

function parseMessage(message: string): React.ReactNode[] {
  const parts = message.split(/(\*\*.*?\*\*)/g); 
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatBubble({ chat, replyTo, mode, liked=false, onLike, shouldAnimate = false, hideFromTag, hideToTag }: ChatBubbleProps) {
  const { message, from, to } = chat;
  const currentMode = mode ?? "default"; 
  const assets = agentAssets[currentMode];
  const fromKey = (chat.type === "reply" ? to : from).toLowerCase() as keyof typeof assets.label;
  const toKey = (chat.type === "reply" ? from : to).toLowerCase() as keyof typeof assets.label;
  const isToMe = to.toLowerCase() === "me";
  const fromAgentName = assets.label[fromKey];
  const toAgentName = assets.label[toKey];

  const fromAgentColor = assets.color[fromKey];
  const toAgentColor = assets.color[toKey];

  const fromAgentIcon =
  toKey === "me"
    ? assets.icon[fromKey]
    : agentSpeakingIcons[fromKey as keyof typeof agentSpeakingIcons];

  const toAgentIcon =
  toKey === "me"
    ? assets.icon[toKey]
    : agentListeningIcons[toKey as keyof typeof agentListeningIcons];
    

  const shouldShowLikeButton = !replyTo && currentMode !== "explain";
  const shouldShowToTag = !hideToTag && !isToMe;

  return (
    <BubbleWrapper shouldAnimate={shouldAnimate} $isReply={!!replyTo} $isToMe={!!isToMe}>
      <Container>

      <AgentTagWrapper>
          <AgentTag show={!hideFromTag} name={fromAgentName} icon={fromAgentIcon} color={fromAgentColor} />
      </AgentTagWrapper>

        <BubbleContainer>
          <Bubble $liked={liked} $isReply={!!replyTo}>
            {parseMessage(message)}
          </Bubble>
          <LikeButton liked={liked} onClick={onLike} show={shouldShowLikeButton} />
        </BubbleContainer>
        <AgentTagWrapper>
          <AgentTag show={shouldShowToTag} name={toAgentName} icon={toAgentIcon} color={toAgentColor} />
        </AgentTagWrapper>
      </Container>
    </BubbleWrapper>
  );
}

const BubbleWrapperBase = styled.div`
  display: flex; 
  flex-direction: row; 
  width: 100%;
`;

const BubbleWrapper = styled(BubbleWrapperBase).withConfig({
  shouldForwardProp: (prop) =>
    isPropValid(prop) && prop !== "shouldAnimate" && prop !== "$isReply" && prop !== "$isToMe",
})<{
  shouldAnimate?: boolean;
  $isReply?: boolean;
  $isToMe: boolean;
}>`
  animation: ${({ shouldAnimate }) => shouldAnimate && fadeInUp} 0.3s ease-out;
  margin-bottom: ${({ $isReply, $isToMe }) =>
    $isReply || $isToMe ? "24px" : "0px"};
`;

const Container = styled.div`
  display: flex;  
  flex-direction: row;
  width: 100%;
  gap: 5px;
`;

const BubbleBase = styled.div`
  padding: 12px 20px;
  border-width: 2px;
  width: 300px;
  // min-height: 80px;
  white-space: pre-line;
  ${textStyles.bubbleText()}
`;

const Bubble = styled(BubbleBase)<{
  $liked: boolean;
  $isReply: boolean;
}>`
  background-color: ${({ $liked }) => ($liked ? colors.highlightYellow : colors.gray200)};
  border-radius: ${({ $isReply }) =>
    $isReply ? "1.5rem 1.5rem 0.3rem 1.5rem" : "1.5rem 1.5rem 1.5rem 0.3rem"};
  min-height: ${({ $isReply }) =>
    $isReply ? "40px" : "80px"};
`;

const BubbleContainer = styled.div`
  width: 100%;
  display: flex;    
  align-items: flex-end;
  position: relative; 
`;

const AgentTagWrapper = styled.div`
  display: flex;       
  width: 58px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: visible;
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