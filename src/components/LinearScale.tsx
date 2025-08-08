import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface LinearScaleProps {
  index: number;
  scale: number;
  question: string;
  labels: {
    min: string;
    max: string;
  };
  value: number;
  onChange: (value: number) => void;
}

export default function LinearScale({ index, scale, question, labels, value, onChange }: LinearScaleProps) {
  return (
    <Container>
      <QuestionText>{index}. {question}</QuestionText>
      <ScaleRow>
        <Label $align="right">{labels.min}</Label>
        <ButtonGroup>
          {Array.from({ length: scale }, (_, i) => {
            const current = i + 1;
            return (
              <ScaleButton
                key={current}
                $isSelected={value === current}
                onClick={() => onChange(value === current ? 0 : current)}
              >
                {current}
              </ScaleButton>
            );
          })}
        </ButtonGroup>
        <Label $align="left">{labels.max}</Label>
      </ScaleRow>
    </Container>
  );
}

const Container = styled.div`
`;

const QuestionText = styled.p`
  ${textStyles.h4()};
  padding: 0px 0px 24px 0px;
`;

const ScaleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex: 2;
  justify-content: space-evenly; 
`;

const ScaleButton = styled.button<{ $isSelected: boolean }>`
 ${textStyles.h5({ align: "center" })};
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? colors.gray800 : colors.gray500)};
  background-color: ${({ $isSelected }) => ($isSelected ? colors.gray400 : colors.gray100)};
  color: ${({ $isSelected }) => ($isSelected ? colors.gray800 : colors.gray500)};
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
`;

const Label = styled.div<{ $align?: "left" | "center" | "right" }>`
  flex: 1;
  ${textStyles.body(colors.gray700)};
  text-align: ${({ $align = "center" }) => $align};
`;