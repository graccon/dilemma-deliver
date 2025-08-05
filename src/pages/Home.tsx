import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useUserStore } from "../stores/useUserStore";
import MainLayout from "../layouts/MainLayout";
import FooterButton from "../components/FooterButton";
import { ScrollSection, ScrollPageStyled } from "../components/ScrollSection";
import HomeTopPage from "../components/HomeTopPage";
import HomeBottomPage from "../components/HomeBottomPage";
import ScrollDownHint from "../components/ScrollDownHint";


export default function Home() {
  const [searchParams] = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);
  const [showHint, setShowHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.clear(); 
    localStorage.removeItem("chatLog_case_1");
  }, []);

  useEffect(() => {
    const group = searchParams.get("group") || "";
    const prolificId = searchParams.get("prolific_id") || "";
    const sessionId = searchParams.get("session_id") || "";

    setUser(group, prolificId, sessionId);
  }, [searchParams, setUser]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = scrollRef.current?.scrollTop ?? 0;
      if (scrollY > 50) {
        setShowHint(false);
      } else {
        setShowHint(true);
      }
    };
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <MainLayout
      footerButton={
        <FooterButton label="Start Survey" to="/onboarding" disabled={showHint} />
      }
    >
      <ScrollSection ref={scrollRef}>
        <ScrollPageStyled>
          <HomeTopPage />
        </ScrollPageStyled>
        <ScrollPageStyled>
          <HomeBottomPage />
        </ScrollPageStyled>
        {showHint && <ScrollDownHint />}
      </ScrollSection>
    </MainLayout>
  )
}