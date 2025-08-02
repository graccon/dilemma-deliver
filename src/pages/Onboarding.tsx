import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";

export default function Onboarding() {
  const { group, prolificId, sessionId } = useUserStore();

  useEffect(() => {
    if (!group) {
      console.warn("⚠️ group not loading.");
      return;
    }
  }, [group]);

  return (
    <MainLayout
      footerButton={<FooterButton label="Next" to="/session1" disabled={false} />}
    >
      <div>
        <h1>Hello this is onboarding page!</h1>
        <p>Group: {group || "(Not set)"}</p>
        <p>Prolific ID: {prolificId || "(Not set)"}</p>
        <p>Session ID: {sessionId || "(Not set)"}</p>

        <h1>Hello</h1>
      </div>
    </MainLayout>
  );
}
