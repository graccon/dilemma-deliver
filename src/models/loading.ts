// models/loading.ts
export type LoadingStep = {
    label: string;                                   
    run: (signal: AbortSignal) => Promise<void>;     
    weight?: number;                                 
};
  
export interface LoadingProps {
    steps: LoadingStep[];
    minDurationMs?: number;                           
    nextTo?: string;                                  
    onProgress?: (pct: number, label: string) => void;
    onComplete?: () => void;                         
}

// ---------- 공통 유틸 ----------

export const PRELOAD_SESSION = [
    // case image
    "/assets/images/case1_A.png",
    "/assets/images/case1_B.png",
    "/assets/images/case2_A.png",
    "/assets/images/case2_B.png",
    "/assets/images/case3_A.png",
    "/assets/images/case3_B.png",
    "/assets/images/case4_A.png",
    "/assets/images/case4_B.png",
    "/assets/images/case5_A.png",
    "/assets/images/case5_B.png",

    // silder
    "/assets/icons/stay_icon.png",
    "/assets/icons/swerve_icon.png",
    
    // agent profile
    "/assets/icons/agent_lumi_icon.png",
    "/assets/icons/agent_lumi_listening_icon.png",
    "/assets/icons/agent_lumi_speaking_icon.png",
    "/assets/icons/agent_me_icon.png",
    "/assets/icons/agent_molu_icon.png",
    "/assets/icons/agent_molu_listening_icon.png",
    "/assets/icons/agent_molu_speaking_icon.png",
    "/assets/icons/agent_veko_icon.png",
    "/assets/icons/agent_veko_listening_icon.png",
    "/assets/icons/agent_veko_speaking_icon.png"
];

export const PRELOAD_ONBOARDING = [
    "/assets/icons/agent_agent1_icon.png",
    "/assets/icons/agent_agent1_listening_icon.png",
    "/assets/icons/agent_agent1_speaking_icon.png",
    "/assets/icons/agent_agent2_icon.png",
    "/assets/icons/agent_agent2_listening_icon.png",
    "/assets/icons/agent_agent2_speaking_icon.png",
    "/assets/icons/agent_agent3_icon.png",
    "/assets/icons/agent_agent3_listening_icon.png",
    "/assets/icons/agent_agent3_speaking_icon.png",
    "/assets/icons/stay_onboarding_icon.png",
    "/assets/icons/swerve_onboarding_icon.png",
    "/assets/images/onboarding_A.png",
    "/assets/images/onboarding_B.png",
    "/assets/images/onboarding_inactive_A.png",
    "/assets/images/onboarding_inactive_B.png",
    "/assets/images/default_A.png",
    "/assets/images/default_B.png",
    "/assets/images/mode_A.png",
    "/assets/images/mode_B.png",
    "/assets/images/case_A.png",
    "/assets/images/case_B.png",
];


// 이미지/아이콘 프리로드 (png/jpg/webp/svg 모두 Image로 캐시 가능)
export async function preloadImages(
    urls: string[],
    signal?: AbortSignal
  ): Promise<void> {
    if (!urls.length) return;
    await Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            const onAbort = () => {
              img.src = "";
              reject(new DOMException("Aborted", "AbortError"));
            };
            if (signal?.aborted) return onAbort();
  
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load ${src}`));
  
            if (signal) signal.addEventListener("abort", onAbort, { once: true });
            img.src = src;
          })
      )
    );
}

// 실패해도 진행은 계속하는 래퍼
export async function safeRun(
    fn: (signal: AbortSignal) => Promise<void>,
    signal: AbortSignal
  ) {
    try {
      await fn(signal);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      console.error("[loading] step error:", e);
    }
}