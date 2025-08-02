// services/turnLogStorage.ts
const STORAGE_KEY = "turn_logs_session2";

export function recordTurnTaking(caseId: string): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  const logs: Record<string, number> = raw ? JSON.parse(raw) : {};

  logs[caseId] = (logs[caseId] || 1) + 1;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/**
 * 전체 턴 로그를 반환합니다.
 * @returns Record<caseId, number>
 */
export function getTurnLogs(): Record<string, number> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getTurnCount(caseId: string): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  const logs: Record<string, number> = raw ? JSON.parse(raw) : {};
  return logs[caseId] || 0;
}

/**
 * 전체 턴 로그를 초기화합니다.
 */
export function clearTurnLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log("[TurnLog] All session2 turn logs cleared");
}