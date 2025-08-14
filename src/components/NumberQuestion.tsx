import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface NumberQuestionProps {
  index: number;
  question: string;
  value: number;
  onChange: (value: number) => void;
}

export default function NumberQuestion({ index, question, value, onChange }: NumberQuestionProps) {
  return (
    <Container>
      <QuestionText>{index}. {question}</QuestionText>
      <InputWrapper>
        <NumberInput
          type="number"
          value={!isNaN(value) ? String(value) : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Enter your age (e.g., 25)"
        />
      </InputWrapper>
    </Container>
  );
}

const Container = styled.div`

`;

const QuestionText = styled.p`
  ${textStyles.h4()};
  padding: 0px 0px 24px 0px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NumberInput = styled.input`
  ${textStyles.body()};
  padding: 10px 12px;
  border: 1px solid ${colors.gray400};
  border-radius: 8px;
  width: 100%;
  max-width: 200px;
  background-color: ${colors.white};
  outline: none;

  &:focus {
    border-color: ${colors.gray700};
  }
`;