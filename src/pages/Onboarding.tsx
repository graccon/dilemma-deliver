import { useUserStore } from "../stores/useUserStore";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";

export default function Onboarding() {
    const { group, prolificId, sessionId } = useUserStore();

    return (
        <MainLayout
              footerButton={
                <FooterButton label="Next" to="/session1" disabled={false} />
              }
            >
              <div>
                <h1>Hello this is onboarding page!</h1>

                <p>Group: {group}</p>
                <p>Prolific ID: {prolificId}</p>
                <p>Session ID: {sessionId}</p>
            </div>
        </MainLayout>
    
    )
  }