// components/Loading.tsx
import { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";
import type { LoadingProps } from "../models/loading";
import { useNavigate } from "react-router-dom";

export default function Loading({
  steps = [],
  minDurationMs = 1200,
  nextTo,
  onProgress,
  onComplete,
}: LoadingProps) {
  const navigate = useNavigate();
  const [targetPct, setTargetPct] = useState(0); // 논리적 목표 진행률
  const [uiPct, setUiPct] = useState(0);         // 화면 표시 진행률

  // 총 가중치
  const totalWeight = useMemo(
    () => steps.reduce((s, st) => s + (st.weight ?? 1), 0),
    [steps]
  );

  // 스텝 실행
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const start = performance.now();

    (async () => {
      let acc = 0;

      for (const step of steps) {
        if (!mounted) break;
        try {
          await step.run(controller.signal);
        } catch (e) {
          // 실패 정책: 일단 로깅 후 계속 진행
          console.error("[loading step error]", step.label, e);
        }
        acc += (step.weight ?? 1);
        const pct = Math.round((acc / totalWeight) * 100);
        setTargetPct(pct);
        onProgress?.(pct, step.label);
      }

      // 최소 노출 시간 보장
      const elapsed = performance.now() - start;
      const remain = Math.max(0, minDurationMs - elapsed);
      await new Promise((r) => setTimeout(r, remain));

      setTargetPct(100);
      onProgress?.(100, "complete");

      if (mounted) {
        onComplete?.();
        if (nextTo) navigate(nextTo);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [steps, totalWeight, minDurationMs, nextTo, onProgress, onComplete, navigate]);

  // UI 진행률을 부드럽게 목표에 수렴
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setUiPct((prev) => {
        const diff = targetPct - prev;
        if (Math.abs(diff) < 0.3) return targetPct;
        // 남은 차이에 비례 + 최소 속도
        const step = Math.max(0.5, Math.abs(diff) * 0.12);
        return prev + Math.sign(diff) * step;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetPct]);

  let message;
  switch (nextTo) {
    case "/session1":
      message = "Session 1 is about to begin...";
      break;
    case "/session2":
      message = "Session 2 is about to begin...";
      break;
    default:
      message = "Loading…";
      break;
  }

  return (
    <MainLayout currentStep={0}>
      <Container>
        <StyledImage src="/assets/images/loading_image_1.png" alt="loading" />
        <SliderWrap>
          <ProgressSlider
            type="range"
            min={0}
            max={100}
            value={uiPct}
            readOnly
            disabled
          />
          <Percent>{Math.round(uiPct)}%</Percent>
        </SliderWrap>
        <PageSecondTitle>{message}</PageSecondTitle>
     
      </Container>
    </MainLayout>
  );
}

/* ===== styles ===== */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  max-width: 1024px;
  overflow-y: auto;
  height: 78vh;
  align-items: center;
  padding: 32px 0;
`;

const PageSecondTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1.8rem 0 1rem;
  color: ${colors.gray800};
`;

const tilt = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

const StyledImage = styled.img`
  flex-shrink: 0;
  width: 580px;
  margin: 0 auto;
  animation: ${tilt} 1s ease-in-out infinite;
  transform-origin: center center;
`;

const SliderWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 8px 12px;
  width: min(300px, 100%);
  align-items: center;
  margin-top: 30px;
`;

const Percent = styled.div`
  ${textStyles.body()};
  color: ${colors.gray700};
  grid-column: 2 / 3;
`;

const ProgressSlider = styled.input.attrs({})<{ value: number }>`
  grid-column: 1 / 3;
  width: 100%;
  height: 12px;
  border-radius: 999px;
  appearance: none;
  background: ${({ value }) => {
    const pct = Math.max(0, Math.min(100, value));
    return `linear-gradient(to right, ${colors.gray800} 0%, ${colors.gray800} ${pct}%, ${colors.gray300} ${pct}%, ${colors.gray300} 100%)`;
  }};
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 0;
    height: 0; /* thumb 숨김: 로딩바처럼 보이게 */
  }
  &::-moz-range-thumb { width: 0; height: 0; }

  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.35) 40%,
      transparent 60%
    );
    transform: translateX(-100%);
    animation: shimmer 1.2s linear infinite;
    pointer-events: none;
  }
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`;