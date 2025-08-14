// src/stores/postsurveyStore.ts
const POSTSURVEY_KEY = "postsurvey-answers";

export type OpenEndedAnswers = {
  q1: string;
  q2: string;
  q3: string;
};

export type FeaturePreferenceAnswers = number[];

export type AfterAnswers = Record<string, number>;

export type PostsurveyData = {
  openEnded: OpenEndedAnswers;
  sliders: FeaturePreferenceAnswers;
  after: AfterAnswers;
};

export function getPostsurveyData(): PostsurveyData | null {
  const raw = localStorage.getItem(POSTSURVEY_KEY);
  return raw ? (JSON.parse(raw) as PostsurveyData) : null;
}

export function setPostsurveyData(data: PostsurveyData) {
  localStorage.setItem(POSTSURVEY_KEY, JSON.stringify(data));
}

export function clearPostsurveyData() {
  localStorage.removeItem(POSTSURVEY_KEY);
}