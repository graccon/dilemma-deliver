import type { Participant } from '../models/Participant';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';
import AgeHistogram from './AgeHistogram';
import GenderDonutChart from './GenderDonutChart';

function isParticipantCompleted(participant: any): boolean {
    const { meta = {}, surveyFlags = {}, sessionFlags = {} } = participant;
  
    return (
      surveyFlags.presurvey &&
      meta.onboardingFlags &&
      sessionFlags.session1Done &&
      sessionFlags.session2Done &&
      surveyFlags.postsurvey
    );
  }

  function extractDemographicData(participants: any[]) {
    const result: {
      group: number;
      prolificId: string;
      gender: string;
      age: number;
      education: string;
      nationality: string;
    }[] = [];
  
    for (const p of participants) {
      if (isParticipantCompleted(p) && p.presurveyAnswers) {
        const {
          demographic_1: gender,
          demographic_2: age,
          demographic_3: education,
          demographic_4: nationality,
        } = p.presurveyAnswers;
  
        const group = p.meta.group;          
        const prolificId = p.prolificId; 
  
        result.push({
          group,
          prolificId,
          gender,
          age,
          education,
          nationality,
        });
      }
    }
  
    return result;
  }

interface demographicDashboardProps {
    participants: Participant[];
}

const DemographicDashboard: React.FC<demographicDashboardProps> = ({ participants }) => {

    const demographics = extractDemographicData(participants);

    return (
        <Container>
            <SummaryBox>
                <AgeHistogram data={demographics.map((d) => ({ age: d.age }))} />
                <GenderDonutChart data={demographics.map((d) => ({ gender: d.gender }))} />

            </SummaryBox>
        {demographics.map((item, index) => (
            <div key={index}>
            <p>{`#${index + 1} | ${item.group} ${item.prolificId} ${item.gender}, ${item.age}, ${item.education}, ${item.nationality}`}</p>
            </div>
        ))}
        </Container>
    );
}

export default DemographicDashboard;

const Container = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
`;
const SummaryBox = styled.div`:
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0rem 1rem;
  width: 100%;
  border-radius: 8px;
  ${textStyles.homeBody()}
`;