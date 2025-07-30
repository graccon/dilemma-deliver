// components/FooterButton.tsx

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTimerLogStore } from "../stores/useTimerLogStore";

interface FooterButtonProps {
  label: string;
  to: string;
  disabled?: boolean;
}

export default function FooterButton({ label, to, disabled = false }: FooterButtonProps) {
  const navigate = useNavigate();
  const addLog = useTimerLogStore((state) => state.addLog);

  const handleClick = () => {
    if (!disabled) {
        addLog(window.location.pathname);
        navigate(to);
    }
  };

  return (
    <Button disabled={disabled} onClick={handleClick}>
      {label}
    </Button>
  );
}

const Button = styled.button<{ disabled: boolean }>`
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#1E90FF")};
  color: white;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
`;