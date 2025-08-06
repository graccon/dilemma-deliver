import styled from "styled-components";
import NameTag from "./NameTag";

interface AgentTagProps {
  show: boolean;
  name: string;
  icon: string;
  color: string;
}

export default function AgentTag({ show, name, icon, color }: AgentTagProps) {
  return (
    <Wrapper>
      {show ? (
        <>
          <AgentIcon src={icon} alt={name} />
          <NameTag name={name} color={color} />
        </>
      ) : (
        <>
          <InvisibleIcon />
          <InvisibleTag name="" color="transparent" />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 50px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const AgentIcon = styled.img`
  width: 48px;
  height: 48px;
  position: absolute;
  bottom: 1.2rem;
`;

const InvisibleIcon = styled(AgentIcon)`
  visibility: hidden;
`;

const InvisibleTag = styled(NameTag)`
  visibility: hidden;
`;