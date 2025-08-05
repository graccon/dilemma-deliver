// components/ScrollDownHint.tsx
import styled, { keyframes } from "styled-components";
import { textStyles } from "../styles/textStyles"
import colors from "../styles/colors";

export default function ScrollDownHint() {
  return (
    <Wrapper>
        <Text>Scroll to continue</Text>
      <Arrow src="/assets/icons/scroll_down_icon.png" alt="Scroll down icon" />
    </Wrapper>
  );
}

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: ${float} 2s infinite;
  z-index: 10;
`;

const Arrow = styled.img`
  width: 1.5rem;
  height: 1.2rem;
`;

const Text = styled.div`
  ${({ }) => textStyles.h5({ color: colors.gray600})}
  margin-bottom: 0.2rem;
  font-weight: bold;
`;