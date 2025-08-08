import styled from 'styled-components';
import type { ReactNode } from 'react';
import colors from "../styles/colors"; 
import ProgressSteps from '../components/ProgressSteps';
import { textStyles } from "../styles/textStyles";

interface Props {
  children: ReactNode;
  footerButton?: ReactNode;
  currentStep?: number;
}

export default function MainLayout({ children, footerButton, currentStep }: Props) {
  return (
    <Container>
        <HeaderContainer>
            <Heading>Dilemma Deliver</Heading>
            {currentStep !== undefined && <ProgressSteps currentStep={currentStep} />} 
        </HeaderContainer>
      <Main>{children}</Main>
      <FooterContainer>{footerButton}</FooterContainer>
    </Container>
  );
}

const Heading = styled.h1`
    ${textStyles.h1()};
    flex: 1;
    padding-top: 0.8rem;
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.gray100};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px; 
  width: 100%;
  margin: 0 auto;
  padding: 0rem 0.8rem 0 3.6rem;

`

const Main = styled.main`
  flex: 1;
  padding: 0;
  max-width: 1200px; 
  width: 100%;
  height: 100%; 
  margin: 0 auto;
`;

const FooterContainer = styled.footer`
  padding: 0.85rem 1.4rem;
  display: flex;
  flex-row: column;
  text-align: center;
  color: #666;
  justify-content: flex-end;
//   justify-content: space-around;
  background-color: ${colors.black};
`;
