import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getSessionLogs } from "../stores/sessionLogStore";
import { getShuffledProblems } from "../services/problemSetting";
import { getConfidenceLogs } from "../stores/useConfidenceStore";
import { getTurnLogs } from "../stores/turnLogStorage";
import { getChatLog } from "../stores/chatLogStorage";
import { getAllTurnTimers } from "../stores/caseTurnTimerStorage";
import { getCurrentSessionIndex } from "../services/sessionUtils";

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

async function flushMetaLogs(signal: AbortSignal) {
    if (signal.aborted) return;

    const { prolificId } = useUserStore.getState();
    const S2_INDEX_KEY = "session2_currentIndex";
    const session2Done = getCurrentSessionIndex(S2_INDEX_KEY) === 5; 

    if (!prolificId) {
    console.warn("[flushMetaLogs] prolificId empty — skip");
    return;
    }
    await updateDoc(doc(db, "participants", prolificId), {
      "meta.sessionFlags.session2Done": session2Done,
    });
}

export default function Session2EndLoading() {
  const steps: LoadingStep[] = [
    { label: "flush-logs:chat", run: (signal) => safeRun(flushPreSurveyLogs, signal) },
    { label: "flush-logs:case-timer", run: (signal) => safeRun(flushCaseTimerLogs, signal) },
    { label: "flush-logs:meta", run: (signal) => safeRun(flushMetaLogs, signal) },
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