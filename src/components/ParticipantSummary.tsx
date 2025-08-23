import type { Participant } from "../models/Participant";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

interface Props {
  participant: Participant;
}

const ParticipantSummary: React.FC<Props> = ({ participant }) => {
  return (
    <Wrapper>
      <Cell>Group <Value>{participant.meta.group}</Value></Cell>
      <Cell>Onboarding <Value>{participant.meta.onboardingFlags ? "✅" : "❌"}</Value></Cell>
      <Cell>Session 1 <Value>{participant.sessionFlags.session1Done ? "✅" : "❌"}</Value></Cell>
      <Cell>Session 2 <Value>{participant.sessionFlags.session2Done ? "✅" : "❌"}</Value></Cell>
      <Cell>Pre-Survey <Value>{participant.surveyFlags.presurvey ? "✅" : "❌"}</Value></Cell>
      <Cell>Post-Survey <Value>{participant.surveyFlags.postsurvey ? "✅" : "❌"}</Value></Cell>
    </Wrapper>
  );
};

export default ParticipantSummary;

const Wrapper = styled.div`
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const Cell = styled.div`
  background-color: ${colors.white};
  ${textStyles.dashboardBody()}
  flex: 1;
  display: flex;  

  align-items: center;       
  justify-content: center;
  padding: 1rem 0rem;
  border-radius: 0.5rem;
  flex-direction: column;
`;

const Value = styled.div`
  padding-top: 12px;
  border-radius: 0.5rem;
  display: flex;       
  align-items: center;       
  justify-content: center;
`;