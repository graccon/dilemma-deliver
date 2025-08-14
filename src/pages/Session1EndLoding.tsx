import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getSessionLogs } from "../stores/sessionLogStore";
import { getShuffledProblems, clearShuffledProblems } from "../services/problemSetting";
import type { ConfidenceLog } from "../stores/useConfidenceStore";
import { getConfidenceLogs } from "../stores/useConfidenceStore";
import { getAllTurnTimers } from "../stores/caseTurnTimerStorage";

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
    const logs = getSessionLogs("session1");
    const order = getShuffledProblems(); 
    const confideces = getConfidenceLogs("session1");

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

  try {
    const sessionRef = doc(db, "participants", prolificId, "sessions", "session1");
    await setDoc(
        sessionRef,
        {
          logs,
          finishedAt: serverTimestamp(),
          totalMs: totalMs,
          avgMsPerCase: avgMsPerCase,
          confideces: changesByProblemId,
          shuffledProblems: shuffledIds ?? JSON.stringify(order ?? []),
        },
        { merge: true }
      );

    await addDoc(collection(db, "participants", prolificId, "events"), {
        type: "session1/saved",
        size: logs.length,
        at: serverTimestamp(),
      });
  } catch (e) {
    console.error("[flushPreSurveyLogs] Firestore write failed:", e);
  }
}

export async function resetProblemsForSession2(signal: AbortSignal) {
    if (signal.aborted) return;
  
    clearShuffledProblems();
    console.log("[resetProblemsForSession2] cleared shuffledProblems");

    const { prolificId } = useUserStore.getState();
    if (!prolificId) {
      console.warn("[flushMetaLogs] prolificId empty — skip");
      return;
    }
    try {
      if (prolificId) {
        await addDoc(collection(db, "participants", prolificId, "events"), {
          type: "problems/cleared-for-session2",
          at: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn("[resetProblemsForSession2] event write failed:", e);
    }
}

async function flushCaseTimerLogs(signal: AbortSignal) {
  if (signal.aborted) return;
  const SESSION_ID = "session1";
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

export default function Session1EndLoading() {
  const steps: LoadingStep[] = [
    { label: "flush-logs:chat", run: (signal) => safeRun(flushPreSurveyLogs, signal) },
    { label: "resetProblemsForSession2", run: (signal) => safeRun(resetProblemsForSession2, signal) },
    { label: "flush-logs:case-timer", run: (signal) => safeRun(flushCaseTimerLogs, signal) },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={2000}
      nextTo="/session2" 
      onProgress={() => {
      }}
      onComplete={() => {
      }}
    />
  );
}