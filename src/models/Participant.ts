// src/models/Participant.ts

import type { PostsurveyData } from "../stores/postsurveyStore";
import type { SurveyAnswers } from "../stores/presurveyStore";
import type { SessionLog } from "../stores/sessionLogStore";

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

  sessionLogs?: SessionLog[];
  presurveyAnswers?: SurveyAnswers;
  postsurveyAnswers?: PostsurveyData;
}