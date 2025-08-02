const TURN_STORAGE_KEY = "shuffledTurns";

export function getShuffledTurns(): string[] {
  const stored = localStorage.getItem(TURN_STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const turns = ["1", "2", "3", "4", "5"];
  const shuffled = turns.sort(() => Math.random() - 0.5);
  localStorage.setItem(TURN_STORAGE_KEY, JSON.stringify(shuffled));
  return shuffled;
}

export function clearShuffledTurns() {
  localStorage.removeItem(TURN_STORAGE_KEY);
}