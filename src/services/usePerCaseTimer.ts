// usePerCaseTimer.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { getElapsedMs, startCaseIfNeeded } from "../stores/caseTurnTimerStorage";

export type UsePerCaseTimerResult = {
  elapsedMs: number;
  remainingMs: number;
  reachedLimit: boolean;
  resetFlags: () => void;
};

export function formatMMSS(ms: number) {
  const clamped = Math.max(0, ms);
  const mm = Math.floor(clamped / 60000);
  const ss = Math.floor((clamped % 60000) / 1000);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function usePerCaseTimer(
  sessionId: string,
  caseId: string | undefined,
  limitMs: number,
  enabled: boolean = true,
  onLimit?: () => void
): UsePerCaseTimerResult {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [reachedLimit, setReachedLimit] = useState(false);
  const caseKey = useMemo(() => (caseId ? `${sessionId}:${caseId}` : ""), [sessionId, caseId]);

  const onLimitRef = useRef(onLimit);
  onLimitRef.current = onLimit;

  useEffect(() => {
    if (!caseId || !enabled) return;
    setElapsedMs(0);
    setReachedLimit(false);
    startCaseIfNeeded(sessionId, caseId);

    let raf = 0;
    const tick = () => {
      const ms = getElapsedMs(sessionId, caseId);
      setElapsedMs(ms);

      if (!reachedLimit && ms >= limitMs) {
        setReachedLimit(true);
        onLimitRef.current?.();   // 알림만 하고 루프는 계속
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [caseKey, limitMs, enabled]); // case 바뀌면 초기화

  return {
    elapsedMs,
    remainingMs: Math.max(0, limitMs - elapsedMs),
    reachedLimit,
    resetFlags: () => setReachedLimit(false),
  };
}