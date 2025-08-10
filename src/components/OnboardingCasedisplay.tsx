import styled from "styled-components";
import { CaseTitle, Body } from "../styles/textStyles";
import type OnboardingCase from "../models/OnboardingCase";
import { textStyles } from "../styles/textStyles";

type Props = {
  caseData: OnboardingCase;
  disabled: boolean;
  isActive: boolean;
};

export default function OnboardingCaseDisplay({ caseData, disabled, isActive }: Props) {
  return (
    <Container>
      {<Overlay $visible={disabled} />}
      <CaseTitle>{caseData.question}</CaseTitle>

      <Grid>
        <Option>
          <DescriptionContainer>
            <OptionLabel $align="right">A</OptionLabel>
            {isActive && <Body>{caseData.A.description}</Body>}
          </DescriptionContainer>
          <Image
            src={
              !isActive
                ? "/assets/images/onboarding_inactive_A.png"
                : caseData.A.image
            }
            alt="Option A"
          />
        </Option>

        <Option>
          <Image
            src={
              !isActive
                ? "/assets/images/onboarding_inactive_B.png"
                : caseData.B.image
            }
            alt="Option A"
          />
          <DescriptionContainer>
            <OptionLabel $align="left">B</OptionLabel>
            {isActive && <Body>{caseData.B.description}</Body>}
          </DescriptionContainer>
        </Option>
      </Grid>
    </Container>
  );
}

const Overlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$visible"
})<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(32, 32, 32, 0.7);
  z-index: 10;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

export const Container = styled.div`
  position: relative; 
  padding: 0.6rem;
  text-align: center;
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
`;

export const OptionLabel = styled.h3<{ $align?: "left" | "right" | "center" }>`
  ${({ $align = "left" }) => textStyles.h3({ $align })}
  flex: 1;
  padding: 0.5rem 1rem;
`;

export const Grid = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
`;

export const Option = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 10px;
  max-width: 600px;
`;

export const Image = styled.img`
  height: 18rem;
  object-fit: contain;
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 1.2rem;
`;

export const DefaultDescrition = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;