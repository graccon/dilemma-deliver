import { useUserStore } from "../stores/useUserStore";

export default function Onboarding() {
    const { group, prolificId, sessionId } = useUserStore();

    return (
      <div>
        <h1>Hello this is onboarding page!</h1>

        <p>Group: {group}</p>
        <p>Prolific ID: {prolificId}</p>
        <p>Session ID: {sessionId}</p>
      </div>
    )
  }