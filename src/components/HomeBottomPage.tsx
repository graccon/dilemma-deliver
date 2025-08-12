import styled from "styled-components";
import openingData from "../assets/data/opening.json";
import { textStyles } from "../styles/textStyles"
import { FaUser, FaEnvelope } from "react-icons/fa";
import colors from "../styles/colors";

interface SectionType {
  title: string;
  paragraphs: string[];
  image: string | null;
}


function renderParagraph(content: string, key: number) {
  const trimmed = content.trim();
  const prefix = trimmed.charAt(0);
  const text = trimmed.slice(1).trim();

  let icon = null;
  switch (prefix) {
    case "*":
      return <NameItem key={key}>{text}</NameItem>;
    case "-":
      icon = <FaUser color={colors.gray800}/>; // 직급용 (react-icons/fa)
      break;
    case "+":
      icon = <FaEnvelope color={colors.gray800}/>;
      break;
    default:
      break;
  }

  if (icon) {
    return (
      <StyledListItem key={key}>
        <IconWrapper>{icon}</IconWrapper>
        {text}
      </StyledListItem>
    );
  }

  return <p key={key}>{content}</p>;
}

export default function HomeTopPage() {

    const targetTitles = [
        "4. Potential Risks and Benefits",
        "5. Data Protection and Confidentiality",
        "6. Identification of Investigators",
        "7. Consent",
    ];

    const selectedSections: SectionType[] = openingData.filter(section =>
        targetTitles.includes(section.title)
    );

  return (
    <Wrapper>
    {selectedSections.map((section, index) => (
      <Section key={index}>
        <Title>{section.title}</Title>
        {section.paragraphs.map((para, i) => renderParagraph(para, i))}
      </Section>
    ))}
  </Wrapper>
  );
}

const Wrapper = styled.div`
  column-count: 2;
  column-gap: 4rem;
  column-fill: auto;
  padding: 0 20px; 

  max-height: 560px;
  overflow-y: auto;
  p {
    margin: 0 0 0.75rem;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
`;

const Section = styled.section`
  margin: 0 0 1.5rem;
  ${textStyles.homeBody()}
`;

const Title = styled.h2`
  ${textStyles.secondH1()}
  margin-left: -20px;
`;

export const StyledList = styled.ul`
  list-style-position: inside;
  padding-left: 0;
  margin: 0;
`;

export const NameItem = styled.li`
  ${textStyles.homeBody()}
  line-height: 1.4;
  list-style: none;
  margin: 0 0 0.5rem;
  margin-top: 16px;
`;

export const StyledListItem = styled.li`
  ${textStyles.li()};
  line-height: 1;
  list-style: none;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;