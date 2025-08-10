import FooterButton from "../components/FooterButton";
import MainLayout from "../layouts/MainLayout";

export default function ThankYou() {
    const completionCode = "ABC12345";
    return (
      <MainLayout
              currentStep={5}
              footerButton={
                <FooterButton label="Return to Prolific" to="/onboarding" disabled={false} />
              }
            >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Thank you for participating!</h1>
          <p>Please copy the completion code below and submit it on Prolific to complete the study.</p>
          
          <h2 style={{ margin: "1rem 0", color: "#333" }}>{completionCode}</h2>
          
          <p>Your responses have been recorded and will be kept confidential.</p>
        </div>
          
      </MainLayout>

    )
  }