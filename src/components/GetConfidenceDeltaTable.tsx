// src/components/getConfidenceDeltaTable.tsx
import React from 'react';
import styled from 'styled-components';
import type { Participant } from '../models/Participant';
import colors from '../styles/colors';

interface Props {
  participants: Participant[];
}

const GetConfidenceDeltaTable: React.FC<Props> = ({ participants }) => {
  const caseIds = ['case_1', 'case_2', 'case_3', 'case_4', 'case_5'];

  const processed = participants.map((p) =>
    caseIds.map((caseId) => {
      const log1 = p.sessionLogs?.session1.logs.find((log) => log.caseId === caseId);
      const log2 = p.sessionLogs?.session2.logs.find((log) => log.caseId === caseId);

      return {
        group: p.meta.group,
        caseId,
        beforeConfidence: typeof log1?.confidence === 'number' ? log1.confidence : null,
        afterConfidence: typeof log2?.confidence === 'number' ? log2.confidence : null,
      };
    })
  );

  const changes = processed.flat().map((entry) => {
    const { group, caseId, beforeConfidence, afterConfidence } = entry;

    if (typeof beforeConfidence === 'number' && typeof afterConfidence === 'number') {
      const changed =
        (beforeConfidence < 50 && afterConfidence >= 50) ||
        (beforeConfidence >= 50 && afterConfidence < 50);
      const delta = Math.abs(afterConfidence - beforeConfidence);
      return { group, caseId, changed, delta };
    }

    return null;
  }).filter(Boolean) as { group: string; caseId: string; changed: boolean; delta: number }[];

  const groupStats = new Map<
    string,
    {
        participantCount: number;
        changedCount: number;
        changedDeltas: number[];
        unchangedDeltas: number[];
    }
  >();

  changes.forEach(({ group, changed, delta }) => {
    if (!groupStats.has(group)) {
      groupStats.set(group, {
        participantCount: 0,
        changedCount: 0,
        changedDeltas: [],
        unchangedDeltas: [],
      });
    }

    const stats = groupStats.get(group)!;

    if (changed) {
      stats.changedCount += 1;
      stats.changedDeltas.push(delta);
    } else {
      stats.unchangedDeltas.push(delta);
    }
  });

  const summary = Array.from(groupStats.entries()).map(([group, stats]) => {
    const allDeltas = [...stats.changedDeltas, ...stats.unchangedDeltas];

    const avgChangedDelta =
      stats.changedDeltas.length > 0
        ? stats.changedDeltas.reduce((sum, d) => sum + d, 0) / stats.changedDeltas.length
        : 0;

    const avgUnchangedDelta =
      stats.unchangedDeltas.length > 0
        ? stats.unchangedDeltas.reduce((sum, d) => sum + d, 0) / stats.unchangedDeltas.length
        : 0;

    const avgTotalDelta =
      allDeltas.length > 0
        ? allDeltas.reduce((sum, d) => sum + d, 0) / allDeltas.length
        : 0;

    return {
      group,
      participantCount: allDeltas.length,
      changedCount: stats.changedCount,
      avgChangedDelta: parseFloat(avgChangedDelta.toFixed(2)),
      avgUnchangedDelta: parseFloat(avgUnchangedDelta.toFixed(2)),
      avgTotalDelta: parseFloat(avgTotalDelta.toFixed(2)),
    };
  }).sort((a, b) => a.group.localeCompare(b.group));

  console.log('그룹별 신뢰도 변화량 요약 (전체 평균 포함):', summary);

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Group</th>
            <th># of Decision</th>
            <th># of Changed</th>
            <th>Avg Delta (Changed)</th>
            <th>Avg Delta (Unchanged)</th>
            <th>Avg Delta (All)</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.group}>
              <td>{row.group}</td>
              <td>{row.participantCount}</td>
              <td>{row.changedCount}</td>
              <td>{row.avgChangedDelta}</td>
              <td>{row.avgUnchangedDelta}</td>
              <td>{row.avgTotalDelta}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default GetConfidenceDeltaTable;

const Container = styled.div`
  width: 100%;
  padding: 0rem;
  border-radius: 1rem;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    background-color: ${colors.white};
  }

  th {
    background-color: ${colors.gray400};
    font-weight: bold;
  }
  td {
    &:hover {
        background-color: ${colors.gray100};
    }
  }
`;