import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface Props {
  message: string;
  mode?: ChatMode;
}
type ChatMode = "system" | "default";

export default function UserChatBubble({ message, mode = "default" }: Props) {
  const displayedMessage =
    mode === "system" 
      ? "System can't decide yet"
      : message;

  return (
    <BubbleWrapper>
      <Bubble>
        <p>{displayedMessage}</p>
      </Bubble>
      <AgentIcon
        src={
          mode === "system"
            ? "/assets/icons/system_icon.png"
            : "/assets/icons/agent_me_icon.png"
        }
      />
    </BubbleWrapper>
  );
}
const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 80%;
`

const AgentIcon = styled.img`
  width: 48px;
  height: 48px;
  margin: 0px 8px;
`;

const Bubble = styled.div`
  align-self: flex-end;
  background-color: ${colors.white};
  padding: 12px 24px;
  border-radius: 36px 36px 4px 36px;
  margin-bottom: 24px;
  border: 2px solid ${colors.gray400};
  ${textStyles.bubbleText()};
`;