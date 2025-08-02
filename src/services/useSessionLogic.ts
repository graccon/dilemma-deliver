import { useEffect, useState } from "react";
import { initShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCase from "../models/MoralCase";
import { useConfidenceStore } from "../stores/useConfidenceStore";
import problems from "../assets/data/problems.json";
import { useAgentChat } from "./useAgentChat";
import { recordTurnTaking, getTurnCount } from "../stores/turnLogStorage";
import { getShuffledTurns } from "../stores/turnSetting";


const INDEX_KEY = import.meta.env.VITE_S2_I_KEY;
const SHUFFLED_TURNS = getShuffledTurns();

export function useSessionLogic() {
  const total = problems.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentConfidence, setCurrentConfidence] = useState(50);
  const [canTakeTurn, setCanTakeTurn] = useState(true);
  const addConfidence = useConfidenceStore((state) => state.addConfidence);

  useEffect(() => {
    initShuffledProblems();
    const savedIndex = localStorage.getItem(INDEX_KEY);
    if (savedIndex !== null) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  useEffect(() => {
    const caseData = getProblemByIndex(currentIndex);
    if (caseData) {
      const instance = new MoralCase(caseData);
      setCurrentCase(instance);
      setIsAnswered(false);
      setCurrentConfidence(50);
      const turn_count = getTurnCount(instance.id);
      setCanTakeTurn(turn_count < SHUFFLED_TURNS.length);
    }
  }, [currentIndex]);

  const { agentChats, loading } = useAgentChat(`case_${currentIndex + 1}`, "1", "1");

  const handleNext = () => {
    addConfidence({
      sessionId: "session2",
      caseIndex: currentIndex,
      confidence: currentConfidence,
      timestamp: Date.now(),
      type: "final",
    });

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem(INDEX_KEY, nextIndex.toString());

    if (nextIndex >= total) {
      window.location.href = "/postsurvey";
    }
  };

    const handleMoreClick = async () => {
        const caseId = currentCase!.id; 
        const turn_count = getTurnCount(caseId);
        const isTurnAvailable = turn_count < SHUFFLED_TURNS.length;
        setCanTakeTurn(isTurnAvailable);

        console.log("턴테이킹입니다", SHUFFLED_TURNS[turn_count]);
        recordTurnTaking(caseId);
        // 만약 턴테이킹 5이면 false가 나오는 변수가 있어야 돼. 
    };


  return {
    isAnswered,
    setIsAnswered,
    currentIndex,
    currentCase,
    handleNext,
    total,
    addConfidence,
    currentConfidence,
    setCurrentConfidence,
    agentChats,
    loading,
    handleMoreClick,
    canTakeTurn,
  };
}