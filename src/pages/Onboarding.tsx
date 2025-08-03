import { useEffect, useState } from "react";
import colors from "../styles/colors";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import { useOnboardingLogic } from "../services/useOnboardingLogic";
import MoreButton from "../components/MoreButton";
import OnboardingCaseDisplay from "../components/OnboardingCasedisplay";
import ConfidenceSliderInOnboarding from "../components/ConfidenceSilderInOnboarding";

export default function Onboarding() {
  const {
    caseData,
    missionStep,
    advanceMission,
  } = useOnboardingLogic();

  const [isAnimating, setIsAnimating] = useState(true);
        useEffect(() => {
          setIsAnimating(true);
          const timer = setTimeout(() => {
              setIsAnimating(false);
          }, 300); 
          return () => clearTimeout(timer);
    }, []);

  return (
    <MainLayout
      footerButton={<FooterButton label="Next" to="/session1" disabled={missionStep < 5} />}
    >
      <Layout>
        <ProblemContainer>
          <CaseContainer>
            {caseData && (
              <OnboardingCaseDisplay disabled={missionStep < 2} caseData={caseData} />
            )}
          </CaseContainer>
          <SliderContainer>
            <ConfidenceSliderInOnboarding 
              initialValue={50}
              onChange={(value) => {
                console.log("confidence:", value);
              }}
              disabled={missionStep < 2}
            />
          </SliderContainer>
        </ProblemContainer>
       <ChatContainer>
          <ChatListWrapper $isAnimating={isAnimating}>
            // 채팅
          </ChatListWrapper>
          <MoreButtonWrapper>
          <MoreButton
                label={"I can't decide yet"}
                onClick={() => {
                  if (missionStep === 1) {
                    advanceMission();
                  } else {
                    console.log("다음 미션 처리 예정");
                  }
                }}
              />
      </MoreButtonWrapper>
       </ChatContainer>
      </Layout>
    </MainLayout>
  );
}

export const Layout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100wh; 
  gap: 1rem; 
`;

export const ChatContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 78vh;
  padding: 10px;
`;

export const ProblemContainer = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  height: 78vh;
`;

export const CaseContainer = styled.div`
  flex: 10;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto; 
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const SliderContainer = styled.div`
  flex: 2;
  width: 100%;
  margin: 0 auto;
  border-radius: 1rem;
  background-color: ${colors.white};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const MoreButtonWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding-top: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChatListWrapper = styled.div<{ $isAnimating: boolean }>`
  flex: 10;
  padding: 12px 12px;
  overflow-y: ${({ $isAnimating }) => ($isAnimating ? "hidden" : "auto")};
  scrollbar-width: ${({ $isAnimating }) => ($isAnimating ? "none" : "auto")};

  &::-webkit-scrollbar {
    display: ${({ $isAnimating }) => ($isAnimating ? "none" : "block")};
  }
`;