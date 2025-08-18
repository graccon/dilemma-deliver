import MoralCase from "../models/MoralCase";
import styled from "styled-components";
import { CaseTitle } from "../styles/textStyles";
import Spacer from "./Spacer";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

type Props = {
  caseData: MoralCase;
  index?: number; 
  total?: number;
  mode?: DisplayMode;
};

type DisplayMode = "ChatWith" | "CaseOnly" ;

export default function MoralCaseDisplay({ caseData, index, total, mode="CaseOnly"}: Props) {
    const isCaseOnly = mode === "CaseOnly"; 

    return (
      <Container>
        <ContentContainer>
            <TittleWrapper>
                <CaseTitle>
                    What should the self-driving car do?{" "}
                    {index !== undefined && total && `(${index + 1} / ${total})`}
                </CaseTitle>
                {mode === "ChatWith" && <SubTitle>Choose A or B, then like the speech bubble you find most convincing.</SubTitle>}
            </TittleWrapper>
            <Grid>
            <Option>
                <ImageWrapper>
                    <DescriptionContainer>
                        <OptionLabel $align="right">A</OptionLabel>
                        {isCaseOnly && <Body>{caseData.A.description}</Body>}
                        <DeadWrapper $align="flex-end">
                        <Body>Dead :</Body>   
                        <DeadListWrapper>
                            <DeathList>
                            {caseData.A.deaths.map((d, idx) => (
                                <Li key={idx}>• {d}</Li>
                            ))}
                            </DeathList>
                        </DeadListWrapper>  
                    </DeadWrapper> 
                    </DescriptionContainer>

                    <Image src={caseData.A.image} alt="Option A" />
                    
                </ImageWrapper>

                <BottomDescriptionContainer>  
                    <Spacer height="2rem"/>
                    <Body>{caseData.A.note}</Body>
                </BottomDescriptionContainer>
            </Option>
            
            <Option>
                <ImageWrapper>
                    <Image src={caseData.B.image} alt="Option B" />
                    <DescriptionContainer>
                        <OptionLabel>B</OptionLabel>
                        {isCaseOnly && <Body>{caseData.B.description}</Body>}
                        <DeadWrapper >
                            <Body>Dead :</Body>
                                <DeadListWrapper>
                                    <DeathList>
                                    {caseData.B.deaths.map((d, idx) => (
                                        <Li key={idx}>• {d}</Li>
                                    ))}
                                    </DeathList>
                                </DeadListWrapper>  
                            </DeadWrapper>
                    </DescriptionContainer>
                </ImageWrapper>

            <BottomDescriptionContainer>     
                <Spacer height="2rem"/>
                <Body>{caseData.B.note}</Body>
            </BottomDescriptionContainer>
                
            </Option>
            </Grid>
        </ContentContainer>
      </Container>
    );
  }

export const Container = styled.div`
    padding: 1rem 0.5rem;
    text-align: center;
    height: 100%;
`;

export const ContentContainer = styled.div`
    width: 100%;
    margin: 0 auto;
`;

export const TittleWrapper = styled.div`
  width: 100%;
  padding: 16px 0px 0px 0px;
`;

export const SubTitle = styled.p`
  ${textStyles.li({ color: colors.gray600, align: "center" })};
  margin: 6px 0px;
`;

export const Option = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 10px;
  max-width: 600px;
`;

export const Grid = styled.div`
  display: flex;
  justify-content:space-evenly;
  gap: 1rem; 
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const OptionLabel = styled.h3<{ $align?: "left" | "right" | "center" }>`
  ${({ $align = "left" }) => textStyles.h3({ $align })}
  width: 100%;
  padding: 0.5rem 0rem;
`;

export const DeadWrapper = styled.div<{ $align?: "flex-start" | "flex-end" | "center" }>`
    display: flex;
    flex-direction: row;
    justify-content: ${({ $align = "flex-start" }) => $align}; 
`;

export const DeadListWrapper = styled.div`  
    justify-content:"flex-start";
`;

export const Body = styled.p`  
    min-width: 40px;
    ${textStyles.body()}
`;

export const Li = styled.li`  
    ${textStyles.li()}
    font-weight: 600;
`;

export const ImageWrapper= styled.div`
    display: flex;
    flex-direction: row;
`;

export const DescriptionContainer= styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0px 20px;
    justify-content:"flex-start";
`;

export const BottomDescriptionContainer= styled.div`
    padding: 0px 30px;
`;

export const Image = styled.img`
   height: 15rem; 
   object-fit: contain;
`;

export const DeathList = styled.ul`
  list-style: none;
  padding-left: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
`;