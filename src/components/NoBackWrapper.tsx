import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  children: React.ReactNode;
}

export default function NoBackWrapper({ children }: Props) {
  const location = useLocation();

  useEffect(() => {
    // 현재 페이지 상태 푸시
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      toast.warning("이전 페이지로 돌아갈 수 없습니다.");
      // 뒤로가기를 무효화
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);

  return <>{children}</>;
}