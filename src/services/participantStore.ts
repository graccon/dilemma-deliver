import { create } from "zustand";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import type { Participant } from "../models/Participant";

interface ParticipantState {
  participants: Participant[];
  setParticipants: (data: Participant[]) => void;
}

export const useParticipantStore = create<ParticipantState>((set) => ({
  participants: [],
  setParticipants: (data) => set({ participants: data }),
}));

type SessionKey = "session1" | "session2";

async function fetchSessionLogs(
  participantId: string,
  sessionFlags: any
): Promise<Record<SessionKey, { logs: any[]; totalMs: number }>> {
  const result: Record<SessionKey, { logs: any[]; totalMs: number }> = {
    session1: { logs: [], totalMs: 0 },
    session2: { logs: [], totalMs: 0 },
  };

  const sessionConditions: { key: SessionKey; done: boolean }[] = [
    { key: "session1", done: sessionFlags.session1Done },
    { key: "session2", done: sessionFlags.session2Done },
  ];

  for (const { key, done } of sessionConditions) {
    if (!done) continue;

    try {
      const sessionRef = doc(db, `participants/${participantId}/sessions/${key}`);
      const sessionDoc = await getDoc(sessionRef);

      if (sessionDoc.exists()) {
        const data = sessionDoc.data();
        result[key].logs = data.logs || [];
        result[key].totalMs = data.totalMs || 0;
      }
    } catch (error) {
      console.error(`❗ ${participantId} - ${key} fetch failed:`, error);
    }
  }

  return result;
}

async function fetchSurveyAnswers(participantId: string, surveyFlags: any): Promise<{
    presurveyAnswers: any;
    postsurveyAnswers: any;
  }> {
    let presurveyAnswers = {};
    let postsurveyAnswers = {};
  
    if (surveyFlags.presurvey) {
      try {
        const presurveyRef = doc(db, `participants/${participantId}/surveys/presurvey`);
        const presurveyDoc = await getDoc(presurveyRef);
  
        if (presurveyDoc.exists()) {
          const data = presurveyDoc.data();
          presurveyAnswers = data.answers || {};
        } else {
          console.warn(`⚠️ ${participantId} - presurvey not founded`);
        }
      } catch (error) {
        console.error(`❗ ${participantId} - presurvey load error:`, error);
      }
    }
  
    if (surveyFlags.postsurvey) {
      try {
        const postsurveyRef = doc(db, `participants/${participantId}/surveys/postsurvey`);
        const postsurveyDoc = await getDoc(postsurveyRef);
  
        if (postsurveyDoc.exists()) {
          const data = postsurveyDoc.data();
          postsurveyAnswers = data.answers || {};
        } else {
          console.warn(`⚠️ ${participantId} - postsurvey not founded`);
        }
      } catch (error) {
        console.error(`❗ ${participantId} - postsurvey load error:`, error);
      }
    }
  
    return { presurveyAnswers, postsurveyAnswers };
  }


  export async function fetchParticipantData(): Promise<Participant[]> {
    const snapshot = await getDocs(collection(db, "participants"));
  
    const validDocs = snapshot.docs.filter((docSnap) => {
      const data = docSnap.data();
      return data?.meta?.studyId && data.meta.studyId !== "";
    });
  
    const promises = validDocs.map(async (docSnap) => {
      const id = docSnap.id;
      const baseData = docSnap.data();
  
      const prolificId = baseData.meta?.prolificId || id;
      const meta = baseData.meta || {};
      const sessionFlags = baseData.meta.sessionFlags || {};
      const surveyFlags = baseData.meta.surveyFlags || {};
  
      const sessionLogs = await fetchSessionLogs(id, sessionFlags);
  
      const { presurveyAnswers, postsurveyAnswers } = await fetchSurveyAnswers(id, surveyFlags);
  
      return {
        prolificId,
        meta,
        sessionFlags,
        surveyFlags,
        sessionLogs,
        presurveyAnswers,
        postsurveyAnswers,
      };
    });
  
    const participants = await Promise.all(promises);
    return participants;
  }