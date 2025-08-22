// src/models/Participant.ts

import type { PostsurveyData } from "../stores/postsurveyStore";
import type { SurveyAnswers } from "../stores/presurveyStore";
import type { SessionLog } from "../stores/sessionLogStore";

type SessionKey = "session1" | "session2";

export interface SessionLogData {
  logs: SessionLog[];
  totalMs: number;
}

export interface Participant {
  prolificId: string;

  meta: {
    group: string;
    sessionId: string;
    studyId: string;
    onboardingFlags: boolean;
    lastSeenTs?: number;
    signupTs?: number;
    totalExperimentMs?: number;
  };

  sessionFlags: {
    session1Done: boolean;
    session2Done: boolean;
  };

  surveyFlags: {
    presurvey: boolean;
    postsurvey: boolean;
  };

  sessionLogs?: Record<SessionKey, SessionLogData>;  // <- 여기!
  presurveyAnswers?: SurveyAnswers;
  postsurveyAnswers?: PostsurveyData;
}