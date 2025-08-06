import styled from "styled-components";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { textStyles } from "../styles/textStyles";

interface MoreButtonProps {
    label: string;
    to?: string;
    disabled?: boolean;
    onClick: () => void;
}

export default function MoreButton({label, to, onClick, disabled = false}: MoreButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return;
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            console.warn("MoreButton: What should I do?");
        }
    };
    return (
        <Button disabled={disabled} onClick={handleClick}>
          {label}
        </Button>
      );
}

const Button = styled.button<{ disabled: boolean }>`
  ${({ }) => textStyles.buttonLabel()}
  width: 92%;
  height: 94%;
  color: ${({ disabled }) => (disabled ? colors.white : colors.gray800)};
  border: 2.2px solid  ${({ disabled }) => (disabled ? colors.white : colors.gray800)};
  border-radius: 50rem;
  background-color: ${colors.white};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
`;