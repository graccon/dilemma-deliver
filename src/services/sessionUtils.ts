// utils/sessionUtils.ts
export function getCurrentSessionIndex(envKey: string): number {
    return parseInt(localStorage.getItem(envKey) || "0", 10);
}