// components/ReloadButton.tsx

import styled, { keyframes } from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

interface ReloadButtonProps {
  loading: boolean;
  onClick: () => void;
}

const ReloadButton: React.FC<ReloadButtonProps> = ({ loading, onClick }) => {
  return (
    <StyledButton onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <Spinner /> loading...
        </>
      ) : (
        "Reload"
      )}
    </StyledButton>
  );
};

export default ReloadButton;


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledButton = styled.button`
  ${textStyles.mentionTag()}
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  color: ${colors.gray700};
  border: 2.5px solid ${colors.gray700};
  border-radius: 3rem;
  width: 100px;
  cursor: pointer;
  transition: 0.2s all ease;

  &:hover:enabled {
    background-color: ${colors.gray600};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 3px solid ${colors.gray400};
  border-top: 3px solid ${colors.gray100};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 1s linear infinite;
`;