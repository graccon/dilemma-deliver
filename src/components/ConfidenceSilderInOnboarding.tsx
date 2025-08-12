import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { SecondTitle, Span } from "../styles/textStyles";
import colors from "../styles/colors"; 
import { calculateConfidence, getSliderBackground } from "./ConfidenceSilder";

const glow = keyframes`
  0% {
    box-shadow: 0 0 0px rgba(255, 215, 0, 0.5), 
                0 0 5px rgba(255, 215, 0, 0.4), 
                0 0 10px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.9), 
                0 0 25px rgba(255, 215, 0, 0.7), 
                0 0 35px rgba(255, 215, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 
                0 0 10px rgba(255, 215, 0, 0.4), 
                0 0 20px rgba(255, 215, 0, 0.3);
  }
`;

interface ConfidenceSliderInOnboardingProps {
    initialValue?: number;
    onChange?: (value: number) => void;
    disabled: boolean;
    highlight: boolean; 
}
const ConfidenceSliderInOnboarding: React.FC<ConfidenceSliderInOnboardingProps> = ({
  initialValue = 50,
  onChange,
  disabled,
  highlight
}) => {

  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  const shouldHighlight = highlight && !disabled;

  return (
    <Container $shouldHighlight={shouldHighlight} >
        {disabled && <Overlay />}
        <SliderWrapper>
            <LabelContainer>
              <SecondTitle $align="">A</SecondTitle>
                <IconBox>
                    <StayIcon src="/assets/icons/stay_onboarding_icon.png" alt="stay icon" />
                </IconBox>               
                <SecondTitle $align="">stay</SecondTitle>
            </LabelContainer>
            
            <SliderBox>
                <RangeWrapper>
                    <ValueWrapper>
                        <Span size="1rem">your decision confidence :</Span>
                        <Span size="1.3rem"> {calculateConfidence(value)}%</Span>   
                    </ValueWrapper>    
          
                    <SilderWrapper>
                        <StyledRangeWrapper>
                            <StyledRange
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={value}
                                    onChange={handleChange}
                                    $bg={getSliderBackground(value)}
                            />
                        </StyledRangeWrapper>
                        <DotTrack>
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                        </DotTrack>
                    </SilderWrapper>
                
                    <RangeMarks>
                        <span>100 %</span>
                        <span>50 %</span>
                        <span>100 %</span>
                    </RangeMarks>
                </RangeWrapper>
            </SliderBox>

            <LabelContainer>
              <SecondTitle $align="center">B</SecondTitle>
                <IconBox>
                    <StayIcon src="/assets/icons/swerve_onboarding_icon.png" alt="swerve icon" />
                </IconBox>
                <SecondTitle $align="center">swerve</SecondTitle>
            </LabelContainer>
        </SliderWrapper>
    </Container>
  );
};

export default ConfidenceSliderInOnboarding;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(32, 32, 32, 0.7);
  z-index: 10;
  pointer-events: auto;
  transition: opacity 0.5s ease;
`;

export const Container = styled.div<{$shouldHighlight: boolean}>`
  position: relative; 
  text-align: center;
  height: 100%;
  overflow: hidden;
  padding: 0rem;
  border-radius: 1rem;
  height: 100%;

  ${({ $shouldHighlight }) =>
    $shouldHighlight &&
    css`
      border: 1px solid ${colors.yellow};
      animation: ${glow} 1.5s infinite alternate;
    `}
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1024px; 
  width: 100%;
  margin: 0 auto;
  height: 100%;
  justify-content: center;
  align-items: center;
`;


const LabelContainer = styled.div`
  width: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  gap: 2px;
`;

const IconBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StayIcon = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const SliderBox = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  margin: 0px 20px; 
  justify-content: space-between;
  @media (max-width: 960px) {
        width: 100%;
    }
`;

const SilderWrapper = styled.div`
    padding: 0.5rem 0.4rem 1.2rem 0.4rem;
`;

const RangeWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const ValueWrapper = styled.div`
  display: flex;
  justify-content: center;  
  align-items: center;       
  gap: 0.3rem;           
`;

const StyledRangeWrapper = styled.div`
    width: 98.5%;
    margin: 0 auto;
`;

const StyledRange = styled.input<{ $bg: string }>`
  width: 100%;
  height: 100%;
  appearance: none;
  height: 12px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  transition: background 0.3s ease;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    background: ${colors.gray500};
    border-radius: 20px;
    cursor: pointer;
    border: none;
  }
`;

const DotTrack = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  top: 3px; 
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
`;

const Dot = styled.div`
  width: 4px;
  height: 10px;
  background-color: ${colors.gray300};
  border-radius: 5px;
`;

const RangeMarks = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.gray500};
  padding: 30px, 20px;
`;