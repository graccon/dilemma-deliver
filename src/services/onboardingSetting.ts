import problem from "../assets/data/onboarding.json";
import type OnboardingCase from "../models/OnboardingCase";

export function getOnboarding(): OnboardingCase {
    return problem;
}