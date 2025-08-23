import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Participant } from '../models/Participant';
import { textStyles } from '../styles/textStyles';

interface Props {
  participants: Participant[];
  caseIds: string[];
}

const COLORS = ['#8AA6C1', '#DF9EA3', '#85B8A7'];

const GroupAgentDonut: React.FC<Props> = ({ participants, caseIds }) => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const result: Record<string, number> = {
      stat: 0,
      rule: 0,
      narr: 0,
    };

    participants.forEach((p) => {
      caseIds.forEach((caseId) => {
        const agent = p.sessionLogs?.session2?.logs?.find((log) => log.caseId === caseId)?.agentChats?.[0]?.from;
        if (agent === 'stat' || agent === 'rule' || agent === 'narr') {
          result[agent]++;
        }
      });
    });

    setData([
      { name: 'Stat', value: result.stat },
      { name: 'Rule', value: result.rule },
      { name: 'Narr', value: result.narr },
    ]);
  }, [participants, caseIds]);

  return (
    <ChartContainer>
      <ChartTitle>{caseIds}</ChartTitle>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default GroupAgentDonut;

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