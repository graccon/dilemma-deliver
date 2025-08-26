import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import colors from '../styles/colors';
import styled from 'styled-components';
import { textStyles } from '../styles/textStyles';

interface AgeHistogramProps {
  data: { age: number }[];
}

function getAgeBins(data: { age: number }[]) {
  const bins: Record<string, number> = {};

  data.forEach(({ age }) => {
    const binStart = Math.floor(age / 10) * 10;
    const binLabel = `${binStart}–${binStart + 9}`;
    bins[binLabel] = (bins[binLabel] || 0) + 1;
  });

  return Object.entries(bins).sort((a, b) => {
    const aStart = parseInt(a[0].split('–')[0], 10);
    const bStart = parseInt(b[0].split('–')[0], 10);
    return aStart - bStart;
  }).map(([range, count]) => ({
    range,
    count,
  }));
}

function getAverageAge(data: { age: number }[]): number {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, { age }) => sum + age, 0);
  const average = total / data.length;
  return parseFloat(average.toFixed(2));
}

const AgeHistogram: React.FC<AgeHistogramProps> = ({ data }) => {
  const histogramData = getAgeBins(data);
  const averageAge = getAverageAge(data);

  return (
    <Container>
      <TitleWrapper>
        <Title>AgeHistogram</Title>
        <AverageText>Avg {averageAge}</AverageText>
      </TitleWrapper>
       <ResponsiveContainer width="100%" height={300}>
        <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill={colors.gray600}>
            <LabelList dataKey="count" position="top" />
          </Bar>
      </BarChart>
    </ResponsiveContainer>
    </Container>
  );
};

export default AgeHistogram;


const Container = styled.div`
  flex: 1;
  display: flex;
  justifyContent: center;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  margin-top: 36px;
  margin-bottom: 15px;
  padding: 0px 2rem;
`

const Title = styled.div`
  ${textStyles.dashboardTitle()}
  color: ${colors.gray700};
  font-weight: 500;
  flex: 1;
`

const AverageText = styled.div`
  ${textStyles.dashboardBody()}
  color: ${colors.gray600};
`;