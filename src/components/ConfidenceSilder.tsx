import React, { useState } from "react";
import styled from "styled-components";
import { SecondTitle, Span } from "../styles/textStyles";
import colors from "../styles/colors"; 

interface ConfidenceSliderProps {
  initialValue?: number;
  onChange?: (value: number) => void;
  onTouchEnd?: (value: number) => void;
}

export function calculateConfidence(value: number): number {
  return value === 50 ? 50 : value < 50 ? 100 - value : value;
}

export function getSliderBackground(value: number): string {
  if (value < 50) {
    return `linear-gradient(to right,
      ${colors.gray300} ${value}%,
      ${colors.gray500} ${value}% 50%,
      ${colors.gray300} 50% 100%)`;
  } else {
    return `linear-gradient(to right,
      ${colors.gray300} 0% 50%,
      ${colors.gray500} 50% ${value}%,
      ${colors.gray300} ${value}% 100%)`;
  }
}

const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  initialValue = 50,
  onChange,
  onTouchEnd,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Container>
        <SliderWrapper>
            <LabelContainer>
                <IconBox>
                    <StayIcon src="/assets/icons/stay_icon.png" alt="stay icon" />
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
                                    onTouchEnd={() => {
                                      onTouchEnd?.(value);
                                    }}
                                    // onPointerDown={() => {
                                    //   console.log("🖱️ mouse up");
                                    //   onPointerDown?.(value);
                                    // }}
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
                <IconBox>
                    <StayIcon src="/assets/icons/swerve_icon.png" alt="swerve icon" />
                </IconBox>
                <SecondTitle $align="center">swerve</SecondTitle>
            </LabelContainer>
        </SliderWrapper>
    </Container>
  );
};

export default ConfidenceSlider;

export const Container = styled.div`
    padding: 1rem;
    border-radius: 1rem;
    height: 100%;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1024px; 
  width: 100%;
  margin: 0 auto;
  height: 100%;
  justify-content: center;  
`;

const ValueWrapper = styled.div`
  display: flex;
  justify-content: center;  
  align-items: center;       
  gap: 0.3rem;           
`;

const LabelContainer = styled.div`
  width: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
`;

const SliderBox = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  margin: 0px 10px; 
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

const RangeMarks = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.gray500};
  padding: 30px, 20px;
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