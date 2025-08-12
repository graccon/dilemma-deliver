import styled from "styled-components";
import openingData from "../assets/data/opening.json";
import { textStyles } from "../styles/textStyles"

interface SectionType {
  title: string;
  paragraphs: string[];
  image: string | null;
}

function renderParagraph(content: string, key: number) {
  const trimmed = content.trim();
  if (trimmed.startsWith("+")) {
    return <StyledListItem key={key}>{trimmed.slice(1).trim()}</StyledListItem>;
  }
  return <p key={key}>{content}</p>;
}

export default function HomeTopPage() {

    const targetTitles = [
        "Informed Consent of Participation",
        "1. Purpose of the Study",
        "2. Participation and Compensation",
        "3. Procedures"
    ];

    const selectedSections: SectionType[] = openingData.filter(section =>
        targetTitles.includes(section.title)
    );

    const rightSections = selectedSections.filter(section =>
        [ "1. Purpose of the Study",
          "2. Participation and Compensation",].includes(section.title)
      );
    
    const leftSections = selectedSections.filter(section =>
      section.title === "3. Procedures"
    );

    const topSections = selectedSections.filter(section =>
      section.title === "Informed Consent of Participation"
    );

  return (
    <Container>
      <TopSide>
      {topSections.map((section, index) => (
          <Section key={index}>
            <Content>
              <Title>{section.title}</Title>
              {section.image && (
                  <div style={{ textAlign: "center" }}>
                    <StyledImage src={section.image} alt={section.title} />
                  </div>
                )}
              {section.paragraphs.map((para, i) => renderParagraph(para, i))}
            </Content>
          </Section>
        ))}
      </TopSide>
    <Wrapper>
        <RightSide>
        {rightSections.map((section, index) => (
          <Section key={index}>
            <Content>
              <Title>{section.title}</Title>
              {section.image && (
                  <div style={{ textAlign: "center" }}>
                    <StyledImage src={section.image} alt={section.title} />
                  </div>
                )}
              {section.paragraphs.map((para, i) => renderParagraph(para, i))}
            </Content>
          </Section>
        ))}
        </RightSide>
        <LeftSide>
        {leftSections.map((section, index) => (
          <Section key={index}>
            <Content>
              <Title>{section.title}</Title>
              {section.image && (
                  <div style={{ textAlign: "center" }}>
                    <StyledImage src={section.image} alt={section.title} />
                  </div>
                )}
              {section.paragraphs.map((para, i) => renderParagraph(para, i))}
            </Content>
          </Section>
        ))}
        </LeftSide>
    </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 0 20px; 
`;

const TopSide = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
`;

const RightSide = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
`;

const LeftSide = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  ${textStyles.homeBody()}
  flex: 1;
  textAlign: "center";
  margin-bottom: 20px;
`;

const Title = styled.h2`
  ${textStyles.secondH1()}
  margin-left: -20px;
`;

const StyledImage = styled.img`
  flex-shrink: 0;
  width: 360px;
  padding: 10px 0px;
  margin: 0rem auto;
`;

export const StyledList = styled.ul`
  list-style-position: inside;
  padding-left: 0;
  margin: 0;
`;

export const StyledListItem = styled.li`
  ${textStyles.homeBody()}
  line-height: 1.4;
  font-size: 0.8rem;
  text-indent: -1.5em;
  padding-left: 2.4em;
`;