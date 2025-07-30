import styled from "styled-components";

type Props = {
  height?: string;
  width?: string;
};

const Spacer = styled.div<Props>`
  height: ${({ height }) => height || "0"};
  width: ${({ width }) => width || "0"};
  flex-shrink: 0;
`;

export default Spacer;