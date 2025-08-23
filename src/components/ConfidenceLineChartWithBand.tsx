// src/components/ConfidenceLineChart.tsx
import React from 'react';
import styled from 'styled-components';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import type { Participant } from '../models/Participant';
import { textStyles } from '../styles/textStyles';
import colors from '../styles/colors';

const colorPalette = {
    all: {
      mean: colors.gray600,      
      band: colors.gray500,
    },
    changed: {
      mean: '#e74c3c',     
      band: '#f1948a',
    },
    unchanged: {
      mean: '#0674fe',    
      band: '#90caff',
    },
  };

interface Props {
  participants: Participant[];
  caseIds: string[];
  mode: 'changed' | 'unchanged' | 'all';
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

const ConfidenceLineChartWithBand: React.FC<Props> = ({ participants, caseIds, mode }) => {
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

  const filteredGroup =
    mode === 'all'
      ? chartData
      : chartData.filter((p) => p!.changed === (mode === 'changed'));

  const transformedData = ['Before', 'After'].map((session) => {
    const row: any = { session };
    const values: number[] = [];

    filteredGroup.forEach((p) => {
      const value = p![session as 'Before' | 'After'];
      row[p!.name] = value;
      values.push(value);
    });

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

    row.mean = mean;
    row.upper = mean + stdDev;
    row.lower = mean - stdDev;

    return row;
  });

  return (
    <ChartContainer>
      <ChartTitle>Confidence ({mode}) {caseIds.join(', ')}</ChartTitle>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={transformedData}
          margin={{ top: 30, right: 30, left: -20, bottom: 10 }}
        >
            <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill={colorPalette[mode].band}
                fillOpacity={0.1}
                />
            <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#fff"
                fillOpacity={1}
                />
          <Line
            type="monotone"
            dataKey="mean"
            stroke={colorPalette[mode].mean}
            strokeWidth={2}
            dot={false}
            name="Average"
          />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="session" />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            ticks={[0, 50, 100]}
            tick={<VerticalTick />}
          />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ConfidenceLineChartWithBand;

const ChartContainer = styled.div`
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