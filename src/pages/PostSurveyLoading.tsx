// pages/SessionLoading.tsx

import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getPostsurveyData } from "../stores/postsurveyStore";
import { getTimerLogs } from "../stores/useTimerLogStore";
import { getCurrentSessionIndex } from "../services/sessionUtils";
import { getBlurCountByPage, useFocusLogStore } from "../stores/useFocusLogStore";


async function flushPostSurveyLogs(signal: AbortSignal) {
  if (signal.aborted) return;

  const { prolificId } = useUserStore.getState();

  const answers = getPostsurveyData();
  const timers = getTimerLogs();

  if (!answers || Object.keys(answers).length === 0) {
    console.info("[flushPreSurveyLogs] no answers — skip");
    return;
  }
  const surveyRef = doc(db, "participants", prolificId, "surveys", "postsurvey");
  try {
    await setDoc(
      surveyRef,
      { answers, 
        submittedAt: serverTimestamp(),
        timers
    },
      { merge: true }
    );

    await updateDoc(doc(db, "participants", prolificId), {
          "meta.surveyFlags.postsurvey": true,
    });

    await addDoc(collection(db, "participants", prolificId, "events"), {
      type: "survey/submit",
      surveyId: "presurvey",
      size: Object.keys(answers).length,
      answers,
      at: serverTimestamp(),
    });
    console.log("[flushPreSurveyLogs] addDoc OK");
  } catch (e) {
    console.error("[flushPreSurveyLogs] Firestore write failed:", e);
  }
}

async function flushMetaLogs(signal: AbortSignal) {
    if (signal.aborted) return;

    const { prolificId } = useUserStore.getState();
    const timers = getTimerLogs();
    
    if (!prolificId) {
        console.warn("[flushMetaLogs] prolificId empty — skip");
        return;
    }
    const S1_INDEX_KEY = import.meta.env.VITE_S1_I_KEY; 
    const S2_INDEX_KEY = "session2_currentIndex";

    const signupTs = timers[0].timestamp;
    const lastSeenTs = timers[timers.length - 1].timestamp;
    const totalMs = Math.max(0, lastSeenTs - signupTs);

    const session1Done = getCurrentSessionIndex(S1_INDEX_KEY) === 5;
    const session2Done = getCurrentSessionIndex(S2_INDEX_KEY) === 5;

    console.log("session1Done : ", session1Done, session2Done);
    console.log("time : ", signupTs, lastSeenTs, totalMs)
    
    await updateDoc(doc(db, "participants", prolificId), {
        "meta.signupTs": signupTs,
        "meta.lastSeenTs": lastSeenTs,
        "meta.totalExperimentMs": totalMs,
        "meta.sessionFlags.session1Done": session1Done,
        "meta.sessionFlags.session2Done": session2Done,
    });
}

async function flushFocusLogs(signal: AbortSignal) {
  if (signal.aborted) return;

  const { prolificId } = useUserStore.getState();
  const focusLogs = useFocusLogStore.getState().logs;
  const blurCounts = getBlurCountByPage(focusLogs);
  
  if (!prolificId || focusLogs.length === 0) {
    console.info("[flushFocusLogs] empty — skip");
    return;
  }

  try {
    await setDoc(
      doc(db, "participants", prolificId, "focus", "logs"),
      {
        focusLogs,
        blurCount: blurCounts,
        uploadedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.info("[flushFocusLogs] upload success");
  } catch (e) {
    console.error("[flushFocusLogs] Firestore write failed:", e);
  }
}

export default function PostSurveyLoading() {
  const steps: LoadingStep[] = [
    { label: "flush-logs:post-survey", run: (signal) => safeRun(flushPostSurveyLogs, signal) },
    { label: "flush-logs:meta", run: (signal) => safeRun(flushMetaLogs, signal) },
    { label: "flush-logs:focus", run: (signal) => safeRun(flushFocusLogs, signal) },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={3000}
      nextTo="/thankyou" 
      onProgress={() => {
      }}
      onComplete={() => {
        // 필요하면 완료 후 추가 동작
      }}
    />
  );
}