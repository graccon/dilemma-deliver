import MoralCase from "../models/MoralCase";
import styled from "styled-components";
import { CaseTitle, OptionLabel, Body, Li } from "../styles/textStyles";
import Spacer from "./Spacer";

type Props = {
  caseData: MoralCase;
  index?: number; 
  total?: number;
};

export default function MoralCaseDisplay({ caseData, index, total }: Props) {
    return (
      <Container>
        <ContentContainer>
            <CaseTitle>
                What should the self-driving car do?{" "}
            {index !== undefined && total && `(${index + 1} / ${total})`}
            </CaseTitle>
            <Grid>
            <Option>
                <DescriptionContainer>
                    <OptionLabel align="right">A</OptionLabel>
                    <DefaultDescrition>
                        <Body>{caseData.A.description}</Body>
                        <Spacer height="0.5rem" />
                        <Body>Dead :</Body>
                        <DeathList>
                        {caseData.A.deaths.map((d, idx) => (
                            <Li key={idx}>• {d}</Li>
                        ))}
                        </DeathList>
                        <Spacer height="0.5rem" />
                        <Body>{caseData.A.note}</Body>
                    </DefaultDescrition>
                </DescriptionContainer>
                <Image src={caseData.A.image} alt="Option A" />
            </Option>
            
            <Option>
            <Image src={caseData.B.image} alt="Option B" />
            <DescriptionContainer>
                <OptionLabel>B</OptionLabel>
                <DefaultDescrition>
                    <Body>{caseData.B.description}</Body>
                    <Spacer height="0.5rem" />
                <Body>Dead :</Body>
                <DeathList>
                {caseData.B.deaths.map((d, idx) => (
                    <Li key={idx}>• {d}</Li>
                ))}
                </DeathList>
                <Spacer height="0.5rem" />
                <Body>{caseData.B.note}</Body>
                </DefaultDescrition>
            </DescriptionContainer>
                
            </Option>
            </Grid>
        </ContentContainer>
      </Container>
    );
  }


export const DefaultDescrition = styled.div`
    @media (max-width: 960px) {
        display: none;
    }
`

export const Container = styled.div`
    padding: 0.6rem;
    text-align: center;
    height: 100%;
`;

export const ContentContainer = styled.div`
    width: 100%;
    margin: 0 auto;
`;

export const Grid = styled.div`
  display: flex;
  justify-content:space-evenly;
  gap: 1rem; 
  flex-wrap: wrap;
  margin-top: 0.8rem;
`;

export const Option = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1 1 10px;
    max-width: 600px; 
`;

export const DescriptionContainer= styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 1.2rem; 
`;

export const Image = styled.img`
   height: 18rem; 
   object-fit: contain;
`;

export const DeathList = styled.ul`
  list-style: none;
  padding-left: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
`;