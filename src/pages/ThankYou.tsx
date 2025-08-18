import { useState } from "react";
import FooterButton from "../components/FooterButton";
import MainLayout from "../layouts/MainLayout";
import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import { FaRegCopy } from "react-icons/fa"; 
import colors from "../styles/colors";


export default function ThankYou() {

  const [copied, setCopied] = useState(false);

  const INDEX_KEY = import.meta.env.VITE_REDIRECT_URL;
  const CODE = import.meta.env.VITE_COMPLETE_CODE; 

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
                <FooterButton label="Return to Prolific" to={INDEX_KEY} disabled={false} />
              }
            >
        <Container>
          <PageTitle>Thank you for participating!</PageTitle>
          <Description>
            You’ve reached the end of the study. We really appreciate your time and thoughtful responses. <br />
            Please copy the completion code below and submit it on Prolific to complete the study.
          </Description>
          
          <CompleteCodeContainer>
            <CopyButtonWrapper>
              {copied && <CopiedText>Copied!</CopiedText>}
              <CopyButton onClick={copyToClipboard} aria-label="Copy code">
                <FaRegCopy color={colors.gray500}/>
              </CopyButton>
            </CopyButtonWrapper>

            <Code>{CODE}</Code>
          </CompleteCodeContainer>

          <BottomContainer>
            <Column>
              <PageSecondTitle>Data & privacy</PageSecondTitle>
              <Description>Your responses are stored securely and used only for research. 
                Data are fully anonymized and may be reported in aggregate. 
                If you’d like to withdraw your data, contact us at 
                  <MailWrapper>
                    <a href="mailto:gye0203@o.cnu.ac.kr" style={{ color: colors.gray800, textDecoration: "underline" }}>
                    gye0203@o.cnu.ac.kr </a> 
                  </MailWrapper>
                within 7 days using your Prolific ID.</Description>
            </Column>
            <Column>
              <PageSecondTitle>Optional feedback</PageSecondTitle>
              <Description>We’d love to hear how the experience felt. If you have comments or spot bugs, drop us a note on Prolific. Thanks again for helping our research move forward!
                <br />— The Research Team
              </Description>
            </Column>
          </BottomContainer>
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
  align-items: center;
  padding: 32px 0px;
`;

export const PageTitle = styled.div`
  ${textStyles.h1()};
  padding: 1rem 0rem;
`;

export const PageSecondTitle = styled.div`
  ${textStyles.secondH1()};
  padding: 1rem 0rem;
`;

export const Description = styled.p`
  ${textStyles.homeBody()};
  padding-bottom: 1rem;
`;

export const MailWrapper = styled.span`
  ${textStyles.homeBody()};
  margin: 0px 4px;
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
  margin-top: 20px;
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

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  padding: 0rem 3rem;
  margin-top: 40px;
`;

export const Column = styled.div`ㅛ
  display: flex;
  flex-direction: column;
  flex: 1;
`;