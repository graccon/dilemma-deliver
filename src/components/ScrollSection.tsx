import styled from "styled-components";
import { forwardRef } from "react";

const ScrollWrapper = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  width: 100%;
  max-width: 1024px;
  height: calc(100vh - 9rem);
  margin: 0 auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
`;

const ScrollPage = styled.div`
  scroll-snap-align: start;
  min-height: 100%;
  height: 100%;
  padding: 1rem 4rem;
  box-sizing: border-box;
`;

export const ScrollSection = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return <ScrollWrapper ref={ref}>{children}</ScrollWrapper>;
  }
);

export const ScrollPageStyled = ScrollPage;