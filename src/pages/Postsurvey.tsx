import { useState } from "react";
import { useSessionLogStore } from "../stores/sessionLogStore";
import FooterButton from "../components/FooterButton"
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import SessionReviewPanel from "../components/SessionReviewPanel";
import OpenEndedInput from "../components/OpenEndedInput";
import Spacer from "../components/Spacer";
import colors from "../styles/colors";
import { surveyFeaturePreference } from "../assets/data/surveyItems"
import FeatureSlider from "../components/FeatureSlider";

// const Divider = styled.hr`
//   margin: 2rem auto; 
//   width: 100%;
//   border: 1px solid ${colors.gray300};
// `;

export default function Postsurvey() {
  const logs = useSessionLogStore((state) => state.logs);

  const session1Logs = logs.filter((log) => log.sessionId === "session1");
  const session2Logs = logs.filter((log) => log.sessionId === "session2");

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const confidenceChangedLogs = session1Logs.filter((log1) => {
    const log2 = session2Logs.find((log2) => log2.caseId === log1.caseId);
    return log2 && log1.confidence !== log2.confidence;
  });
  
  const confidenceUnchangedLogs = session1Logs.filter((log1) => {
    const log2 = session2Logs.find((log2) => log2.caseId === log1.caseId);
    return log2 && log1.confidence === log2.confidence;
  });

  let questionNumber = 1;

  const [values, setValues] = useState<number[]>(surveyFeaturePreference.map(() => 0));

  const handleSliderChange = (index: number, newValue: number) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = newValue;
      return newValues;
    });
  };

  return (
    <MainLayout
            currentStep={4}
            footerButton={
              <FooterButton label="Next Sesstion" to="/thankyou" disabled={false} />
            }
          >
      <Container>
        <PageTitle>Post-survey page</PageTitle>
        <Description>Thank you for completing the survey. Your responses are invaluable to our research.
          <br/>There are 3 open-ended questions and 11 multiple-choice questions.
        </Description>
        
        {/* Question 1: Only render if there are changed logs */}
        {confidenceChangedLogs.length > 0 && (
          <>
          <QuestionTitle>Question {questionNumber++}. Below are the cases where your choice changed.</QuestionTitle>
          <ReviewPanelWrapper>
            <SessionReviewPanel session1Logs={session1Logs} session2Logs={session2Logs} mode="confidenceChange"/>
          </ReviewPanelWrapper>
          <OpenEndedInputWrapper>
            <OpenEndedInput 
              value={answer1} 
              onChange={setAnswer1} 
              question="Please explain why your confidence changed between sessions."
            />
          </OpenEndedInputWrapper>
          <Spacer height="50px" />
          </>
        )}

        {/* Question 2: Only render if there are unchanged logs */}
        {confidenceUnchangedLogs.length > 0 && (
          <>
            <QuestionTitle>Question {questionNumber++}. Below are the cases where your choice unchanged.</QuestionTitle>
            <ReviewPanelWrapper>
              <SessionReviewPanel session1Logs={session1Logs} session2Logs={session2Logs} mode="confidenceUnchange"/>
            </ReviewPanelWrapper>
            <OpenEndedInputWrapper>
              <OpenEndedInput 
                value={answer2} 
                onChange={setAnswer2} 
                question="Please explain why your confidence unchanged between sessions."
              />
            </OpenEndedInputWrapper>
            <Spacer height="50px" />
            </>
        )}

        {/* Question 3: Only render if there are changed logs */}
          <QuestionTitle>Question {questionNumber++}. Below are the cases where your choice changed.</QuestionTitle>
          <ReviewPanelWrapper>
            <SessionReviewPanel session1Logs={session1Logs} session2Logs={session2Logs} mode="Agent"/>
          </ReviewPanelWrapper>
          <OpenEndedInputWrapper>
            <OpenEndedInput 
              value={answer3} 
              onChange={setAnswer3} 
              question="Please explain why you chose this agent dialogue."
            />
          </OpenEndedInputWrapper>
          <Spacer height="50px" />

          <StickyTitle>
            Instruction: The following sliders ask you to indicate how much weight you place on each factor in your decision-making.
            <MainTitle>Evaluate Feature Importance</MainTitle>
          </StickyTitle>
          <SurveyContainer>
            {surveyFeaturePreference.map((item, idx) => (
                <FeatureSlider
                  key={item.id}
                  question={item.question}
                  value={values[idx]}
                  onChange={(v) => handleSliderChange(idx, v)}
                  scale={50}
                  labels={{
                    min: item.labels?.min ?? "중요하지 않음",
                    max: item.labels?.max ?? "매우 중요함"
                  }}
                  leftImageSrc= {item.labelImages!.min}
                  rightImageSrc= {item.labelImages!.max}
                /> 
                
            ))}
          </SurveyContainer>
          {/* <Divider /> */}
    </Container>
    </MainLayout>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
  margin: 0 auto;
  max-width: 1024px;
  overflow-y: auto;
  height: 78vh;

`;

export const ReviewPanelWrapper = styled.div`
  width: 90%;
  margin: 0px auto;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0
`;
export const OpenEndedInputWrapper = styled.div`
  width: 97%;
  margin: 0px auto;
`;

export const Description = styled.p`
  ${textStyles.homeBody()};
  padding-bottom: 1rem;
`;

export const PageTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const QuestionTitle = styled.div`
  ${textStyles.h2()};
  padding: 1rem 0rem;
  font-weight: 600;
`;

export const StickyTitle = styled.div`
  ${textStyles.h2()};
  position: sticky;
  top: 0px;
  background-color: ${colors.gray200}; 
  z-index: 1;
  padding: 1.5rem 0rem 1rem 2rem;
  border: 3px solid ${colors.gray400};
  border-radius: 1rem;
`;

export const MainTitle = styled.div`
  ${textStyles.mainTitle()};
  font-weight: 600;
  padding: 10px 0px;
  text-decoration: underline;
`;

export const SurveyContainer = styled.div`
  width: 100%; 
`;

export const LinearScaleWrapper = styled.div`
  width: 100%; 
  margin: 2rem auto;
  max-width: 700px;
`;