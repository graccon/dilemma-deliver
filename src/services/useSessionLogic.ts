import { useEffect, useState } from "react";
import { initShuffledProblems, getProblemByIndex } from "../services/problemSetting";
import MoralCase from "../models/MoralCase";
import { useConfidenceStore } from "../stores/useConfidenceStore";
import problems from "../assets/data/problems.json";
import { recordTurnTaking, getTurnCount } from "../stores/turnLogStorage";
import { getShuffledTurns } from "../stores/turnSetting";
import { getChatLog, setChatLog } from "../stores/chatLogStorage";
import { useUserStore } from "../stores/useUserStore";
import { loadAgentChats } from "./loadAgentChats";
import type { AgentChat } from "../services/loadAgentChats";


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
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);
  const { group } = useUserStore();
  const [likedIndex, setLikedIndex] = useState<number | null>(null);

  useEffect(() => {
    initShuffledProblems();
    const savedIndex = localStorage.getItem(INDEX_KEY);
    if (savedIndex !== null) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  useEffect(() => {
    if (agentChats.length > 0) {
      const liked = agentChats.findIndex(c => c.liked === true);
      setLikedIndex(liked >= 0 ? liked : null);
    }
  }, [agentChats]);

  useEffect(() => {
    const caseData = getProblemByIndex(currentIndex);
    if (caseData) {
      const instance = new MoralCase(caseData);
      setCurrentCase(instance);
      setIsAnswered(false);
      setCurrentConfidence(50);
      const turn_count = getTurnCount(instance.id);
      setCanTakeTurn(turn_count < SHUFFLED_TURNS.length);

      async function fetchInitialChats() {
        try {
          const savedChats = getChatLog(instance.id); 
          if (savedChats && savedChats.length > 0) {
            setAgentChats(savedChats);
          } else {
            const turnCount = getTurnCount(instance.id);
            const turnId = SHUFFLED_TURNS[turnCount];
            const chats = await loadAgentChats(instance.id, turnId, group ?? "1");
            setAgentChats(chats);
            setChatLog(instance.id, chats);
          }
        } catch (error) {
          console.error("Error loading agent chats:", error);
        }
      }
      fetchInitialChats();
    }
  }, [currentIndex]);

  

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
        recordTurnTaking(caseId);

        
        const turnCount = getTurnCount(caseId);
        try {
            console.log("턴테이킹입니다", SHUFFLED_TURNS[turnCount - 1], turnCount);
        
            const turnId = SHUFFLED_TURNS[turnCount - 1];
            const newChats = await loadAgentChats(caseId, turnId, group ?? "1");
            
            setAgentChats((prevChats) => {
              const updatedChats = [...prevChats, ...newChats];
              setChatLog(caseId, updatedChats); 
              return updatedChats;
            });

            const isTurnAvailable = turnCount < SHUFFLED_TURNS.length;
            setCanTakeTurn(isTurnAvailable);
            if (!isTurnAvailable) return;
        
          } catch (err) {
            console.error("에이전트 채팅 로딩 실패:", err);
          }
    };

    function updateAndSaveChats(updater: (prev: AgentChat[]) => AgentChat[]) {
        setAgentChats(prev => {
          const updated = updater(prev);
          if (currentCase) {
            setChatLog(currentCase.id, updated);
          }
          return updated;
        });
      }

      const updateLikedIndex = (index: number) => {
        setLikedIndex((prev) => {
          const newIndex = prev === index ? null : index;
      
          updateAndSaveChats((prevChats) =>
            prevChats.map((chat, i) => ({
              ...chat,
              liked: i === newIndex,
            }))
          );
      
          return newIndex;
        });
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
    handleMoreClick,
    canTakeTurn,
    setAgentChats,
    likedIndex, 
    updateLikedIndex
  };
}