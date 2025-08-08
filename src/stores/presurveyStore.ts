// src/stores/presurveyStore.ts
const PRESURVEY_KEY = "presurvey-answers";

export type SurveyAnswers = {
  [questionId: string]: number;
};

export function getPresurveyAnswers(): SurveyAnswers | null {
  const raw = localStorage.getItem(PRESURVEY_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setPresurveyAnswers(data: SurveyAnswers) {
  localStorage.setItem(PRESURVEY_KEY, JSON.stringify(data));
}

export function clearPresurveyAnswers() {
  localStorage.removeItem(PRESURVEY_KEY);
}