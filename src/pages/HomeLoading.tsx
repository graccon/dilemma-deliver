import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import Loading from "./Loading";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import type { LoadingStep } from "../models/loading";

async function checkParticipantCompletion(): Promise<boolean> {
  const { prolificId } = useUserStore.getState();
  const docRef = doc(db, "participants", prolificId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return false;

  const data = docSnap.data();
  const { sessionFlags = {}, surveyFlags = {} } = data.meta || {};

  return (
    sessionFlags.session1Done &&
    sessionFlags.session2Done &&
    surveyFlags.presurvey &&
    surveyFlags.postsurvey
  );
}

export default function HomeLoading() {
  const [checked, setChecked] = useState(false);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkParticipantCompletion().then((done) => {
      setIsComplete(done);
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return <div>Checking status...</div>; 
  }

  const steps: LoadingStep[] = [
    {
      label: "check-completion",
      run: async () => {
        await new Promise((r) => setTimeout(r, 1000));
      },
    },
  ];

  return (
    <Loading
      steps={steps}
      minDurationMs={3000}
      nextTo={isComplete ? "/thankyou" : "/presurvey"}
      onProgress={() => {
        }}
        onComplete={() => {
        }}
    />
  );
}