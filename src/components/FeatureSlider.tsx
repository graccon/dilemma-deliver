import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface StyledSliderProps {
    value: number;
    min: number;
    max: number;
  }

const StyledSlider = styled.input<StyledSliderProps>`
  width: 100%;
  height: 10px;
  border-radius: 5px;
  outline: none;
  appearance: none;

  background: ${({ value, min, max }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${colors.gray600} 0%, ${colors.gray600} ${percentage}%, ${colors.gray300} ${percentage}%, ${colors.gray300} 100%)`;
  }};

  &::-webkit-slider-thumb {
    appearance: none;
    width: 17px;
    height: 17px;
    background: ${colors.gray600};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

interface FeatureSliderProps {
  question: string;
  value: number;
  onChange: (value: number) => void;
  labels: {
    min: string;
    max: string;
  };
  leftImageSrc: string;
  rightImageSrc: string;
  scale?: number;
}

export default function FeatureSlider({
  question,
  value,
  onChange,
  labels,
  leftImageSrc,
  rightImageSrc,
  scale = 10,
}: FeatureSliderProps) {
  return (
    <Wrapper>
      <QuestionText>{question}</QuestionText>
      <Content>
        <LabelGroup>
          <img src={leftImageSrc} alt="min icon" width={50} />
          <LabelText>{labels.min}</LabelText>
        </LabelGroup>

        <SliderWrapper>
          <StyledSlider
            type="range"
            min={0}
            max={scale}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <TickMarks count={scale}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} />
            ))}
          </TickMarks>
        </SliderWrapper>

        <LabelGroup>
          <img src={rightImageSrc} alt="max icon" width={50} />
          <LabelText>{labels.max}</LabelText>
        </LabelGroup>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5rem 0;
`;

const QuestionText = styled.h3`
  ${textStyles.h4()};
  padding: 0px 0px 5px 0px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 700px;
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
`;

const LabelText = styled.p`
  ${textStyles.body(colors.gray700)};
  margin-top: 0.3rem;
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 500px;
  padding: 0 1rem;
`;

const TickMarks = styled.div<{ count: number }>`
  position: absolute;
  width: 91%;
  top: 22px;
  left: 0;
  right: 0;
  height: 4px;
  pointer-events: none;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  
  div {
    width: 3px;
    height: 8px;
    background: ${colors.gray500};
    border-radius: 15px;
  }
`;
