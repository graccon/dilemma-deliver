import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getSessionLogs } from "../stores/sessionLogStore";
import { getShuffledProblems } from "../services/problemSetting";
import { getConfidenceLogs } from "../stores/useConfidenceStore";
import type { ConfidenceLog } from "../stores/useConfidenceStore";
import { getTurnLogs } from "../stores/turnLogStorage";
import { getChatLog } from "../stores/chatLogStorage";
import { getAllTurnTimers } from "../stores/caseTurnTimerStorage";

export function getAllChatLogs(caseIds: string[]): Record<string, any[]> {
    const chatsByCase: Record<string, any[]> = {};
  
    for (const id of caseIds) {
      const chats = getChatLog(id);
      if (chats && chats.length > 0) {
        chatsByCase[id] = chats;
      } else {
        chatsByCase[id] = []; 
      }
    }
    return chatsByCase;
}

function countChangesByCase(confidences: ConfidenceLog[]) {
    const prevByCase = new Map<number, number>();
    const changesByCase = new Map<number, number>();
  
    for (const log of confidences) {
      if (log.type !== "onTouchEnd") continue;
      const prev = prevByCase.get(log.caseIndex);
      if (prev !== undefined && prev !== log.confidence) {
        changesByCase.set(log.caseIndex, (changesByCase.get(log.caseIndex) || 0) + 1);
      }
      prevByCase.set(log.caseIndex, log.confidence);
    }
    return changesByCase;
}
  
async function flushPreSurveyLogs(signal: AbortSignal) {
  if (signal.aborted) return;

  const { prolificId } = useUserStore.getState();
  if (!prolificId) {
    console.warn("[flushPreSurveyLogs] prolificId empty — skip");
    return;
  }
  const logs = getSessionLogs("session2");
  const order = getShuffledProblems(); 
  const confideces = getConfidenceLogs("session2");
  const turns = getTurnLogs();

    const shuffledIds: string[] | null = Array.isArray(order)
        ? order
            .map((p: any) => p?.id) 
            .map(String)
        : null;

    const changesMap = countChangesByCase(confideces);
    const changesByProblemId = shuffledIds!.reduce((acc, problemId, caseIndex) => {
        acc[problemId] = changesMap.get(caseIndex) || 0;
        return acc;
    }, {} as Record<string, number>);

    const caseCount = logs.length;
    const totalMs = logs.reduce((s, l) => s + (l?.durationMs ?? 0), 0);
    const avgMsPerCase = caseCount ? Math.round(totalMs / caseCount) : 0;
    const allChatLogs = getAllChatLogs(shuffledIds!);

  try {
    const sessionRef = doc(db, "participants", prolificId, "sessions", "session2");
    await setDoc(
        sessionRef,
        {
          logs,
          finishedAt: serverTimestamp(),
          totalMs: totalMs,
          turnCount: turns,
          avgMsPerCase: avgMsPerCase,
          confideces: changesByProblemId,
          shuffledProblems: shuffledIds ?? JSON.stringify(order ?? []),
          chatlogs: allChatLogs,
          confidecesLogs: confideces,
        },
        { merge: true }
      );

    await addDoc(collection(db, "participants", prolificId, "events"), {
        type: "session2/saved",
        size: logs.length,
        at: serverTimestamp(),
      });
  } catch (e) {
    console.error("[flushPreSurveyLogs] Firestore write failed:", e);
  }
}

async function flushCaseTimerLogs(signal: AbortSignal) {
  if (signal.aborted) return;
  const SESSION_ID = "session2";
  const { prolificId } = useUserStore.getState();
  if (!prolificId) {
    console.warn("[flushCaseTimerLogs] prolificId empty — skip");
    return;
  }

  try {
    const timers = getAllTurnTimers(SESSION_ID);

    const timerDocRef = doc(db, "participants", prolificId, "timers", SESSION_ID);
    await setDoc(timerDocRef, {
      timers,
      uploadedAt: serverTimestamp(),
    });

    console.log(`[flushCaseTimerLogs] Uploaded ${Object.keys(timers).length} case timers for ${SESSION_ID}`);
  } catch (err) {
    console.error("[flushCaseTimerLogs] Firestore write failed:", err);
  }
}

export default function Session2EndLoading() {
  const steps: LoadingStep[] = [
    { label: "flush-logs:chat", run: (signal) => safeRun(flushPreSurveyLogs, signal) },
    { label: "flush-logs:case-timer", run: (signal) => safeRun(flushCaseTimerLogs, signal) },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={2500}
      nextTo="/postsurvey" 
      onProgress={() => {
      }}
      onComplete={() => {
        // 필요하면 완료 후 추가 동작
      }}
    />
  );
}