import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";

export default function Session1() {
    return (
      <MainLayout
            footerButton={
              <FooterButton label="Next" to="/session2" disabled={false} />
            }
          >
            <div>
              <h1>Hello this is Session1 page!</h1>
            </div>
        </MainLayout>
    )
  }