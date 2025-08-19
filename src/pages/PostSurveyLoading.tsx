// pages/SessionLoading.tsx
import { useNavigate } from "react-router-dom";
import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { safeRun } from "../models/loading";
import Loading from "./Loading";
import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getPostsurveyData } from "../stores/postsurveyStore";
import { getTimerLogs, useTimerLogStore } from "../stores/useTimerLogStore";
import { getBlurCountByPage, useFocusLogStore } from "../stores/useFocusLogStore";
import { getCurrentSessionIndex } from "../services/sessionUtils";
import { useSessionLogStore } from "../stores/sessionLogStore";
import { useConfidenceStore } from "../stores/useConfidenceStore";

async function flushPostSurveyLogs(signal: AbortSignal) {
  if (signal.aborted) return;

  const { prolificId } = useUserStore.getState();
  if (!prolificId) {
    console.warn("[flushMetaLogs] prolificId empty — skip");
    return;
  }

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
      surveyId: "postsurvey",
      size: Object.keys(answers).length,
      answers,
      at: serverTimestamp(),
    });
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
  
    const signupTs = timers[0].timestamp;
    const lastSeenTs = timers[timers.length - 1].timestamp;
    const totalMs = Math.max(0, lastSeenTs - signupTs);

    const S2_INDEX_KEY = "session2_currentIndex";
    const session2Done = getCurrentSessionIndex(S2_INDEX_KEY) === 5; 
    const S1_INDEX_KEY = import.meta.env.VITE_S1_I_KEY;
    const session1Done = getCurrentSessionIndex(S1_INDEX_KEY) === 5;

    console.log("time : ", signupTs, lastSeenTs, totalMs)
    
    await updateDoc(doc(db, "participants", prolificId), {
        "meta.signupTs": signupTs,
        "meta.lastSeenTs": lastSeenTs,
        "meta.totalExperimentMs": totalMs,
        "meta.sessionFlags.session2Done": session2Done,
        "meta.sessionFlags.session1Done": session1Done,
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
  const navigate = useNavigate();
  return (
    <Loading
      steps={steps}
      minDurationMs={4000}
      nextTo=""
      onProgress={() => {
      }}
      onComplete={() => {
        localStorage.clear();
        useUserStore.persist.clearStorage?.();
        useTimerLogStore.persist.clearStorage?.();
        useFocusLogStore.persist.clearStorage?.();
        useSessionLogStore.persist.clearStorage?.();
        useConfidenceStore.persist.clearStorage?.();
        setTimeout(() => {
          navigate("/thankyou");
        }, 100); 
      }}
    />
  );
}