import problem from "../assets/data/onboarding.json";
import type OnboardingCase from "../models/onboardingCase";

export function getOnboarding(): OnboardingCase {
    return problem;
}