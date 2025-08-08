import styled from "styled-components";
import colors from "../styles/colors";

interface ProgressBarProps {
  progress: number; 
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <ProgressBarContainer>
      <ProgressFill $percent={progress} />
    </ProgressBarContainer>
  );
}

const ProgressBarContainer = styled.div`
  width: 90%;                    
  height: 70%;
  background-color: ${colors.gray400};
  border-radius: 1rem;
  overflow: hidden;  
`;

const ProgressFill = styled.div<{ $percent: number }>`
  position: relative;             
  top: 0;
  left: 0;
  height: 200%;
  width: ${({ $percent }) => `${$percent * 100}%`};
  background-color: ${colors.gray600};
  transition: width 0.3s ease-in-out;
`;