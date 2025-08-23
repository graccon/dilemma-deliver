import React, { useState } from 'react';
import styled from 'styled-components';
import type { Participant } from '../models/Participant';
import colors from '../styles/colors';
import GroupItemButton from './GroupItemButton';
import ParticipantExperimentTable from './ParticipantExperimentTable';
import ConfidenceLineChart from './ConfidenceLineChart';
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const sortedGroups = Array.from(
    new Set(participants.map((p) => p.meta.group))
  )
    .filter((g): g is string => typeof g === 'string') 
    .sort((a, b) => Number(a) - Number(b)); 

    const filteredParticipants =
    selectedGroup === null
        ? participants
        : participants.filter((p) => p.meta.group === selectedGroup);

  return (
    <Wrapper>
      <GroupButtonContainer>
      {sortedGroups.map((group) => (
        <GroupItemButton
            key={group}
            group={group}
            category={groupCategories[group]}
            isActive={selectedGroup === group}
            onClick={() => setSelectedGroup(group)}
        />
        ))}
      </GroupButtonContainer>
      <LineChartContainer>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_1']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_2']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_3']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_4']}/>
        <ConfidenceLineChart participants={filteredParticipants} caseIds={['case_5']}/>
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