import styled from "styled-components";
import colors from "../styles/colors";

interface StyledSliderProps {
    value: number;
    min: number;
    max: number;
  }

const StyledSlider = styled.input<StyledSliderProps>`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  outline: none;
  appearance: none;

  background: ${({ value, min, max }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${colors.gray600} 0%, ${colors.gray600} ${percentage}%, ${colors.gray300} ${percentage}%, ${colors.gray300} 100%)`;
  }};

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
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
      <Question>{question}</Question>
      <Content>
        <LabelGroup>
          <img src={leftImageSrc} alt="min icon" width={40} />
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
        </SliderWrapper>

        <LabelGroup>
          <img src={rightImageSrc} alt="max icon" width={40} />
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
  margin: 2rem 0;
`;

const Question = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
`;

const LabelText = styled.p`
  font-weight: bold;
  margin-top: 0.3rem;
  font-size: 0.9rem;
`;

const SliderWrapper = styled.div`
  flex: 1;
  padding: 0 1rem;
`;
