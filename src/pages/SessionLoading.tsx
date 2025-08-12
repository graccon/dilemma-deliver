// pages/SessionLoading.tsx

import type { LoadingStep } from "../models/loading";
import { PRELOAD_SESSION, preloadImages, safeRun } from "../models/loading";
import Loading from "./Loading";


async function flushOnboardingMissionLogs(signal: AbortSignal) {
    console.log("flushOnboardingMissionLogs")
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
      onProgress={(pct, label) => {
        // 파이어베이스에 진행률 로그 남기고 싶으면 여기서
        // logLoadingProgress({ pct, label, at: Date.now() })
      }}
      onComplete={() => {
        // 필요하면 완료 후 추가 동작
      }}
    />
  );
}