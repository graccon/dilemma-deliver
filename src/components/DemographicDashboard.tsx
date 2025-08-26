import type { Participant } from '../models/Participant';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import AgeHistogram from './AgeHistogram';
import GenderDonutChart from './GenderDonutChart';
import GeoChart from './GeoChart';
import NationalityBarChart from './NationalityBarChart';
import colors from '../styles/colors';
import { useState } from 'react';
import { continentMap,continentColors } from '../styles/continentData';
import Spacer from './Spacer';

const getContinentColorWithOpacity = (continent: string) => {
    const baseColor = continentColors[continent];
    return baseColor ? `${baseColor}60` : colors.gray400; 
  };

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

  function countByNationality(data: { nationality: string }[]) {
    const counts: Record<string, number> = {};
    for (const item of data) {
      const key = item.nationality || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

interface demographicDashboardProps {
    participants: Participant[];
}

const DemographicDashboard: React.FC<demographicDashboardProps> = ({ participants }) => {

    const demographics = extractDemographicData(participants);
    const groupedData = groupBy(demographics, "group");
    const nationalityCounts = countByNationality(demographics);

    function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
        return arr.reduce((acc, cur) => {
          const groupKey = cur[key] as unknown as string;
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(cur);
          return acc;
        }, {} as Record<string, T[]>);
      }
    
    const [selectedContinent, setSelectedContinent] = useState<string>("All");

    const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    };

    const filteredDemographics = demographics.filter((d) => {
        if (selectedContinent === "All") return true;
        return continentMap[d.nationality] === selectedContinent;
      });

    return (
        <Container>
            <TotalWrapper>
                <SummaryBox>
                    <AgeHistogram data={demographics.map((d) => ({ age: d.age }))} />
                    <GenderDonutChart data={demographics.map((d) => ({ gender: d.gender }))} />
                </SummaryBox>
                <Spacer height='3rem'/>

                <SummaryBox>
                <SubTitle>Nationality Bar Chart</SubTitle>
                <FilterWrapper>
                    {["All", "Asia", "Europe", "America", "Oceania", "Africa"].map((c) => (
                        <StyledContinentButton
                        key={c}
                        onClick={() => handleContinentChange(c)}
                        selected={selectedContinent === c}
                        color={continentColors[c] || colors.gray400}
                        >
                        {c}
                        </StyledContinentButton>
                    ))}
                </FilterWrapper>
                </SummaryBox>
                <OneColumnWrapper>
                    <NationalityBarChart data={filteredDemographics.map((d) => ({ nationality: d.nationality }))} />
                </OneColumnWrapper>
            </TotalWrapper>


            <Title>Group Summary</Title>
            {Object.entries(groupedData).map(([groupId, groupData]) => (
                <div key={groupId}>
                <SubTitle>{`Group ${groupId}`}</SubTitle>
                <GroupBox>
                    <AgeHistogram data={groupData.map((d) => ({ age: d.age }))} />
                    <GenderDonutChart data={groupData.map((d) => ({ gender: d.gender }))} />
                    <GeoChart data={groupData.map((d) => ({ nationality: d.nationality }))} />
                </GroupBox>
                </div>
            ))}

            <OneColumnWrapper>
                <table>
                <thead>
                    <tr>
                    <th style={{ textAlign: "left" }}>Nationality</th>
                    <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(nationalityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([nat, count]) => (
                    <tr key={nat}>
                        <td>{nat}</td>
                        <td style={{ textAlign: "center" }}>{count}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </OneColumnWrapper>
        </Container>
    );
}

export default DemographicDashboard;

const Container = styled.div`
  width: 100%;
  height: 100hv;
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
`;

const FilterWrapper = styled.div`
    display: flex;
    gap: 0.8rem;
    marginBottom: 1rem;
`

const Title = styled.div`
    ${textStyles.bigH2()}
    color: ${colors.gray700};
    font-weight: 500;
    flex: 1;
    margin: 1rem 0;
`

const SubTitle = styled.div`
    ${textStyles.h2()}
    color: ${colors.gray700};
    font-weight: 500;
    flex: 1;
    margin : 1-.5rem 0;
`

const TotalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom : 2rem;
`;

const SummaryBox = styled.div`:
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0rem 1rem;
  width: 100%;
  justifyContent: center;
  ${textStyles.homeBody()}
`;

const GroupBox = styled.div`:
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1rem 1rem;
  justifyContent: center;
  ${textStyles.homeBody()}
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const OneColumnWrapper = styled.div`:
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100%;
  ${textStyles.homeBody()}
`;

const StyledContinentButton = styled.button<{ selected: boolean; color: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ selected, color }) => (selected ? color : `${color}60`)};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 80px;
  height: 30px;
  color: black;
  transition: background-color 0.2s ease;
`;