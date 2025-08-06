import styled from "styled-components";
import { textStyles } from "../styles/textStyles";

interface NameTagProps {
  name: string;
  color: string;
}

export default function NameTag({ name, color }: NameTagProps) {
  return <Tag $bgcolor={color} $color="black">{name}</Tag>;
}

const Tag = styled.span<{ $bgcolor: string; $color: string }>`
  display: inline-block;
  padding: 3px 6px;
  border-radius: 999px;
  background-color: ${(props) => props.$bgcolor};
  ${({ $color }) => textStyles.nameTag({ color: $color })}
`;