import { useEffect, useState } from "react";
import { useSessionLogStore } from "../stores/sessionLogStore";
import FooterButton from "../components/FooterButton";
import type { SessionLog } from "../stores/sessionLogStore";
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import SessionReviewPanel from "../components/SessionReviewPanel";
import OpenEndedInput from "../components/OpenEndedInput";
import Spacer from "../components/Spacer";
import colors from "../styles/colors";
import { surveyFeaturePreference, surveyQuestionsAfter } from "../assets/data/surveyItems";
import FeatureSlider from "../components/FeatureSlider";
import LinearScale from "../components/LinearScale";

import {
  getPostsurveyData,
  setPostsurveyData,
  type PostsurveyData,
} from "../stores/postsurveyStore";

const Divider = styled.hr`
  margin: 2rem auto;
  width: 100%;
  border: 1px solid ${colors.gray300};
`;

type AgentType = "narr" | "stat" | "rule";

function countAgents(logs: any[], agentList: AgentType[]) {
  const counts: Record<AgentType, number> = {
    narr: 0,
    stat: 0,
    rule: 0,
  };

  logs.forEach((log) => {
    log.agentChats.forEach((chat: { from: AgentType }) => {
      if (agentList.includes(chat.from)) {
        counts[chat.from] += 1;
      }
    });
  });

  return counts;
}

function getAverageDuration(logs: SessionLog[]): number {
  if (!logs || logs.length === 0) return 0;
  const totalDuration = logs.reduce((sum, log) => sum + log.durationMs, 0);
  return (totalDuration / logs.length)/1000;
}

