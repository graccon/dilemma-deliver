import { useEffect, useState } from "react";
import FooterButton from "../components/FooterButton"
import MainLayout from "../layouts/MainLayout";
import { surveyQuestionsBFI, surveyQuestionsLOC, surveyQuestionsAIUsed } from "../assets/data/surveyItems"
import LinearScale from "../components/LinearScale";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";
import { getPresurveyAnswers, setPresurveyAnswers, type SurveyAnswers } from "../stores/presurveyStore";
import ProgressBar from "../components/ProgressBar";
import Spacer from "../components/Spacer";

const Divider = styled.hr`
  margin: 2rem auto; 
  width: 100%;
  border: 1px solid ${colors.gray300};
`;

const totalQuestionCount = 
  surveyQuestionsBFI.length +
  surveyQuestionsLOC.length +
  surveyQuestionsAIUsed.length;



export default function Presurvey() {
    const [answers, setAnswers] = useState<SurveyAnswers>({});
    const isAllAnswered =
      Object.values(answers).filter((value) => value !== 0).length === totalQuestionCount;
    const answeredCount = Object.values(answers).filter((v) => v !== 0).length;

    useEffect(() => {
      const saved = getPresurveyAnswers();
      if (saved) {
        setAnswers(saved);
      }
    }, []);

  
    const handleAnswerChange = (questionId: string, value: number) => {
      const updated = { ...answers, [questionId]: value };
      setAnswers(updated);
      setPresurveyAnswers(updated);
    };
  
    return (
      <MainLayout
        currentStep={1}
        footerButton={
          <FooterButton label="Next Sesstion" to="/onboarding-loading" disabled={!isAllAnswered} />
        }
      >
        <Container>
          <Spacer height="60px"/>
          <PageTitle>Pre-survey page</PageTitle>
          <Description>Thank you for taking the time to participate.<br /> This survey consists of 22 questions, and your thoughtful responses are very valuable to our research.<br />Please answer each question to the best of your ability.</Description>
          
          <Spacer height="40px"/>
          <ProgressBarContainer>
            <ProgressBarWrapper>
              <ProgressBar progress={answeredCount/ totalQuestionCount} />
            </ProgressBarWrapper>
            <ProgressBarLabel> {answeredCount} / {totalQuestionCount}</ProgressBarLabel>
          </ProgressBarContainer>

          <StickyTitle>
            Instruction: The following statements may apply more or less to you.
            <MainTitle>I see myself as someone who: </MainTitle>
          </StickyTitle>
          <SurveyContainer>
            {surveyQuestionsBFI.map((item, idx) => (
              <LinearScaleWrapper key={item.id}>
                <LinearScale
                  index={idx + 1}
                  scale={item.scale ?? 5}
                  question={item.question}
                  labels={{ min: "Does not apply to me at all", max: "Applies to me perfectly" }}
                  value={answers[item.id] ?? 0}
                  onChange={(value) => handleAnswerChange(item.id, value)}
                />
                <Divider />
              </LinearScaleWrapper>
            ))}
          </SurveyContainer>


          <StickyTitle>
            Instruction: The following statements may apply more or less to you.
            <MainTitle>To what extent do you think each statement applies to you personally?</MainTitle>
          </StickyTitle>
          <SurveyContainer>
            {surveyQuestionsLOC.map((item, idx) => (
              <LinearScaleWrapper key={item.id}>
                <LinearScale
                  index={idx + 1}
                  scale={item.scale ?? 5}
                  question={item.question}
                  labels={{ min: "does not apply at all", max: "applies completely" }}
                  value={answers[item.id] ?? 0}
                  onChange={(value) => handleAnswerChange(item.id, value)}
                />
                <Divider />
              </LinearScaleWrapper>
            ))}
          </SurveyContainer>

          <StickyTitle>
            Instruction: The following statements may apply more or less to you.
            <MainTitle>Experience and Perception of Conversational AI Tools</MainTitle>
          </StickyTitle>
          <SurveyContainer>
            {surveyQuestionsAIUsed.map((item, idx) => (
              <LinearScaleWrapper key={item.id}>
                <LinearScale
                  index={idx + 1}
                  scale={item.scale ?? 5}
                  question={item.question}
                  labels={{ min: item.labels?.min ?? "Strongly Disagree", max: item.labels?.max ?? "Strongly Agree"}}
                  value={answers[item.id] ?? 0}
                  onChange={(value) => handleAnswerChange(item.id, value)}
                />
                <Divider />
              </LinearScaleWrapper>
            ))}
          </SurveyContainer>

          <Spacer height="100px"/>
        </Container>
      </MainLayout>
    )
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

export const Description = styled.p`
  ${textStyles.homeBody()};
  padding-bottom: 1rem;
`;

export const PageTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const SurveyContainer = styled.div`
  width: 100%; 
`;

export const LinearScaleWrapper = styled.div`
  width: 100%; 
  margin: 2rem auto;
  max-width: 700px;
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

export const ProgressBarContainer = styled.div`
  position: sticky;
  z-index: 10; 
  top: 8px;
  width: 100%;
  margin: 0.5rem auto;
  margin-top:0px;
  display: flex;
  flex-direction: row;
  height: 24px;
`;

export const ProgressBarWrapper = styled.div`
  flex: 9;
  display: flex;
  justify-content: flex-end;
`;

export const ProgressBarLabel = styled.div`
   ${textStyles.h5()};
  flex: 1;
  display: flex;
  justify-content: center;
`;