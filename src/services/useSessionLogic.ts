import { useEffect, useRef, useState } from "react";
import MoralCase from "../models/MoralCase";
import problems from "../assets/data/problems.json";
import { getProblemByIndex, initShuffledProblems } from "../services/problemSetting";
import { getChatLog, setChatLog } from "../stores/chatLogStorage";
import { getTurnCount, recordTurnTaking } from "../stores/turnLogStorage";
import { getShuffledTurns } from "../stores/turnSetting";
import { useUserStore } from "../stores/useUserStore";
import { useConfidenceStore } from "../stores/useConfidenceStore";
import { loadAgentChats } from "./loadAgentChats";
import type { AgentChat } from "../services/loadAgentChats";
import { useTimerLogStore } from "../stores/useTimerLogStore";
import { useSessionLogStore } from "../stores/sessionLogStore";

const INDEX_KEY = "session2_currentIndex";
const SHUFFLED_TURNS = getShuffledTurns();

function getLastDurationBeforeCurrent(): number {
  const { logs } = useTimerLogStore.getState();
  if (logs.length < 2) return 0;

  const lastLog = logs[logs.length - 2];
  const now = Date.now();
  return now - lastLog.timestamp;
}

export function useSessionLogic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<MoralCase | null>(null);
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState(50);
  const [isAnswered, setIsAnswered] = useState(false);
  const [canTakeTurn, setCanTakeTurn] = useState(true);
  const isFetchingRef = useRef(false);
  const [chatsLoaded, setChatsLoaded] = useState(true);
  
  const { group } = useUserStore();
  const addConfidence = useConfidenceStore((state) => state.addConfidence);
  const fetchedRef = useRef<Set<string>>(new Set());
  const [timerReady, setTimerReady] = useState(false);

  // 초기 인덱스 설정
  useEffect(() => {
    initShuffledProblems();
    const saved = localStorage.getItem(INDEX_KEY);
    if (saved) setCurrentIndex(Number(saved));
    
  }, []);

  // 케이스 변경 시 처리
  useEffect(() => {
    const problem = getProblemByIndex(currentIndex);
    if (!problem) return;

    const instance = new MoralCase(problem);
    setCurrentCase(instance);
    setIsAnswered(false);
    setCurrentConfidence(50);
    setTimerReady(false);  
    
    const turnCount = getTurnCount(instance.id);
    setCanTakeTurn(turnCount < SHUFFLED_TURNS.length);

    fetchInitialChats(instance);
  }, [currentIndex]);

  // 좋아요 인덱스 추적
  useEffect(() => {
    if (agentChats.length === 0) return;
    const liked = agentChats.findIndex((c) => c.liked);
    setLikedIndex(liked >= 0 ? liked : null);
  }, [agentChats]);

  // 초기 채팅 불러오기
  async function fetchInitialChats(instance: MoralCase) {
    const caseId = instance.id;
    const saved = getChatLog(caseId);

    if (saved && saved.length > 0) {
      setAgentChats(saved);
      setShouldAnimate(false);
      setTimerReady(true);  
      return;
    }

    const turnCount = getTurnCount(caseId);
    if (turnCount > 0 || fetchedRef.current.has(caseId)) {
      console.log(" Already fetched. Skip fetch.");
      return;
    }

    const turnId = SHUFFLED_TURNS[turnCount];

    try {
      recordTurnTaking(caseId);
      setAgentChats([]);

      const chats = await loadAgentChats(caseId, turnId, group ?? "1");
      await appendChatsSequentially(chats, caseId);
      fetchedRef.current.add(caseId);
      setTimerReady(true); 
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  }

  const handleMoreClick = async () => {
    if (!currentCase || isFetchingRef.current) return;
    const caseId = currentCase.id;

    const turnCount = getTurnCount(caseId);
    const isAvailable = turnCount < SHUFFLED_TURNS.length;
    if (!isAvailable) return;

    const turnId = SHUFFLED_TURNS[turnCount]; 

    try {
      appendUserChat("I can’t decide yet");
      isFetchingRef.current = true;
      const newChats = await loadAgentChats(caseId, turnId, group ?? "1");
      await appendChatsSequentially(newChats, caseId);
      recordTurnTaking(caseId);
      setCanTakeTurn(turnCount + 1 < SHUFFLED_TURNS.length);
    } catch (err) {
      console.error("❌ Turn fetch error:", err);
    } finally {
        isFetchingRef.current = false; 
      }
};

  // 채팅 순차 렌더링
  function appendChatsSequentially(chatsToAdd: AgentChat[], caseId: string): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      setChatsLoaded(false); 
      const interval = setInterval(() => {
        if (i >= chatsToAdd.length) {
          clearInterval(interval);
          setChatsLoaded(true);
          resolve();
          return;
        }
  
        const chat = chatsToAdd[i];
        if (!chat) {
          console.warn("⚠️ Null or undefined chat skipped:", chat);
          i++;
          return;
        }
  
        setAgentChats((prev) => {
          const updated = [...prev, chat];
          setChatLog(caseId, updated); 
          return updated;
        });
  
        i++;
      }, 3000);
      setShouldAnimate(true);
    });
  }

  // 좋아요 변경
  function updateLikedIndex(index: number) {
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
  }

  // 채팅 수정 및 저장
  function updateAndSaveChats(updater: (prev: AgentChat[]) => AgentChat[]) {
    setAgentChats((prev) => {
      const updated = updater(prev);
      if (currentCase) setChatLog(currentCase.id, updated);
      return updated;
    });
  }

  function appendUserChat(message: string) {
    const newChat: AgentChat = {
      from: "me",
      to: "all",
      type: "talk",
      message,
    };
    setAgentChats((prev) => [...prev, newChat]);
  }

  // 다음 문제 이동
  function handleNext() {
    if (!currentCase) return;

    addConfidence({
      sessionId: "session2",
      caseIndex: currentIndex,
      confidence: currentConfidence,
      timestamp: Date.now(),
      type: "final",
    });

    const timeSpent = getLastDurationBeforeCurrent();
    const likedChat = agentChats.find((c) => c.liked);
    useSessionLogStore.getState().addLog({
      sessionId: "session2",
      caseId: currentCase?.id ?? "undefined",
      confidence: currentConfidence,
      durationMs: timeSpent,
      agentChats: likedChat ? [likedChat] : [],
      turntakingCount: getTurnCount(currentCase.id)
    })

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem(INDEX_KEY, nextIndex.toString());

    if (nextIndex >= problems.length) {
      window.location.href = "/session2-loading";
    }
  }

  return {
    isAnswered,
    isFetchingRef,
    currentIndex,
    currentCase,
    chatsLoaded,
    total: problems.length,
    currentConfidence,

    setIsAnswered,
    setCurrentConfidence,
    addConfidence,
    agentChats,
    likedIndex,
    
    setAgentChats,
    updateLikedIndex,
    handleNext,
    handleMoreClick,
    canTakeTurn,
    shouldAnimate,
    timerReady,
  };
}