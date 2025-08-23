// src/components/ConfidenceLineChart.tsx
import React from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import type { Participant } from '../models/Participant';
import { textStyles } from '../styles/textStyles';

interface Props {
  participants: Participant[];
  caseIds: string[];
}

const VerticalTick = (props: any) => {
    const { x, y, payload } = props;
  
    let label = '';
    if (payload.value === 0) label = 'A';
    else if (payload.value === 50) label = '';
    else if (payload.value === 100) label = 'B';
  
    return (
      <text
        x={x + 5}
        y={y - 5}
        textAnchor="end"
        transform={`rotate(-90, ${x}, ${y})`}
        fontSize={14}
        fill="#666"
      >
        {label}
      </text>
    );
  };

const ConfidenceLineChart: React.FC<Props> = ({ participants, caseIds }) => {

    const chartData = participants
    .map((p) => {
    const before = caseIds
        .map((caseId) => p.sessionLogs?.session1.logs.find((log) => log.caseId === caseId)?.confidence)
        .filter((val): val is number => typeof val === 'number');

    const after = caseIds
        .map((caseId) => p.sessionLogs?.session2.logs.find((log) => log.caseId === caseId)?.confidence)
        .filter((val): val is number => typeof val === 'number');

    if (before.length === 0 || after.length === 0) return null;

    const avgBefore = before.reduce((a, b) => a + b, 0) / before.length;
    const avgAfter = after.reduce((a, b) => a + b, 0) / after.length;

    const changed = (avgBefore < 50 && avgAfter >= 50) || (avgBefore >= 50 && avgAfter < 50);

    return {
        name: p.prolificId.slice(-5),
        Before: avgBefore,
        After: avgAfter,
        changed,
    };
    })
    .filter(Boolean);

    const getLineColor = (changed: boolean, index: number) =>
    changed ? '#ff5c5c' : `hsl(0, 0%, ${30 + (index * 10) % 50}%)`; 

  const transformedData = ['Before', 'After'].map((session) => {
    const row: any = { session };
    chartData.forEach((p) => {
      row[p!.name] = p![session as 'Before' | 'After'];
    });
    return row;
  });

  return (
    <ChartContainer>
      <ChartTitle>Confidence {caseIds}</ChartTitle>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={transformedData}
          margin={{ top: 30, right: 30, left: -20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="session"
            axisLine={false}
            tickLine={false}
            dy={16}
        />
        <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            ticks={[0, 50, 100]}
            tick={<VerticalTick />}
            />
          <Tooltip />
          {chartData.map((p, index) => (
            <Line
              key={p!.name}
              type="monotone"
              dataKey={p!.name}
              stroke={getLineColor(p!.changed, index)}
              strokeWidth={1.3}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ConfidenceLineChart;

const ChartContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  padding: 1rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  background-color: #f9f9f9;
`;

const ChartTitle = styled.h5`
    ${textStyles.h4()}
    padding: 0px 10px;
`;