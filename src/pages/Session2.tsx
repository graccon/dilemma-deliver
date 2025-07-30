import { useEffect, useState } from "react";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import MoralCase from "../models/MoralCase";
import { resetShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCaseDisplay from "../components/MoralCaseDisplay";
import ConfidenceSlider from "../components/ConfidenceSilder";
import colors from "../styles/colors";

export default function Session2() {
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const total = 5;

  useEffect(() => {
    resetShuffledProblems();
  }, []);

  useEffect(() => {
    const caseData = getProblemByIndex(currentIndex);
    if (caseData) {
      const instance = new MoralCase(caseData);
      setCurrentCase(instance);
      setIsAnswered(false);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      window.location.href = "/postsurvey";
    }
  };

  return (
    <MainLayout
      footerButton={
        <FooterButton
          label={currentIndex < total - 1 ? "Next Question" : "Next Session"}
          onClick={handleNext}
          disabled={!isAnswered}
        />
      }
    > 
    <Layout>
      <ProblemContainer>
          <CaseContainer>
            {currentCase && (
              <MoralCaseDisplay
                caseData={currentCase}
                index={currentIndex}
                total={total}
              />
            )}
          </CaseContainer>
          <SliderContainer>
            <ConfidenceSlider
              key={currentIndex}
              initialValue={50}
              onChange={(value) => {
                console.log("confidence:", value);
                setIsAnswered(value !== 50);
              }}
            />
          </SliderContainer>
        </ProblemContainer>

          <ChatContainer>
            <p>야</p>
          </ChatContainer>
        </Layout>
      </MainLayout>
  );
}

export const Layout = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 3rem;
  width: 100wh; 
  gap: 1rem; 
`;

export const ChatContainer = styled.div`
  flex: 4;
  display: flex;
  background-color: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;


export const ProblemContainer = styled.div`
  flex: 10;
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