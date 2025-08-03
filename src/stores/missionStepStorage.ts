const STORAGE_KEY = "mission_step";

export function saveMissionStep(step: number): void {
  localStorage.setItem(STORAGE_KEY, String(step));
}

export function loadMissionStep(): number {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 1;
}

export function resetMissionStep(): void {
  localStorage.removeItem(STORAGE_KEY);
}