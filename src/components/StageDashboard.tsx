import AdminProgressMatrix from './AdminProgressMatrix';
import type { Participant } from '../models/Participant';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';
import ParticipantExperimentTable from './ParticipantExperimentTable';

function countParticipants(participants: any[]) {
    let total = 0;
    let completed = 0;
  
    for (const p of participants) {
      total += 1;
  
      const { meta = {}, surveyFlags = {}, sessionFlags = {} } = p;
  
      const isCompleted =
        surveyFlags.presurvey &&
        meta.onboardingFlags &&
        sessionFlags.session1Done &&
        sessionFlags.session2Done &&
        surveyFlags.postsurvey;
  
      if (isCompleted) {
        completed += 1;
      }
    }
    return { total, completed };
}

type SessionKey = "session1" | "session2";

function getAverageSessionDurations(participants: Participant[]) {
  const durations: Record<SessionKey, { total: number; count: number }> = {
    session1: { total: 0, count: 0 },
    session2: { total: 0, count: 0 },
  };

  for (const p of participants) {
    const logs = p.sessionLogs as Record<SessionKey, { totalMs: number }>;
    if (!logs) continue;

    for (const key of ["session1", "session2"] as SessionKey[]) {
      const session = logs[key];
      if (session?.totalMs) {
        durations[key].total += session.totalMs;
        durations[key].count += 1;
      }
    }
  }

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  return {
    session1Avg: formatMs(durations.session1.count ? durations.session1.total / durations.session1.count : 0),
    session2Avg: formatMs(durations.session2.count ? durations.session2.total / durations.session2.count : 0),
  };
}

interface StageDashboardProps {
    participants: Participant[];
}

const StageDashboard: React.FC<StageDashboardProps> = ({ participants }) => {

    const summary = countParticipants(participants);
    const sessionDurations = getAverageSessionDurations(participants);
    
    return (
        <Container>

          <SummaryBox>
            <Cell>Total Users<Value>{summary.total} people</Value></Cell>
            <Cell>Completed Users<Value>{summary.completed} people</Value></Cell>
            <Cell>Avg. Session 1<Value>{sessionDurations.session1Avg}</Value></Cell>
            <Cell>Avg. Session 2<Value>{sessionDurations.session2Avg}</Value></Cell>
          </SummaryBox>
  
          <ProgressWrapper>
            <AdminProgressMatrix participants={participants} />
          </ProgressWrapper>    

          <ExperimentWrapper>
            <ParticipantExperimentTable participants={participants} />
          </ExperimentWrapper>
            
        </Container>
    );
}

export default StageDashboard;

const Container = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
`;

const ProgressWrapper = styled.div`
  flex: 1;
  width: 100%;

`;

const ExperimentWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const SummaryBox = styled.div`:
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;  
  padding: 0rem 1rem;
  width: 100%;
  border-radius: 8px;
  ${textStyles.homeBody()}
`;

const Cell = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    flex: 1;
    height: 100px;
    border-radius: 0.6rem;
    justify-content: space-around;
    border: 1px solid ${colors.gray300};
    background-color: ${colors.white};
    ${textStyles.dashboardBody()}
`;

const Value = styled.div`
    ${textStyles.dashboardTitle({$align: "right"})}
`;