import styled from 'styled-components';
import colors from './colors';

export const textStyles = {
    h1: (color = colors.black) => `
      font-family: 'Abhaya Libre', serif;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: ${color};
    `,
  
    body: (color = colors.black) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: ${color};
    `
  };


export const Heading = styled.h1<{ color?: string }>`
    ${({ color }) => textStyles.h1(color)}
`;

export const Body = styled.p<{ color?: string }>`
    ${({ color }) => textStyles.body(color)}
`;