import styled from "styled-components";
import { CaseTitle, Body } from "../styles/textStyles";
import type OnboardingCase from "../models/OnboardingCase";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

type Props = {
  caseData: OnboardingCase;
  isActive: boolean;
  missionStep: number;
};


export default function OnboardingCaseDisplay({ caseData, missionStep, isActive }: Props) {
  const disabled =  missionStep < 2;
  const isStepInRange = [5, 6, 7].includes(missionStep);
  const imagePathMap: Record<"A" | "B", Record<number, string>> = {
    A: {
      1: "/assets/images/default_A.png",
      2: "/assets/images/mode_A.png",
      3: "/assets/images/onboarding_inactive_A.png",
      4: "/assets/images/onboarding_inactive_A.png",
      8: "/assets/images/case_A.png",
    },
    B: {
      1: "/assets/images/default_B.png",
      2: "/assets/images/mode_B.png",
      3: "/assets/images/onboarding_inactive_B.png",
      4: "/assets/images/onboarding_inactive_B.png",
      8: "/assets/images/case_B.png",
    },
  };
  
  function getImageSrc(option: "A" | "B", missionStep: number, caseData: OnboardingCase): string {
    if (isStepInRange) {
      return option === "A" ? caseData.A.image : caseData.B.image;
    }
    return imagePathMap[option][missionStep] ?? "";
  }

  function getCaseTitle(missionStep: number, caseData: OnboardingCase): string {
    switch (missionStep) {
      case 1:
        return "Onboarding";
      case 2:
        return "Who’s Talking to Whom?";
      case 3:
        return "Mission 1: Adjust the slider";
      case 4:
        return "Mission 2";
      case 8:
        return "What should the self-driving car do?";
      default:
        return "Mission 2: " + caseData.question;
    }
  }

  return (
    <Container>
      {<Overlay $visible={disabled} />}
      <TittleWrapper>
        <CaseTitle>{getCaseTitle(missionStep, caseData)}</CaseTitle>
        {isStepInRange && <SubTitle>Choose A or B, then like the speech bubble you find most convincing.</SubTitle>}
      </TittleWrapper>

      <Grid>
        <Option>
          <DescriptionContainer>
            {isActive && <OptionLabel $align="right">A</OptionLabel>}
            {isStepInRange && <Body>{caseData.A.description}</Body>}
          </DescriptionContainer>
          <Image
            src={getImageSrc("A", missionStep, caseData)}
            alt="Option A"
          />
        </Option>

        <Option>
        <Image
            src={getImageSrc("B", missionStep, caseData)}
            alt="Option B"
          />
          <DescriptionContainer>
            {isActive &&<OptionLabel $align="left">B</OptionLabel>}
            {isStepInRange && <Body>{caseData.B.description}</Body>}
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
  background-color:  rgba(77, 77, 77, 0.80);
  z-index: 10;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s ease;
`;

export const Container = styled.div`
  position: relative; 
  padding: 0.6rem;
  text-align: center;
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
`;

export const TittleWrapper = styled.div`
  width: 100%;
  padding: 16px 0px 0px 0px;
`;

export const SubTitle = styled.p`
  ${textStyles.li({ color: colors.gray600, align: "center" })};
  margin: 6px 0px;
`;

export const OptionLabel = styled.h3<{ $align?: "left" | "right" | "center" }>`
  ${({ $align = "left" }) => textStyles.OnboardingCaseLabel({ $align })}
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