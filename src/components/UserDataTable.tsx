import { useMemo } from "react";
import type { Participant } from "../models/Participant";
import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";
import {
  getTodayDateString,
  downloadCSVFile2,
  downloadExcelFile2,
} from "../services/exportUtils";

interface UserDataTableProps {
  participant: Participant;
}

export default function UserDataTable({ participant }: UserDataTableProps) {
  const rows = useMemo(() => {
    const _rows: { key: string; value: string | number }[] = [];

    const groupByPrefix = (data: Record<string, any>) => {
      const grouped: Record<string, any> = {};
      Object.entries(data).forEach(([key, value]) => {
        const match = key.match(/^([A-Za-z-]+)_([0-9]+)$/);
        if (match) {
          const prefix = match[1];
          if (!grouped[prefix]) grouped[prefix] = [];
          grouped[prefix].push(value);
        } else {
          grouped[key] = value;
        }
      });
      return grouped;
    };

    if (participant.sessionLogs) {
      Object.entries(participant.sessionLogs).forEach(([sessionKey, sessionValue]) => {
        _rows.push({
          key: `[Session ${sessionKey}] TotalDuration`,
          value: `${sessionValue.totalMs} ms`,
        });
        sessionValue.logs.forEach((log, i) => {
          _rows.push({
            key: `[Session ${sessionKey}] log_${i + 1}`,
            value: JSON.stringify(log),
          });
        });
      });
    }

    if (participant.presurveyAnswers) {
      const grouped = groupByPrefix(participant.presurveyAnswers);
      Object.entries(grouped).forEach(([key, value]) => {
        _rows.push({
          key: `[Presurvey] ${key}`,
          value: Array.isArray(value) ? JSON.stringify(value) : String(value),
        });
      });
    }

    if (participant.postsurveyAnswers) {
      const grouped = groupByPrefix(participant.postsurveyAnswers);
      Object.entries(grouped).forEach(([key, value]) => {
        _rows.push({
          key: `[Postsurvey] ${key}`,
          value: Array.isArray(value) && value.every(v => typeof v === "object")
            ? value.map((v, idx) => `(${idx + 1}) ${JSON.stringify(v)}`).join("\n")
            : Array.isArray(value)
              ? value.join(", ")
              : typeof value === "object"
                ? JSON.stringify(value)
                : String(value),
        });
      });
    }

    return _rows;
  }, [participant]);

  const handleCSVDownload = () => {
    const date = getTodayDateString();
    const headers = ["Key", "Value"];
    const dataArray: string[][] = rows.map(row => [
    String(row.key ?? ""),
    String(row.value ?? "")
    ]);

    downloadCSVFile2(
    `participant_${participant.prolificId}_${date}.csv`,
    headers,
    dataArray
    );
  };

  const handleExcelDownload = () => {
    const date = getTodayDateString();
    const headers = ["Key", "Value"];
    const dataArray: string[][] = rows.map(row => [
    String(row.key ?? ""),
    String(row.value ?? "")
    ]);
    downloadExcelFile2(`participant_${participant.prolificId}_${date}.xlsx`, headers, dataArray);
  
  };

  return (
    <Container>
      <TopBar>
        <TableTitle>Experiment Data</TableTitle>
        <ButtonWrapper>
          <DownloadButton onClick={handleCSVDownload}>Export CSV</DownloadButton>
          <DownloadButton onClick={handleExcelDownload}>Export Excel</DownloadButton>
        </ButtonWrapper>
      </TopBar>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "200px" }}>Key</th>
            <th style={{ width: "600px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, value }) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0rem;
  overflow: auto;
`;

const TableTitle = styled.h3`
  ${textStyles.dashboardTitle()}
  color: ${colors.gray700};
  font-weight: 500;
  padding:  15px 5px 5px 15px ;
  letter-spacing: -0.5px;
`;

const Table = styled.table`
 ${textStyles.homeBody()}
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  table-layout: fixed; 
  border-radius: 1rem;
  overflow: hidden;

  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    background-color: ${colors.white};
    word-break: break-word; /* 긴 단어 줄바꿈 */
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

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DownloadButton = styled.button`
  padding: 6px 12px;
  background-color: ${colors.yellow};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  ${textStyles.nameTag()}
  &:hover {
    background-color: ${colors.gray500};
  }
`;