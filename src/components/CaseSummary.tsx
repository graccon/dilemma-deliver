// components/CaseSummary.tsx
import styled from "styled-components";
import { caseSummaries } from "../assets/data/caseSummaries";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

type Props = {
  caseId: string;
};

export default function CaseSummary({ caseId }: Props) {
  const summary = caseSummaries.find((c) => c.caseId === caseId);

  if (!summary) return null;

  return (
    <Container>
        <ImageWrapper>
            <ImageLabel>A</ImageLabel>
            <Image src={summary.imageA} alt="Option A" />
            <Image src={summary.imageB} alt="Option B" />
            <ImageLabel>B</ImageLabel>
        </ImageWrapper>
      <OptionText>A: {summary.descriptionA}</OptionText>
      <OptionText>B: {summary.descriptionB}</OptionText>
    </Container>
  );
}

const Container = styled.div`
  padding: 1rem;
  height: 100%;
  background-color: ${colors.white};
`;
const ImageWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  justify-content: center;
`;
const ImageLabel = styled.div`
  ${textStyles.h3()};
`;

const OptionText = styled.div`
    ${textStyles.body()};
    white-space: pre-line;
`;
const Image = styled.img`
  width: 7rem;
  height: auto;
  border-radius: 0.5rem;
  object-fit: contain;
  border: 1px solid #ccc;
`;
