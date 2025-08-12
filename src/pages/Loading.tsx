import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 25); // ~2.5s total
    return () => clearInterval(id);
  }, []);

  return (
    <MainLayout currentStep={0}>
      <Container>
        <StyledImage src="/assets/images/loading_image_2.png" alt="loading" />
        <SliderWrap>
          <ProgressSlider
            type="range"
            min={0}
            max={100}
            value={progress}
            readOnly
            disabled
          />
          <Percent>{progress}%</Percent>
        </SliderWrap>
        <PageSecondTitle>Loading…</PageSecondTitle>
      </Container>
    </MainLayout>
  );
}

/* layout */
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
`;

/* wobble image */
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

/* slider */
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

const ProgressSlider = styled.input.attrs({ })<{ value: number }>`
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
    width: 0; height: 0; /* hide thumb for a clean loading bar look */
  }
  &::-moz-range-thumb { width: 0; height: 0; }

  /* subtle shimmer while loading */
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