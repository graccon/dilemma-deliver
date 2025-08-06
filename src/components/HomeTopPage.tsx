import styled from "styled-components";
import openingData from "../assets/data/opening.json";
import { textStyles } from "../styles/textStyles"

interface SectionType {
  title: string;
  paragraphs: string[];
  image: string | null;
}

export default function HomeTopPage() {

    const targetTitles = [
        "Study Title",
        "Procedures",
        "Purpose of the Study",
    ];

    const selectedSections: SectionType[] = openingData.filter(section =>
        targetTitles.includes(section.title)
    );

    const rightSections = selectedSections.filter(section =>
        ["Study Title", "Procedures"].includes(section.title)
      );
    
      const leftSections = selectedSections.filter(section =>
        section.title === "Purpose of the Study"
      );

  return (
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
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Content>
          </Section>
        ))}
        </RightSide>
        <LeftSide>
        {leftSections.map((section, index) => (
          <Section key={index}>
            <Content>
              <Title>{section.title}</Title>
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {section.image && (
                  <div style={{ textAlign: "center", marginTop: "4rem"}}>
                    <StyledImage src={section.image} alt={section.title} />
                  </div>
                )}
            </Content>
          </Section>
        ))}
        </LeftSide>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
  height: 100%;
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
  textAlign: "center"
`;

const Title = styled.h2`
  ${textStyles.secondH1()}
`;

const StyledImage = styled.img`
  flex-shrink: 0;
  width: 420px;
  height: auto;
  margin: 0rem auto;
  background-color: pink;
`;