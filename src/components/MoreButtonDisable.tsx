import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface MoreButtonProps {
    label: string;
    isabled?: boolean;
    onClick: () => void;
}

export default function MoreButtonDisable({label, onClick, isabled = false}: MoreButtonProps) {

    const handleClick = () => {
        if (!isabled) return; 
        if (onClick) {
            onClick();
        } else {
            console.warn("MoreButton: What should I do?");
        }
    };
    return (
        <Button $isabled={isabled} onClick={handleClick}>
          {label}
        </Button>
      );
}

const Button = styled.button<{ $isabled: boolean }>`
  ${({ }) => textStyles.buttonLabel()}
  width: 92%;
  height: 48px;
  color: ${({ $isabled }) => ($isabled ? colors.gray100 : colors.gray400)};
  border: 2.2px solid  ${({ $isabled }) => ($isabled ? colors.gray800 : colors.gray400)};
  border-radius: 50rem;
  background-color: ${colors.white};
  background-color: ${({ $isabled }) => ($isabled ? colors.gray800 : colors.gray200)};
  cursor: ${({ $isabled }) => ($isabled ? "pointer":"not-allowed")};
  transition: background-color 0.3s ease;
`;