// services/useFocusTracker.ts
import { useEffect } from "react";
import { useFocusLogStore } from "../stores/useFocusLogStore";

export function useFocusTracker(page: string) {
  useEffect(() => {
    const handleFocus = () => {
      useFocusLogStore.getState().addLog(page, "focus");
    //   console.log(`[FOCUS] ${page} at ${new Date().toISOString()}`);
    };

    const handleBlur = () => {
      useFocusLogStore.getState().addLog(page, "blur");
    //   console.log(`[BLUR] ${page} at ${new Date().toISOString()}`);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // 최초 마운트 시에도 현재 상태 기록 (옵션)
    if (document.hasFocus()) {
      handleFocus();
    }

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [page]);
}