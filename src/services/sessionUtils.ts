// utils/sessionUtils.ts
export function getCurrentSession2Index(): number {
    const key = import.meta.env.VITE_S2_I_KEY;
    return parseInt(localStorage.getItem(key) || "0", 10);
}

// utils/sessionUtils.ts
export function getCurrentSessionIndex(envKey: string): number {
    return parseInt(localStorage.getItem(envKey) || "0", 10);
}