export default function Postsurvey() {
  const logs = useSessionLogStore((state) => state.logs);
  const session1Logs = logs.filter((log) => log.sessionId === "session1");
  const session2Logs = logs.filter((log) => log.sessionId === "session2");
  // 
  const avgSession1Duration = getAverageDuration(session1Logs).toFixed(0);
  const avgSession2Duration = getAverageDuration(session2Logs).toFixed(0);

  const agentList: AgentType[] = ["narr", "stat", "rule"];
  const session2AgentCounts = countAgents(session2Logs, agentList);

  // ---------- 초기값 세팅 (로컬스토리지 복원) ----------
  const saved = getPostsurveyData();

  const [answer1, setAnswer1] = useState<string>(saved?.openEnded.q1 ?? "");
  const [answer2, setAnswer2] = useState<string>(saved?.openEnded.q2 ?? "");
  const [answer3, setAnswer3] = useState<string>(saved?.openEnded.q3 ?? "");

  const [values, setValues] = useState<number[]>(
    // 저장된 값이 있으면 복원, 없으면 0으로 초기화
    saved?.sliders && saved.sliders.length === surveyFeaturePreference.length
      ? saved.sliders
      : surveyFeaturePreference.map(() => 0)
  );

  const [afterAnswers, setAfterAnswers] = useState<Record<string, number>>(
    saved?.after ?? {}
  );

  // ---------- 변화/무변화 케이스 ----------
  const confidenceChangedLogs = session1Logs.filter((log1) => {
    const log2 = session2Logs.find((l2) => l2.caseId === log1.caseId);
    return !!log2 && log1.confidence !== log2.confidence;
  });
  const confidenceUnchangedLogs = session1Logs.filter((log1) => {
    const log2 = session2Logs.find((l2) => l2.caseId === log1.caseId);
    return !!log2 && log1.confidence === log2.confidence;
  });

  let questionNumber = 1;

  // ---------- 변경 시마다 저장 ----------
  useEffect(() => {
    const data: PostsurveyData = {
      openEnded: { q1: answer1, q2: answer2, q3: answer3 },
      sliders: values,
      after: afterAnswers,
    };
    setPostsurveyData(data);
  }, [answer1, answer2, answer3, values, afterAnswers]);

  const handleSliderChange = (index: number, newValue: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = newValue;
      return next;
    });
  };

  const handleAfterChange = (questionId: string, value: number) => {
    setAfterAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  console.log(session1Logs);

  // ---------- 완료 체크 ----------
  const showQ1 = confidenceChangedLogs.length > 0;
  const showQ2 = confidenceUnchangedLogs.length > 0;
  console.log(showQ1, showQ2);
  const showQ3 = true; // Agent 섹션은 항상 표시 중

  const open1Done = !showQ1 || answer1.trim().length > 0;
  const open2Done = !showQ2 || answer2.trim().length > 0;
  const open3Done = !showQ3 || answer3.trim().length > 0;

  const slidersDone = values.every((v) => v !== null);
  const afterDone = surveyQuestionsAfter.every(
    (q) => (afterAnswers[q.id] ?? 0) !== 0
  );
  const isAllComplete = open1Done && open2Done && open3Done && slidersDone && afterDone;

  return (
    <MainLayout
      currentStep={4}
      footerButton={<FooterButton label="Next Sesstion" to="/postsurvey-loading" disabled={!isAllComplete} />}
    >
      <Container>
        <PageTitle>Post-survey page</PageTitle>
        <Description>
          Thank you for completing the survey. Your responses are invaluable to our research.
          <br />
          There are 2 - 3 open-ended questions and 11 more questions (9 slider selection and 2 multiple choice problems)
        </Description> 

        {/* Q1: 선택이 바뀐 케이스 */}
        {confidenceChangedLogs.length > 0 && (
          <>
            <QuestionTitle>
              Question {questionNumber++}. Below are the cases where your choice changed.
            </QuestionTitle>
            <Description>
              You had {confidenceChangedLogs.length} instance(s) where your confidence level in a decision changed between sessions.
              <br />On average, you spent {avgSession1Duration} ms in Session 1(without AI Agents), and {avgSession2Duration} ms in Session 2(with AI Agents).
            </Description>
            <ReviewPanelWrapper>
              <SessionReviewPanel
                session1Logs={session1Logs}
                session2Logs={session2Logs}
                mode="confidenceChange"
              />
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

        {/* Q2: 선택이 유지된 케이스 */}
        {confidenceUnchangedLogs.length > 0 && (
          <>
            <QuestionTitle>
              Question {questionNumber++}. Below are the cases where your choice unchanged.
            </QuestionTitle>
            <Description>
              You had {confidenceUnchangedLogs.length} case(s) where your choice stayed the same between sessions.
            </Description>
            <ReviewPanelWrapper>
              <SessionReviewPanel
                session1Logs={session1Logs}
                session2Logs={session2Logs}
                mode="confidenceUnchange"
              />
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

        {/* Q3: 에이전트 대화 선택 이유 */}
        <QuestionTitle>
          Question {questionNumber++}. Below are the cases where your choice changed.
        </QuestionTitle>
        <Description>
        In Session 2(with AI Agents), you selected Veko {session2AgentCounts.stat} time(s), 
        Lumi {session2AgentCounts.rule} time(s), and 
        Molu {session2AgentCounts.narr} time(s).
        </Description>
        <ReviewPanelWrapper>
          <SessionReviewPanel
            session1Logs={session1Logs}
            session2Logs={session2Logs}
            mode="Agent"
          />
        </ReviewPanelWrapper>
        <OpenEndedInputWrapper>
          <OpenEndedInput
            value={answer3}
            onChange={setAnswer3}
            question="Please explain why you chose this agent dialogue."
          />
        </OpenEndedInputWrapper>
        <Spacer height="50px" />

        {/* 슬라이더 섹션 */}
        <StickyTitle>
          The following sliders ask you to indicate how much weight you place on each factor in your decision-making.
          <MainTitle>Evaluate Feature Importance</MainTitle>
        </StickyTitle>
        <SurveyContainer>
          {surveyFeaturePreference.map((item, idx) => (
            <FeatureSlider
              key={`${item.id}_${idx}`}
              question={item.question}
              value={values[idx]}
              onChange={(v) => handleSliderChange(idx, v)}
              scale={100}
              labels={{
                min: item.labels?.min ?? "Does Not Matter",
                max: item.labels?.max ?? "Matters a lot",
              }}
              leftImageSrc={item.labelImages?.min ?? "/assets/icons/placeholder_left.png"}
              rightImageSrc={item.labelImages?.max ?? "/assets/icons/placeholder_right.png"}
            />
          ))}
        </SurveyContainer>

        {/* 사후 리커트 섹션 */}
        <StickyTitle>
          Instruction: For each statement, indicate how much it applied to you during the study.
          <MainTitle>Reflections</MainTitle>
        </StickyTitle>
        <SurveyContainer>
          {surveyQuestionsAfter.map((item, idx) => (
            <LinearScaleWrapper key={item.id}>
              <LinearScale
                index={idx + 1}
                scale={item.scale ?? 5}
                question={item.question}
                labels={{ min: item.labels?.min ?? "Strongly Disagree", max: item.labels?.max ?? "Strongly Agree" }}
                value={afterAnswers[item.id] ?? 0}
                onChange={(value) => handleAfterChange(item.id, value)}
              />
              <Divider />
            </LinearScaleWrapper>
          ))}
        </SurveyContainer>

        <Spacer height="280px" />
      </Container>
    </MainLayout>
  );
}

/* ===== styled ===== */

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
  flex-shrink: 0;
`;

export const OpenEndedInputWrapper = styled.div`
  width: 97%;
  margin: 0px auto;
`;

export const Description = styled.p`
  ${textStyles.homeBody()};
  color: ${colors.gray700};
  padding-bottom: 1rem;
`;

export const PageTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const QuestionTitle = styled.div`
  ${textStyles.h2()};
  padding: 0.4rem 0rem;
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