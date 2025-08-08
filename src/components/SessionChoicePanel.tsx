import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import colors from "../styles/colors";
// components/SessionChoicePanel.tsx
const Divider = styled.hr`
  margin: 0.4rem auto; 
  width: 90%;
  border: 1px solid ${colors.gray300};
`;

function formatDuration(ms: number | undefined | null): string {
    if (ms == null) return "-";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

type SessionChoicePanelProps = {
    title: string;
    confidence: number | undefined | null;
    durationMs: number | undefined | null;
    confidenceChange: boolean; 
    decisionChange: boolean; 
  };
  
  export default function SessionChoicePanel({ title, confidence, durationMs, confidenceChange, decisionChange }: SessionChoicePanelProps) {
    const getChoiceLabel = (confidence: number | undefined | null) => {
        if (confidence == null) return "-";
        return confidence > 50 ? "swerve" : "stay";
    };
    const getDisplayConfidence = (confidence: number | undefined | null) => {
        if (confidence == null) return "-";
        return confidence > 50 ? confidence : 100 - confidence;
    };
    const getIconPath = (confidence: number | undefined | null) => {
        if (confidence == null) return "";
        return confidence > 50
          ? "/assets/icons/swerve_icon.png"
          : "/assets/icons/stay_icon.png";
      };

    return (
      <ChoiceBlock>
        <Row>
            <MyChoiceTitle>{title}</MyChoiceTitle>
            <InfoRow>
                <InfoIcon src="/assets/icons/time_icon.png" alt="time" />
                <InfoLabel>{formatDuration(durationMs)}</InfoLabel>
            </InfoRow>
        </Row>
        <Divider />
        <ChoiceBlockWrapper>
            <Icon src={getIconPath(confidence)} alt="choice icon" />
            <Column>
              <p>Decision:</p>
              <MyChoiceLabel $isChange={decisionChange}>{getChoiceLabel(confidence)}</MyChoiceLabel>
            </Column>
            <Column>
              <p>Confidence:</p>
              <MyChoiceLabel $isChange={confidenceChange}>{getDisplayConfidence(confidence)}%</MyChoiceLabel>
            </Column>
        </ChoiceBlockWrapper>
      </ChoiceBlock>
    );
  }

  const MyChoiceTitle = styled.div`
    ${textStyles.h4()};
    font-weight: 700;
    flex: 1;
`;

const ChoiceBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap:10px;
  padding: 0px 0px 0px 20px; 
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0px 20px;
`;

const InfoLabel = styled.p`
  ${textStyles.mentionTag()};
`;

const MyChoiceLabel = styled.span<{ $isChange?: boolean }>`
  ${textStyles.labelTag()};
  background-color: ${(props) =>
    props.$isChange ? colors.yellow : colors.gray300};
  padding: 3px 10px;
  display: inline;
  border-radius: 0.2rem;
`;

const ChoiceBlock = styled.div`
  width: 90%;
  height: 43%;
  border-radius: 1rem;
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 54px;
  height: 54px;
`;

const InfoIcon = styled.img`
    height: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
