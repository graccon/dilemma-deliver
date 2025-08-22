// src/components/ParticipantExperimentTable.tsx
import * as XLSX from "xlsx";
import React from "react";
import styled from "styled-components";
import type { Participant } from "../models/Participant";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

interface Props {
  participants: Participant[];
}

const CASE_IDS = ["case_1", "case_2", "case_3", "case_4", "case_5"];

function getTodayDateString() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${mm}${dd}`;
  }

function convertToCSV(headers: string[], rows: Record<string, any>[]) {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => `"${row[h] ?? ""}"`).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

function downloadExcelFile(filename: string, headers: string[], rows: Record<string, any>[]) {
    const worksheetData = [headers, ...rows.map(row => headers.map(h => row[h] ?? ""))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  }

// 다운로드 트리거
function downloadCSVFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const ParticipantExperimentTable: React.FC<Props> = ({ participants }) => {
  const extractData = (p: Participant) => {
    const row: Record<string, any> = {
      "Prolific ID": p.prolificId,
      Group: p.meta.group,
    };

    CASE_IDS.forEach((caseId, idx) => {
      const keyNum = `case${idx + 1}`;
      const s1 = p.sessionLogs?.session1.logs.find((log) => log.caseId === caseId);
      const s2 = p.sessionLogs?.session2.logs.find((log) => log.caseId === caseId);
      row[`${keyNum}_conf_s1`] = s1?.confidence ?? "-";
      row[`${keyNum}_conf_s2`] = s2?.confidence ?? "-";
      row[`${keyNum}_agent`] = s2?.agentChats?.[0]?.from ?? "-";
    });

    return row;
  };

  const completedParticipants = participants.filter((p) => {
    const { meta, sessionFlags, surveyFlags } = p;
    return (
      surveyFlags?.presurvey &&
      meta?.onboardingFlags &&
      sessionFlags?.session1Done &&
      sessionFlags?.session2Done &&
      surveyFlags?.postsurvey
    );
  });

  const headers = [
    "Prolific ID",
    "Group",
    ...CASE_IDS.flatMap((_, idx) => {
      const keyNum = `case${idx + 1}`;
      return [`${keyNum}_conf_s1`, `${keyNum}_conf_s2`, `${keyNum}_agent`];
    }),
  ];

  const rows = completedParticipants.map(extractData);

  const handleCSVDownload = () => {
    const csv = convertToCSV(headers, rows);
    const date = getTodayDateString();
    downloadCSVFile(`participant_summary_${date}.csv`, csv);
  };

  const handleExcelDownload = () => {
    const date = getTodayDateString();
    downloadExcelFile(`participant_summary_${date}.xlsx`, headers, rows);
  };

  return (
    <TableContainer>
      <TopBar>
        <TableTitle>Participant Experiment Summary</TableTitle>
        <ButtonWrapper>
            <DownloadButton onClick={handleCSVDownload}>Export CSV</DownloadButton>
            <DownloadButton onClick={handleExcelDownload}>Export Excel</DownloadButton>
        </ButtonWrapper>
      </TopBar>
      <ScrollWrapper>
        <StyledTable>
          <thead>
            <tr>
              {headers.map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {headers.map((h) => (
                  <Td key={h}>
                    {h === "Prolific ID" ? row[h]?.slice(-5) : row[h]}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </ScrollWrapper>
    </TableContainer>
  );
};

export default ParticipantExperimentTable;

const TableContainer = styled.div`
  width: 100%;
  padding: 0 20px;
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

const TableTitle = styled.h3`
  ${textStyles.dashboardTitle()}
  color: ${colors.gray700};
  font-weight: 500;
  padding:  15px 5px 5px 15px ;
  letter-spacing: -0.5px;
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

const ScrollWrapper = styled.div`
  overflow: auto;
  border: 1px solid ${colors.gray300};
  border-radius: 1rem;
  max-width: 75vw;
  max-height: 30vh;
`;


const StyledTable = styled.table`
  width: max-content;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  ${textStyles.mentionTag()}
  position: sticky;
  top: 0;
  background-color: ${colors.gray400};
  border: 1px solid ${colors.gray500};
  padding: 6px;
  text-align: center;
  z-index: 1;
  white-space: normal;
  word-break: break-word;
  width: 80px;
  &:first-child {
    width: 100px;
  }
`;

const Td = styled.td`
  ${textStyles.homeBody()}
  background-color: ${colors.white};
  border: 1px solid ${colors.gray300};
  padding: 10px;
  text-align: center;
  word-break: break-word;
  cursor: pointer;
  &:hover {
    background-color: ${colors.gray100};
  }
`;