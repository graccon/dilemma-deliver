import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface LimitReachedModalProps {
    onRestart: () => void;
  }
  
export default function LimitReachedModal({ onRestart }: LimitReachedModalProps) {
return (
    <ModalOverlay>
    <ModalBox>
        <p>You’ve reached the 15-minute limit for this case. Restart the timer?</p>
        <ModalButtons>
        <button onClick={onRestart}>Restart</button>
        </ModalButtons>
    </ModalBox>
    </ModalOverlay>
);
}

const ModalOverlay = styled.div`
    ${textStyles.h4()}
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  max-width: 420px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;

  button {
    ${textStyles.buttonLabel()};
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: ${colors.gray300};
  }
`;