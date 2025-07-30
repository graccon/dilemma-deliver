import styled from 'styled-components';
import colors from './colors';

export const textStyles = {
    h1: (color = colors.black) => `
      font-family: 'Abhaya Libre', serif;
      font-size: clamp(1.8rem, 5vw, 2.5rem);  
      font-weight: 800;
      letter-spacing: -0.5px;
      color: ${color};
    `,

    h2: (color = colors.black) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1.5rem;  
      font-weight: 400;
      letter-spacing: -0.2px;
      color: ${color};
    `,

    h3: ({color = colors.black, align = "left"}={}) => `
      font-family: 'Abhaya Libre', serif;
      font-size: clamp(2rem, 5vw, 2.4rem);  
      font-weight: 800;
      color: ${color};
      text-align: ${align};
    `,

    h4: ({color = colors.black, align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1.3rem;  
      font-weight: 400;
      letter-spacing: -0.2px;
      color: ${color};
      text-align: ${align};
    `,

    h5: ({color = colors.black, align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;  
      font-weight: 700;
      letter-spacing: -0.2px;
      color: ${color};
      text-align: ${align};
    `,
  
    body: (color = colors.black) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: ${color};
      line-height: 1.3;
      letter-spacing: -0.2px;
      text-align: left;
    `,

    span: ({color = colors.black, size = "0.9rem"}={}) => `
        font-family: 'Roboto', sans-serif;
        font-size: ${size};
        font-weight: 600;
        color: ${color};
        line-height: 1.3;
        letter-spacing: -0.2px;
        text-align: left;
    `,

    li: ({color = colors.black, align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: ${color};
      line-height: 1.4;
      letter-spacing: -0.2px;
      text-align: ${align};
  `,
  };



export const Heading = styled.h1<{ color?: string }>`
    ${({ color }) => textStyles.h1(color)}
`;

export const CaseTitle = styled.h2<{ color?: string }>`
    ${({ color }) => textStyles.h2(color)}
`;

export const OptionLabel = styled.h3<{ color?: string; align?: string }>`
  ${({ color, align }) => textStyles.h3({ color, align })}
`;

export const SilderTitle = styled.h4<{ color?: string; align?: string }>`
    ${({ color, align }) => textStyles.h4({color, align})}
`;

export const SecondTitle = styled.h5<{ color?: string; align?: string }>`
    ${({ color, align }) => textStyles.h5({color, align})}
`;

export const Li = styled.li<{ color?: string; align?: string }>`
${({ color, align }) => textStyles.li({ color, align })}
`;

export const Body = styled.p<{ color?: string }>`
    ${({ color }) => textStyles.body(color)}
`;

export const Span = styled.span<{ color?: string; size?: string }>`
  ${({ color, size }) => textStyles.span({ color, size })}
`;



