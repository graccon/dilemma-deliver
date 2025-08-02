import problems from "../assets/data/problems.json";

const STORAGE_KEY = "shuffledProblems";
export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function initShuffledProblems() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const shuffled = shuffle(problems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shuffled));
  }
}

export function getProblemByIndex(index: number) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return parsed[index] || null;
}

export function clearShuffledProblems() {
  localStorage.removeItem(STORAGE_KEY);
}