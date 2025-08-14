import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";

interface RadioQuestionProps {
    index: number;
    question: string;
    options: string[];
    value: string;
    onChange: (selectedIndex: string) => void;
  }
  
  export default function RadioQuestion({ index, question, options, value, onChange }: RadioQuestionProps) {
    return (
      <Container>
        <QuestionText>{index}.{question}</QuestionText>
        <OptionsWrapper>
            {options.map((option, idx) => (
            <OptionLabel key={idx}>
            <RadioInput
              type="radio"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <CustomRadio checked={value === option} />
            <OptionText>{option}</OptionText>
          </OptionLabel>
            ))}
        </OptionsWrapper>
      </Container>
    );
  }

const Container = styled.div`

`;

const QuestionText = styled.p`
  ${textStyles.h4()};
  padding: 0px 0px 24px 0px;
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  position: relative;
  padding-left: 8px;
`;

const RadioInput = styled.input`
  display: none;
`;

const CustomRadio = styled.span<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ checked }) => (checked ? colors.gray700 : colors.gray400)};
  background-color: ${({ checked }) => (checked ? colors.gray600 : colors.gray200)};
  transition: background-color 0.2s;
`;

const OptionText = styled.span`
  ${textStyles.body()};
`;