// caseTurnTimerStorage.ts
export type TurnLogEntry = {
    startedAt: number;
    lastUpdatedAt: number;
    count: number;
    turns: number[];
  };
  
  const now = () => Date.now();
  const getStorageKey = (sessionId: string) => `turn_timer_${sessionId}`;
  
  function loadAll(sessionId: string): Record<string, TurnLogEntry> {
    try {
      const raw = localStorage.getItem(getStorageKey(sessionId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function saveAll(sessionId: string, data: Record<string, TurnLogEntry>) {
    localStorage.setItem(getStorageKey(sessionId), JSON.stringify(data));
  }
  function ensureEntry(map: Record<string, TurnLogEntry>, caseId: string): TurnLogEntry {
    if (!map[caseId]) {
      const ts = now();
      map[caseId] = { startedAt: ts, lastUpdatedAt: ts, count: 0, turns: [] };
    }
    return map[caseId];
  }
  
  /** 최초 진입 시 한 번 생성 */
  export function startCaseIfNeeded(sessionId: string, caseId: string) {
    const map = loadAll(sessionId);
    ensureEntry(map, caseId);
    saveAll(sessionId, map);
  }
  
  export function recordTurn(sessionId: string, caseId: string) {
    const map = loadAll(sessionId);
    const entry = ensureEntry(map, caseId);
    const ts = now();
    entry.count += 1;
    entry.turns.push(ts);
    entry.lastUpdatedAt = ts;
    saveAll(sessionId, map);
  }
  
  /** ⬅️ 재시작: count 올리고 turns에도 남긴 뒤 타이머 리셋 */
  export function restartCaseTimer(sessionId: string, caseId: string) {
    const map = loadAll(sessionId);
    const entry = ensureEntry(map, caseId);
    const ts = now();
    entry.count += 1;        // 재시작도 ‘턴’으로 카운트
    entry.turns.push(ts);    // 재시작 시각 기록
    entry.startedAt = ts;    // 타이머 리셋
    entry.lastUpdatedAt = ts;
    saveAll(sessionId, map);
  }
  
  export function getCaseTurnLog(sessionId: string, caseId: string): TurnLogEntry | null {
    const map = loadAll(sessionId);
    return map[caseId] ?? null;
  }
  export function getTurnCount(sessionId: string, caseId: string): number {
    return getCaseTurnLog(sessionId, caseId)?.count ?? 0;
  }
  export function getElapsedMs(sessionId: string, caseId: string): number {
    const entry = getCaseTurnLog(sessionId, caseId);
    return entry ? Math.max(0, now() - entry.startedAt) : 0;
  }
  export function clearCaseTurnLog(sessionId: string, caseId: string) {
    const map = loadAll(sessionId);
    if (map[caseId]) {
      delete map[caseId];
      saveAll(sessionId, map);
    }
  }
  export function clearAllTurnTimers(sessionId: string) {
    localStorage.removeItem(getStorageKey(sessionId));
  }
  export function getAllTurnTimers(sessionId: string): Record<string, TurnLogEntry> {
    return loadAll(sessionId);
  }