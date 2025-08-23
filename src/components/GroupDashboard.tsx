import React, { useState } from 'react';
import styled from 'styled-components';
import type { Participant } from '../models/Participant';
import colors from '../styles/colors';
import GroupItemButton from './GroupItemButton';
import ParticipantExperimentTable from './ParticipantExperimentTable';
import ConfidenceLineChart from './ConfidenceLineChart';
import ConfidenceLineChartWithBand from './ConfidenceLineChartWithBand';
import { textStyles } from '../styles/textStyles';
import GroupAgentDonut from './GroupAgentDonut';
import GetConfidenceDeltaTable from './GetConfidenceDeltaTable';

interface Props {
  participants: Participant[];
}

const groupCategories: Record<string, string> = {
    '1': 'Parallel',
    '2': 'Observer',
    '3': 'Meta Summary',
    '4': 'Meta Summary',
    '5': 'Meta Summary',
    '6': 'Hybrid',
    '7': 'Hybrid',
    '8': 'Hybrid',
  };

const GroupDashboard: React.FC<Props> = ({ participants }) => {
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(() => {
        const allGroups = participants
          .map((p) => p.meta.group)
          .filter((g): g is string => typeof g === 'string');
        return new Set(allGroups);
      });
  const [mode, setMode] = useState<'all' | 'changed' | 'unchanged'>('all');

  const toggleGroup = (group: string) => {
    const newSet = new Set(selectedGroups);
    if (newSet.has(group)) {
      newSet.delete(group);
    } else {
      newSet.add(group);
    }
    setSelectedGroups(newSet);
  };

  const resetGroups = () => {
    setSelectedGroups(new Set());
  };

  const sortedGroups = Array.from(
    new Set(participants.map((p) => p.meta.group))
  )
    .filter((g): g is string => typeof g === 'string') 
    .sort((a, b) => Number(a) - Number(b)); 

    const filteredParticipants =
  selectedGroups.size === 0
    ? participants
    : participants.filter((p) => selectedGroups.has(p.meta.group));
    
  return (
    <Wrapper>
      <GroupButtonContainer>
        <ResetTextButton onClick={resetGroups}>Reset</ResetTextButton>
        {sortedGroups.map((group) => (
          <GroupItemButton
            key={group}
            group={group}
            category={groupCategories[group]}
            isActive={selectedGroups.has(group)}
            onClick={() => toggleGroup(group)}
          />
        ))}
      </GroupButtonContainer>
      
      <Title>Group-wise Confidence Change Summary</Title>
      <GetConfidenceDeltaTable  participants={filteredParticipants}  />

    <Title>Agent Donut</Title>
    <LineChartContainer>
      <GroupAgentDonut  participants={filteredParticipants} caseIds={['case_1']}/>
      <GroupAgentDonut  participants={filteredParticipants} caseIds={['case_2']}/>
      <GroupAgentDonut  participants={filteredParticipants} caseIds={['case_3']}/>
      <GroupAgentDonut  participants={filteredParticipants} caseIds={['case_4']}/>
      <GroupAgentDonut  participants={filteredParticipants} caseIds={['case_5']}/>
      </LineChartContainer>

      <Title>Confidence Line Chart With Band</Title>
      <LineChartContainer>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_1']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_2']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_3']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_4']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_5']}/>
      </LineChartContainer>

    
    <ModeButtonContainer>
        <Title>Confidence Line Chart With Band</Title>
        {(['all', 'changed', 'unchanged'] as const).map((m) => (
            <ModeButton key={m} active={mode === m} onClick={() => setMode(m)}>
            {m}
            </ModeButton>
        ))}
    </ModeButtonContainer>

      <LineChartContainer>
        <ConfidenceLineChartWithBand participants={filteredParticipants} caseIds={['case_1']}   mode={mode} />
        <ConfidenceLineChartWithBand participants={filteredParticipants} caseIds={['case_2']}   mode={mode} />
        <ConfidenceLineChartWithBand participants={filteredParticipants} caseIds={['case_3']}   mode={mode} />
        <ConfidenceLineChartWithBand participants={filteredParticipants} caseIds={['case_4']}   mode={mode} />
        <ConfidenceLineChartWithBand participants={filteredParticipants} caseIds={['case_5']}   mode={mode} />
      </LineChartContainer>
      <TableWrapper>
        <ParticipantExperimentTable participants={filteredParticipants} />
      </TableWrapper>
      
    </Wrapper>
  );
};

export default GroupDashboard;

const Wrapper = styled.div`
  width: 100%;
`;

const GroupButtonContainer = styled.div`
  position: sticky;
  top: 0; 
  z-index: 10; 
  background-color: ${colors.gray200}; 
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
  justify-content: center;
`;

const LineChartContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TableWrapper = styled.div`
  height: 300px;
  overflow: auto;
  margin-top: 16px;
`;

const Title = styled.div`
    ${textStyles.dashboardTitle()}
    color: ${colors.gray700};
    font-weight: 500;
    flex: 1;
    margin-top: 36px;
    margin-bottom: 15px;
`

const ModeButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModeButton = styled.button<{ active: boolean }>`
  ${textStyles.mentionTag()}
  padding: 0.4rem;
  border: none;
  border-radius: 6px;
  width: 120px;
  height: 30px;
  background-color: ${({ active }) => (active ? colors.gray700 : colors.gray400)};
  color: ${({ active }) => (active ? 'white' : colors.gray800)};
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? colors.gray600 : colors.gray400)};
  }
`;

const ResetTextButton = styled.button`
  ${textStyles.mentionTag()}
  background: none;
  background-color: ${colors.gray400};
  border: none;
  color: ${colors.gray700};
  cursor: pointer;
  padding: 0.4rem;
  margin-right: 0rem;
  border-radius: 6px;

  &:hover {
    text-decoration: underline;
  }
`;