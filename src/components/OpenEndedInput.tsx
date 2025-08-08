// components/OpenEndedInput.tsx
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

type Props = {
  value: string;
  onChange: (value: string) => void;
  question?: string;
};

export default function OpenEndedInput({
  value,
  onChange,
  question = "Please explain why your confidence changed (or didn’t change) between sessions.",
}: Props) {
  return (
    <OpenEndedSection>
      <QuestionLabel>{question}</QuestionLabel>
      <TextArea
        placeholder="Write your thoughts here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </OpenEndedSection>
  );
}

const OpenEndedSection = styled.div`
  margin-top: 0.5rem;
  padding: 1rem 2rem;
  background-color: ${colors.gray100};
  border-radius: 0.8rem;
`;

const QuestionLabel = styled.h2`
  ${textStyles.h2()};
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray300};
  font-size: 1rem;
  line-height: 1.5;
  font-family: inherit;
`;