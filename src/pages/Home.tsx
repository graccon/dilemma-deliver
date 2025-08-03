import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";


export default function Home() {
  const [searchParams] = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    localStorage.clear(); // 전체 삭제
    localStorage.removeItem("chatLog_case_1");
  }, []);

  useEffect(() => {
    const group = searchParams.get("group") || "";
    const prolificId = searchParams.get("prolific_id") || "";
    const sessionId = searchParams.get("session_id") || "";

    setUser(group, prolificId, sessionId);
  }, [searchParams, setUser]);;

  return (
    <MainLayout
      footerButton={
        <FooterButton label="Next" to="/onboarding" disabled={false} />
      }
    >
      <p>this is wellcoming page! </p>
    </MainLayout>
  )
}