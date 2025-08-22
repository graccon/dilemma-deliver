import React from "react";
import styled from "styled-components";
import { textStyles } from "../styles/textStyles";
import colors from "../styles/colors";

// Participant 타입 정의
interface Participant {
  meta?: {
    prolificId?: string;
    onboardingFlags?: boolean;
    sessionFlags?: {
      session1Done?: boolean;
      session2Done?: boolean;
    };
    surveyFlags?: {
      presurvey?: boolean;
      postsurvey?: boolean;
    };
  };
}

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
    const id = meta.prolificId || "Unknown";

    const presurvey = meta?.surveyFlags?.presurvey === true;
    const onboarding = meta?.onboardingFlags === true;
    const session1 = meta?.sessionFlags?.session1Done === true;
    const session2 = meta?.sessionFlags?.session2Done === true;
    const postsurvey = meta?.surveyFlags?.postsurvey === true;

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

// 렌더링 컴포넌트
const AdminProgressMatrix: React.FC<Props> = ({ participants }) => {
  const categorized = categorizeParticipants(participants);
  const columns = ["Presurvey", "Onboarding", "Session 1", "Session 2", "Postsurvey", "Completed"];
  const maxRows = Math.max(...columns.map((col) => categorized[col].length));

  return (
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
              {columns.map((col) => (
                <StyledTd key={col}>
                  {categorized[col][rowIdx]?.slice(-5) || ""}
                </StyledTd>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default AdminProgressMatrix;

const TableWrapper = styled.div`
  max-height: 210px;
  width: 900px;
  overflow: auto;
  border: 1px solid ${colors.gray300};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const StyledTh = styled.th`
  ${textStyles.h5()}
  position: sticky;
  top: 0;
  background-color: ${colors.gray100};
  border: 1px solid ${colors.gray400};
  padding: 12px;
  text-align: center;
  z-index: 1;
`;

const StyledTd = styled.td`
  ${textStyles.homeBody()}
  background-color: ${colors.gray100};
  border: 1px solid ${colors.gray300};
  padding: 10px;
  text-align: center;
  word-break: break-word;
`;