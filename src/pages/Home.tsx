import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heading } from "../styles/textStyles"
import { useUserStore } from "../stores/useUserStore";

export default function Home() {
  const [searchParams] = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const group = searchParams.get("group") || "";
    const prolificId = searchParams.get("prolific_id") || "";
    const sessionId = searchParams.get("session_id") || "";

    setUser(group, prolificId, sessionId);
  }, [searchParams, setUser]);;

  return (
    <div>
      <Heading>Dilemma Deliver</Heading>
    </div>
  )
}