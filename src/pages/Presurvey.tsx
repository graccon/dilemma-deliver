import { useEffect, useState } from "react";
import FooterButton from "../components/FooterButton"
import MainLayout from "../layouts/MainLayout"
import { surveyQuestionsBFI, surveyQuestionsLOC, surveyQuestionsAIUsed } from "../assets/data/surveyItems"
import LinearScale from "../components/LinearScale";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";
import { getPresurveyAnswers, setPresurveyAnswers, type SurveyAnswers } from "../stores/presurveyStore";

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
        footerButton={
          <FooterButton label="Start Survey" to="/onboarding" disabled={!isAllAnswered} />
        }
      >
        <Container>
          <PageTitle>Presurvey page</PageTitle>
          <Description>Please answer all the questions carefully. This survey consists of 22 questions in total.</Description>

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
                  index={idx + 16}
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
                  index={idx + 20}
                  scale={item.scale ?? 5}
                  question={item.question}
                  labels={{ min: "Strongly Disagree", max: "Strongly Agree"}}
                  value={answers[item.id] ?? 0}
                  onChange={(value) => handleAnswerChange(item.id, value)}
                />
                <Divider />
              </LinearScaleWrapper>
            ))}
          </SurveyContainer>


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
  ${textStyles.h4()};
  padding-bottom: 1rem;
`;

export const PageTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const SurveyContainer = styled.h1`
  width: 100%; 
  // background-color: blue;
`;

export const LinearScaleWrapper = styled.div`
  width: 100%; 
  margin: 2rem auto;
  max-width: 700px;
`;

export const StickyTitle = styled.div`
  ${textStyles.h2()};
  position: sticky;
  top: 0;
  background-color: ${colors.gray200}; 
  z-index: 1;
  padding: 1.2rem 2.5rem;
  border: 3px solid ${colors.gray400};
  border-radius: 1rem;
`;

export const MainTitle = styled.div`
  ${textStyles.mainTitle()}
  font-weight: 600;
  padding: 10px 0px;
  text-decoration: underline;
`;

