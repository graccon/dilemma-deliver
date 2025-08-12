import styled from 'styled-components';
import colors from './colors';

export const textStyles = {
    h1: (color = colors.black) => `
      font-family: 'Abhaya Libre', serif;
      font-size: clamp(1.6rem, 5vw, 2.4rem);  
      font-weight: 800;
      letter-spacing: -0.5px;
      color: ${color};
    `,

    secondH1: () => `
    font-family: 'Abhaya Libre', serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: ${colors.black};
`,

    h2: (color = colors.gray800) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;  
      font-weight: 400;
      letter-spacing: -0.2px;
      color: ${color};
    `,

    h3: ({color = colors.gray800, $align = "left"}={}) => `
      font-family: 'Abhaya Libre', serif;
      font-size: 2rem;
      font-weight: 800;
      color: ${color};
      text-align: ${$align};
    `,

    OnboardingCaseLabel: ({color = colors.gray800, $align = "left"}={}) => `
      font-family: 'Abhaya Libre', serif;
      font-size: 3rem;
      font-weight: 800;
      color: ${color};
      text-align: ${$align};
    `,

    h4: ({color = colors.gray800, align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1.1rem;  
      font-weight: 400;
      letter-spacing: -0.2px;
      color: ${color};
      text-align: ${align};
    `,

    h5: ({color = colors.gray800, $align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;  
      font-weight: 700;
      letter-spacing: -0.2px;
      color: ${color};
      text-align: ${$align};
    `,

    mainTitle: ({color = colors.gray800, align = "left"}={}) => `
    font-family: 'Roboto', sans-serif;
    font-size: 1.4rem;  
    font-weight: 700;
    letter-spacing: -0.2px;
    color: ${color};
    text-align: ${align};
  `,
  
    body: (color = colors.black) => `
      font-family: 'Roboto', sans-serif;
      font-size: 0.9rem;
      font-weight: 400;
      color: ${color};
      line-height: 1.3;
      letter-spacing: -0.2px;
      text-align: left;
    `,

    homeBody: () => `
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.4;
      letter-spacing: -0.3px;
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

    nameTag: ({ color = colors.gray800, size = "0.8rem" } = {}) => `
        font-family: 'Roboto', sans-serif;
        font-size: ${size};
        font-weight: 500;
        color: ${color};
        letter-spacing: -0.2px;
        text-align: left;
    `,

    labelTag: ({ color = colors.gray800, size = "1.2rem" } = {}) => `
        font-family: 'Roboto', sans-serif;
        font-size: ${size};
        font-weight: 600;
        color: ${color};
        letter-spacing: -0.2px;
    `,

    mentionTag: () => `
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: ${colors.gray700};
`,

    replyLabel: () => `
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 1 rem;
        color: ${colors.gray700};
    `,

    li: ({color = colors.black, align = "left"}={}) => `
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      font-weight: 400;
      color: ${color};
      line-height: 1.4;
      letter-spacing: -0.2px;
      text-align: ${align};
  `,

  bubbleText: () => `
    font-family: 'Roboto', sans-serif;
    font-size: 1 rem;
    font-weight: 400;
    line-height: 1.35;
    color: ${colors.gray800};
    letter-spacing: -0.2px;
  `,

  replyReferenceText: () => `
    font-size: 0.9rem;
    font-weight: 400;
    font-style: italic;
    letter-spacing: -0.2px;
    color: ${colors.gray500};
  `,

  buttonLabel: ({ color = colors.gray800, size = "1.2rem" } = {}) => `
  font-family: 'Roboto', sans-serif;
  font-size: ${size};
  font-weight: 500;
  color: ${color};
`,
  };


export const CaseTitle = styled.h2<{ color?: string }>`
    ${({ color }) => textStyles.h2(color)}
`;
export const SilderTitle = styled.h4<{ color?: string; align?: string }>`
    ${({ color, align }) => textStyles.h4({color, align})}
`;
export const SecondTitle = styled.h5<{ color?: string; $align?: string }>`
    ${({ color, $align }) => textStyles.h5({color, $align})}
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



