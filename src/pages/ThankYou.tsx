import { useState } from "react";
import FooterButton from "../components/FooterButton";
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa"; 
import colors from "../styles/colors";

const CODE = import.meta.env.VITE_COMPLETE_CODE; 

export default function ThankYou() {

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  
    return (
      <MainLayout
              currentStep={5}
              footerButton={
                <FooterButton label="Return to Prolific" to="/onboarding" disabled={false} />
              }
            >
        <Container>
          <PageTitle>Thank you for participating!</PageTitle>
          <Description>
          You’ve reached the end of the study. We really appreciate your time and thoughtful responses. <br />
            Please copy the completion code below and submit it on Prolific to complete the study.</Description>
          
            <CompleteCodeContainer>
              <CopyButtonWrapper>
                {copied && <CopiedText>Copied!</CopiedText>}
                <CopyButton onClick={copyToClipboard} aria-label="Copy code">
                  <FaRegCopy color={colors.gray500}/>
                </CopyButton>
              </CopyButtonWrapper>

              <Code>{CODE}</Code>
            </CompleteCodeContainer>
            
          
          
          
        </Container>
          
      </MainLayout>

    )
  }

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  max-width: 1024px;
  overflow-y: auto;
  height: 78vh;
  background-color: orange;
`;

export const PageTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const Description = styled.p`
  ${textStyles.homeBody()};
  padding-bottom: 1rem;
`;

export const CompleteCodeContainer = styled.div`
  position: relative; 
  padding: 1.3rem;
  background-color: ${colors.gray300};
  width: 300px;
  border-radius: 1rem;
  display: flex;
  flex-direction: column; /* 위/아래 배치 */
  align-items: center;
`;


export const Code = styled.h2`
  ${textStyles.h2()};
  width: 200px;
  text-align: center;
`;

export const CopyButtonWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

export const CopiedText = styled.span`
  ${textStyles.mentionTag()};
  color: ${colors.gray500};
`;