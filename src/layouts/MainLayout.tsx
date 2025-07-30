import styled from 'styled-components';
import type { ReactNode } from 'react';
import { Heading } from "../styles/textStyles"
import colors from "../styles/colors"; 

interface Props {
  children: ReactNode;
  footerButton?: ReactNode;
}

export default function MainLayout({ children, footerButton }: Props) {
  return (
    <Container>
        <HeaderContainer>
            <Heading>Dilemma Deliver</Heading>
        </HeaderContainer>
        
      <Main>{children}</Main>
      <FooterContainer>{footerButton}</FooterContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.gray100};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1400px; 
  width: 100%;
  margin: 0 auto;
  background-color: yellow;
  padding: 18px 48px;
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1400px; 
  width: 100%;
  background-color: orange;
  margin: 0 auto;
`;

const FooterContainer = styled.footer`
  padding: 1.3rem;
  display: flex;
  flex-row: column;
  text-align: center;
  color: #666;
  justify-content: flex-end;
//   justify-content: space-around;
  background-color: ${colors.black};
`;

const Help = styled.div`
  width: 100%;
`