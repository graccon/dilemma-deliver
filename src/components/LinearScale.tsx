import { useState } from "react";
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
}

export default function LinearScale({ index, scale, question, labels }: LinearScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Container>
      <QuestionText>{index}. {question}</QuestionText>
      <ScaleRow>
        <Label $align="right">{labels.min}</Label>
        <ButtonGroup>
          {Array.from({ length: scale }, (_, i) => {
            const value = i + 1;
            return (
              <ScaleButton
                key={value}
                isSelected={selected === value}
                onClick={() =>
                    setSelected(selected === value ? null : value)
                  }
              >
                {value}
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

const ScaleButton = styled.button<{ isSelected: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid ${({ isSelected }) => (isSelected ? colors.yellow : colors.gray400)};
  background-color: ${({ isSelected }) => (isSelected ? colors.yellow : colors.gray100)};
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
`;

const Label = styled.div<{ $align?: "left" | "center" | "right" }>`
  flex: 1;
  ${textStyles.body(colors.gray700)};
  text-align: ${({ $align = "center" }) => $align};
`;