import React from "react";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";
import type { Participant } from "../models/Participant";

interface CategorizedResult {
  [key: string]: string[];
}

interface Props {
  participants: Participant[];
}

// 분류 로직
function categorizeParticipants(participants: Participant[]): CategorizedResult {
  const result: CategorizedResult = {
    Presurvey: [],
    Onboarding: [],
    "Session 1": [],
    "Session 2": [],
    Postsurvey: [],
    Completed: [],
  };

  participants.forEach((p) => {
    const meta = p.meta || {};
    const id = p.prolificId || "Unknown";

    const presurvey = p.surveyFlags?.presurvey === true;
    const onboarding = meta.onboardingFlags === true;
    const session1 = p.sessionFlags.session1Done === true;
    const session2 = p.sessionFlags.session2Done === true;
    const postsurvey = p.surveyFlags?.postsurvey === true;

    if (presurvey && onboarding && session1 && session2 && postsurvey) {
      result.Completed.push(id);
    } else {
      if (presurvey) result.Presurvey.push(id);
      if (onboarding) result.Onboarding.push(id);
      if (session1) result["Session 1"].push(id);
      if (session2) result["Session 2"].push(id);
      if (postsurvey) result.Postsurvey.push(id);
    }
  });

  return result;
}

const AdminProgressMatrix: React.FC<Props> = ({ participants }) => {
  const categorized = categorizeParticipants(participants);
  const columns = ["Presurvey", "Onboarding", "Session 1", "Session 2", "Postsurvey", "Completed"];
  const maxRows = Math.max(...columns.map((col) => categorized[col].length));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("복사 실패:", err);
    });
  };

  return (
    <TableContainer>
      <TableTitle> Participation Progress </TableTitle>
      <TableWrapper>
        <StyledTable>
          <colgroup>
            {columns.map((_, idx) => (
              <col key={idx} style={{ width: `${100 / columns.length}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((col) => (
                <StyledTh key={col}>
                  {col} ({categorized[col].length})
                </StyledTh>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col) => {
                  const fullId = categorized[col][rowIdx];
                  const displayId = fullId?.slice(-5) || "";
                  return (
                    <StyledTd key={col} onClick={() => fullId && handleCopy(fullId)}>
                      {displayId}
                    </StyledTd>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  );
};

export default AdminProgressMatrix;

const TableContainer = styled.div`
  width: 100%;
  padding: 0px 20px;
`;

const TableTitle = styled.h3`
  ${textStyles.dashboardTitle()}
  color: ${colors.gray700};
  font-weight: 500;
  padding:  15px 5px 5px 15px ;
  letter-spacing: -0.5px;
`;

const TableWrapper = styled.div`
  max-height: 30vh;
  width: 100%;
  overflow: auto;
  border: 1px solid ${colors.gray300};
  border-radius: 1rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const StyledTh = styled.th`
  ${textStyles.mentionTag()}
  position: sticky;
  top: 0;
  background-color: ${colors.gray400};
  border: 1px solid ${colors.gray500};
  padding: 6px;
  text-align: center;
  z-index: 1;
`;

const StyledTd = styled.td`
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