// pages/SessionLoading.tsx

import type { LoadingStep } from "../models/loading";
import { loadMissionStep } from "../stores/missionStepStorage";
import { useUserStore } from "../stores/useUserStore";
import { PRELOAD_SESSION, preloadImages, safeRun } from "../models/loading";
import Loading from "./Loading";

import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";


async function flushOnboardingMissionLogs(signal: AbortSignal) {
    if (signal.aborted) return;
  
    const { prolificId } = useUserStore.getState();
    if (!prolificId) {
      console.warn("[flushOnboardingMissionLogs] prolificId is empty — skip write");
      return;
    }
  
    const step = loadMissionStep();
    const ref = doc(db, "participants", prolificId, "onboarding", "state");
  
    try {
      await setDoc(
        ref,
        {
          missionStep: step,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(doc(db, "participants", prolificId), {
        "meta.onboardingFlags": step >= 4,
      });

      await addDoc(
        collection(db, "participants", prolificId, "events"),
        { type: "onboarding/missionStep", missionStep: step, at: serverTimestamp() }
      );
      console.log("[flushOnboardingMissionLogs] wrote:", { prolificId, missionStep: step });
    } catch (e) {
      console.error("[flushOnboardingMissionLogs] Firestore write failed:", e);
    }
  }

export default function SessionLoading() {
  const steps: LoadingStep[] = [
    {
      label: "preload-session-assets",
      weight: 2,
      run: (signal) => safeRun(() => preloadImages(PRELOAD_SESSION, signal), signal),
    },
    { label: "flush-logs:chat",   run: (signal) => safeRun(flushOnboardingMissionLogs, signal) },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={1500}
      nextTo="/session1" 
      onProgress={() => {
      }}
      onComplete={() => {
        // 필요하면 완료 후 추가 동작
      }}
    />
  );
}