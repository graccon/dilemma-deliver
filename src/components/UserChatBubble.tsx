import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface Props {
  message: string;
}

export default function UserChatBubble({ message }: Props) {
  return (
    <Bubble>
      <p>{message}</p>
    </Bubble>
  );
}

const Bubble = styled.div`
  align-self: flex-end;
  background-color: ${colors.gray200};
  padding: 12px 24px;
  border-radius: 36px 36px 4px 36px;
  max-width: 60%;
  ${textStyles.bubbleText()};
`;