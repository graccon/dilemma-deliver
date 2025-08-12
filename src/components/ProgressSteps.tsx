import styled from "styled-components";

const steps = ["survey", "onboarding", "session", "session", "survey"];

interface ProgressStepsProps {
  currentStep: number; 
}
export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <Wrapper>
      {steps.map((type, index) => {
        const isActive = index <= currentStep - 1;
        const iconSrc = `/assets/icons/step_${isActive ? "active" : "inactive"}_${type}_icon.png`;

        return (
          <StepIcon key={index}>
            <img src={iconSrc} alt={`${type} step`} width={44} height={44} />
          </StepIcon>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: center;
`;

const StepIcon = styled.div`
  
`;