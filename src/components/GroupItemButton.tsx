import React from 'react';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';

interface Props {
  group: string;
  category: string;
  isActive: boolean;
  onClick: () => void;
}

const GroupItemButton: React.FC<Props> = ({ group, category, isActive, onClick }) => {
  return (
    <Button $active={isActive} onClick={onClick}>
      <Image
        src={`/assets/images/group_${group}${isActive ? '' : '_inactive'}.png`}
        alt={`Group ${group}`}
      />
      Group {group}
      <Category>{category}</Category>
    </Button>
    
  );
};

export default GroupItemButton;

const Button = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? colors.gray400 : colors.gray100)};
  color: ${colors.gray700};
  font-weight: 500;

  &:hover {
    background-color: #aaa;
  }
`;

const Image = styled.img`
  width: 110px;
  margin-bottom: 8px;
  object-fit: contain;
`;

const Category = styled.div`
  ${textStyles.mentionTag()}
`;