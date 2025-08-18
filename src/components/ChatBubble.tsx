import styled, { keyframes } from "styled-components";
import colors from "../styles/colors";
import type { AgentChat } from "../services/loadAgentChats";
import { textStyles } from "../styles/textStyles";
import isPropValid from "@emotion/is-prop-valid";
import LikeButton from "./LikeButton";
import AgentTag from "./AgentTag";
import { useUserStore } from "../stores/useUserStore";

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
type AgentKey = "stat" | "rule" | "narr" | "me";

type AgentProfile = {
  label: string;
  color: string;
  icon: {
    default: string;
    speaking: string;
    listening: string;
  };
};

const agentProfiles: Record<ChatMode, Record<AgentKey, AgentProfile>> = {
  default: {
    stat: {
      label: "Veko",
      color: colors.highlightBlue,
      icon: {
        default: "/assets/icons/agent_veko_icon.png",
        speaking: "/assets/icons/agent_veko_speaking_icon.png",
        listening: "/assets/icons/agent_veko_listening_icon.png"
      }
    },
    rule: {
      label: "Lumi",
      color: colors.highlightRed,
      icon: {
        default: "/assets/icons/agent_lumi_icon.png",
        speaking: "/assets/icons/agent_lumi_speaking_icon.png",
        listening: "/assets/icons/agent_lumi_listening_icon.png"
      }
    },
    narr: {
      label: "Molu",
      color: colors.highlightGreen,
      icon: {
        default: "/assets/icons/agent_molu_icon.png",
        speaking: "/assets/icons/agent_molu_speaking_icon.png",
        listening: "/assets/icons/agent_molu_listening_icon.png"
      }
    },
    me: {
      label: "ME",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_me_icon.png",
        speaking: "/assets/icons/agent_me_icon.png",
        listening: "/assets/icons/agent_me_icon.png"
      }
    }
  },
  onboarding: {
    stat: {
      label: "Agent 1",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent1_icon.png",
        speaking: "/assets/icons/agent_agent1_speaking_icon.png",
        listening: "/assets/icons/agent_agent1_listening_icon.png"
      }
    },
    rule: {
      label: "Agent 2",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent2_icon.png",
        speaking: "/assets/icons/agent_agent2_speaking_icon.png",
        listening: "/assets/icons/agent_agent2_listening_icon.png"
      }
    },
    narr: {
      label: "Agent 3",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent3_icon.png",
        speaking: "/assets/icons/agent_agent3_speaking_icon.png",
        listening: "/assets/icons/agent_agent3_listening_icon.png"
      }
    },
    me: {
      label: "ME",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_me_icon.png",
        speaking: "/assets/icons/agent_me_icon.png",
        listening: "/assets/icons/agent_me_icon.png"
      }
    }
  },
  explain: {
    stat: {
      label: "Agent 1",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent1_icon.png",
        speaking: "/assets/icons/agent_agent1_speaking_icon.png",
        listening: "/assets/icons/agent_agent1_listening_icon.png"
      }
    },
    rule: {
      label: "Agent 2",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent2_icon.png",
        speaking: "/assets/icons/agent_agent2_speaking_icon.png",
        listening: "/assets/icons/agent_agent2_listening_icon.png"
      }
    },
    narr: {
      label: "Agent 3",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_agent3_icon.png",
        speaking: "/assets/icons/agent_agent3_speaking_icon.png",
        listening: "/assets/icons/agent_agent3_listening_icon.png"
      }
    },
    me: {
      label: "ME",
      color: colors.gray400,
      icon: {
        default: "/assets/icons/agent_me_icon.png",
        speaking: "/assets/icons/agent_me_icon.png",
        listening: "/assets/icons/agent_me_icon.png"
      }
    }
  },
};

function parseMessage(message: string): React.ReactNode[] {

  const normalized = message.replace(/\\n/g, '\n');
  const parts = normalized.split(/(\*\*.*?\*\*|@\w+|\n)/g);

  return parts.map((part, i) => {
    if (part === '\n') return <br key={`br-${i}`} />;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("@")) {
      return <MentionTag key={i}>@ {part.slice(1)}</MentionTag>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatBubble({ chat, replyTo, mode, liked=false, onLike, shouldAnimate = false, hideFromTag, hideToTag }: ChatBubbleProps) {
  const { message, from, to } = chat;
  const { group } = useUserStore.getState();

  const currentMode = mode ?? "default"; 
  const fromKey = (chat.type === "reply" ? to : from).toLowerCase() as AgentKey;
  const toKey = (chat.type === "reply" ? from : to).toLowerCase() as AgentKey;
    
  const isToMe = to.toLowerCase() === "me";
  
  const profileFrom = agentProfiles[currentMode][fromKey];
  const profileTo = agentProfiles[currentMode][toKey];

  const fromAgentIcon =
    toKey === "me"
      ? profileFrom.icon.default
      : profileFrom.icon.speaking;

  const toAgentIcon =
    toKey === "me"
      ? profileTo.icon.default
      : profileTo.icon.listening;

  const shouldShowLikeButton = !replyTo && currentMode !== "explain";
  const shouldShowToTag = !hideToTag && !isToMe;

  const groupNumber = Number(group);
  let formattedMessage = message;
  if (!isNaN(groupNumber) && groupNumber > 2 && isToMe && currentMode=="default") {
    formattedMessage = "@Me " + message;
  }

  return (
    <BubbleWrapper shouldAnimate={shouldAnimate} $isReply={!!replyTo} $isToMe={!!isToMe} $isTypeReply={chat.type === "reply"}>
      <Container>

      <AgentTagWrapper>
          <AgentTag show={!hideFromTag} name={profileFrom.label} icon={fromAgentIcon} color={profileFrom.color} />
      </AgentTagWrapper>

        <BubbleContainer>
          <Bubble $liked={liked} $isReply={!!replyTo}>
            {parseMessage(formattedMessage)}
      
          </Bubble>
          <LikeButton liked={liked} onClick={onLike} show={shouldShowLikeButton} />
        </BubbleContainer>
        <AgentTagWrapper>
          <AgentTag show={shouldShowToTag} name={profileTo.label} icon={toAgentIcon} color={profileTo.color} />
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
    isPropValid(prop) && prop !== "shouldAnimate" && prop !== "$isReply" && prop !== "$isToMe" && prop !== "$isTypeReply", 
})<{
  shouldAnimate?: boolean;
  $isReply?: boolean;
  $isToMe: boolean;
  $isTypeReply: boolean;
}>`
  animation: ${({ shouldAnimate }) => shouldAnimate && fadeInUp} 0.3s ease-out;
  margin-bottom: ${({ $isReply, $isToMe }) =>
    $isReply || $isToMe ? "5px" : "5px"};
  margin-top: ${({ $isTypeReply }) =>
    $isTypeReply ? "0px" : "10px"};
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

const MentionTag = styled.span`
  ${textStyles.mentionTag()}
  background-color: ${colors.gray400};
  padding: 3px 6px;
  border-radius: 1rem;
`;