import { useEffect, useState } from "react";
import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import MoralCase from "../models/MoralCase";
import problems from "../assets/data/problems.json";
import { initShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCaseDisplay from "../components/MoralCaseDisplay";
import ConfidenceSlider from "../components/ConfidenceSilder";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { useTimerLogStore } from "../stores/useTimerLogStore";
import { useConfidenceStore } from "../stores/useConfidenceStore";
import { getCurrentSessionIndex } from "../services/sessionUtils";
import { useSessionLogStore } from "../stores/sessionLogStore";
import { restartCaseTimer } from "../stores/caseTurnTimerStorage";
import { usePerCaseTimer } from "../services/usePerCaseTimer";
import LimitReachedModal from "../components/LimitReachedModal";

function getLastDurationBeforeCurrent(): number {
  const { logs } = useTimerLogStore.getState();
  if (logs.length < 2) return 0;

  const lastLog = logs[logs.length - 2];
  const now = Date.now();
  return now - lastLog.timestamp;
}

export default function Session1() {
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState(50); 
  const total = problems.length;

  const addConfidence = useConfidenceStore((state) => state.addConfidence); 
  const INDEX_KEY = import.meta.env.VITE_S1_I_KEY; 

  const timerReady = true;
  const SESSION_ID = "session1";
  const PER_CASE_LIMIT_MS = 15 * 60 * 1000;
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { remainingMs, resetFlags } = usePerCaseTimer(
    SESSION_ID,
    currentCase?.id,
    PER_CASE_LIMIT_MS,
    timerReady,
    () => {
      setShowLimitModal(true);
    }
  );

  useEffect(() => {
    initShuffledProblems();
    const savedIndex = getCurrentSessionIndex(INDEX_KEY);
    if (savedIndex !== null) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const currentIndex = getCurrentSessionIndex(INDEX_KEY);
    if (currentIndex >= 5) {
      alert("You have already completed Session 1.");
      navigate("/session2"); 
    }
  }, []);

  useEffect(() => {
    const caseData = getProblemByIndex(currentIndex);
    if (caseData) {
      const instance = new MoralCase(caseData);
      setCurrentCase(instance);
      setIsAnswered(false);
      setCurrentConfidence(50);
    }
  }, [currentIndex]);

  const handleNext = () => {
    addConfidence({
      sessionId: "session1",
      caseIndex: currentIndex,
      confidence: currentConfidence,
      timestamp: Date.now(),
      type: "final",
    });

    const timeSpent = getLastDurationBeforeCurrent();
    useSessionLogStore.getState().addLog({
      sessionId: "session1",
      caseId: currentCase?.id ?? "undefined",
      confidence: currentConfidence,
      durationMs: timeSpent,
      agentChats: null,
      turntakingCount: null
    })

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem(INDEX_KEY, nextIndex.toString());
  
    if (currentIndex < total - 1) {
    } else {
      window.location.href = "/session1-loading";
    }
  };

  return (
    <MainLayout
      currentStep={3}
      footerButton={
        <FooterButton
          label={currentIndex < total - 1 ? "Next Question" : "Next Session"}
          onClick={handleNext}
          disabled={!isAnswered}
          isTimer={true}         
          elapsedMs={remainingMs} 
        />
      }
    >
      <Container>
            {showLimitModal && (
                <LimitReachedModal 
                  onRestart={() => {
                    resetFlags();
                    restartCaseTimer(SESSION_ID, currentCase!.id);
                    setShowLimitModal(false);
                  }}
                />
              )}
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
              setCurrentConfidence(value);
              if (value !== 50) {
                setIsAnswered(true);
              } else {
                setIsAnswered(false);
              }
            }}
            onTouchEnd={(value) => {
              addConfidence({
                sessionId: "session1",
                caseIndex: currentIndex,
                confidence: value,
                timestamp: Date.now(),
                type: "onTouchEnd",
              });
            }}
          />
        </SliderContainer>
      </Container>
    </MainLayout>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  padding: 0 3rem;
  height: 79vh; 
`;

export const CaseContainer = styled.div`
  flex: 10;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto; 
  border-radius: 1rem;
  background-color: ${colors.white};
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