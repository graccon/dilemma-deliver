// pages/SessionLoading.tsx

import type { LoadingStep } from "../models/loading";
import { useUserStore } from "../stores/useUserStore";
import { PRELOAD_ONBOARDING, preloadImages, safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { getPresurveyAnswers } from "../stores/presurveyStore";


async function flushPreSurveyLogs(signal: AbortSignal) {
  const { prolificId } = useUserStore.getState();
  if (!prolificId) {
    console.warn("[flushMetaLogs] prolificId empty — skip");
    return;
  }
  
  if (signal.aborted) return;

  const answers = getPresurveyAnswers();
  if (!answers || Object.keys(answers).length === 0) {
    console.info("[flushPreSurveyLogs] no answers — skip");
    return;
  }
  const surveyRef = doc(db, "participants", prolificId, "surveys", "presurvey");
  try {
    await setDoc(
      surveyRef,
      { answers, submittedAt: serverTimestamp() },
      { merge: true }
    );
    console.log("[flushPreSurveyLogs] setDoc OK", surveyRef.path);

    await updateDoc(doc(db, "participants", prolificId), {
      "meta.surveyFlags.presurvey": true,
      "meta.lastSeenTs": serverTimestamp(), // 선택: 마지막 접속도 갱신
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

  const { prolificId, group, sessionId } = useUserStore.getState();
  
  if (!prolificId) {
    console.warn("[flushMetaLogs] prolificId empty — skip");
    return;
  }
  const metaRef = doc(db, "participants", prolificId);
  const metaPayload = {
      prolificId: prolificId,
      group: group,
      sessionId : sessionId,
      signupTs: serverTimestamp(), 
      lastSeenTs: serverTimestamp(), 
      totalExperimentMs: null,
      sessionFlags: {
        session1Done: false,
        session2Done: false,
      },
      onboardingFlags: false,
      surveyFlags: {
        presurvey: false,
        postsurvey: false,
      },
    };
    await setDoc(
      metaRef,
      { meta: metaPayload },
      { merge: true }
    );
}

export default function OnboardingLoading() {
  const steps: LoadingStep[] = [
    {
      label: "preload-onboarding-assets",
      weight: 2,
      run: (signal) => safeRun(() => preloadImages(PRELOAD_ONBOARDING, signal), signal),
    },
    { label: "flush-logs:meta", run: (signal) => safeRun(flushMetaLogs, signal) },
    { label: "flush-logs:chat", run: (signal) => safeRun(flushPreSurveyLogs, signal) },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={2000}
      nextTo="/onboarding" 
      onProgress={() => {
        // 파이어베이스에 진행률 로그 남기고 싶으면 여기서
        // logLoadingProgress({ pct, label, at: Date.now() })
      }}
      onComplete={() => {
        // 필요하면 완료 후 추가 동작
      }}
    />
  );
}