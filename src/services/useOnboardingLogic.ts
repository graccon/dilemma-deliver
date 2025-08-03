import { useEffect, useState } from "react";
import { getOnboarding } from "./onboardingSetting";
import type OnboardingCase from "../models/onboardingCase";
import { saveMissionStep, loadMissionStep } from "../stores/missionStepStorage";


export function useOnboardingLogic() {
    const [caseData, setCaseData] = useState<OnboardingCase | null>(null);
    const [missionStep, setMissionStepState] = useState<number>(() => loadMissionStep());

    useEffect(() => {
        const data = getOnboarding();
        setCaseData(data);
    }, []);

    const setMissionStep = (step: number) => {
        setMissionStepState(step);
        saveMissionStep(step);
    };

    const advanceMission = () => {
        setMissionStep(missionStep + 1);
    };

    return {
        caseData,
        missionStep,
        setMissionStep,
        advanceMission,
    };
}