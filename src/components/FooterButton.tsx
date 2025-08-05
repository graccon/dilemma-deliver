import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTimerLogStore } from "../stores/useTimerLogStore";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";
import nextIcon from "/assets/icons/next_icon.png";
import nextDisabledIcon from "/assets/icons/next_disabled_icon.png";

interface FooterButtonProps {
  label: string;
  to?: string;
  disabled?: boolean;
  onClick?: () => void; 
}

export default function FooterButton({ label, to, onClick, disabled = false }: FooterButtonProps) {
  const navigate = useNavigate();
  const addLog = useTimerLogStore((state) => state.addLog);

  const handleClick = () => {
    if (disabled) return;

    addLog(window.location.pathname);

    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      console.warn("FooterButton: where do I go?");
    }
  };

  return (
    <Button disabled={disabled} onClick={handleClick} color={colors.white}>
      <Label>{label}</Label>
      <Icon src={disabled ? nextDisabledIcon : nextIcon} alt="Next" />
    </Button>
  );
}

const Button = styled.button<{ disabled: boolean, color?: string }>`
  ${({ color, disabled }) =>
    textStyles.buttonLabel({
      color: disabled ? colors.gray600 : color ?? colors.white,
    })}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 12rem;
  height: 3rem;
  padding: 0 1rem;
  border: 2px solid ${({ disabled }) => (disabled ? colors.gray600 : colors.white )};
  border-radius: 50rem;
  background-color: ${colors.gray800};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const Label = styled.span`
  flex: 1;         
  text-align: center;    
`;