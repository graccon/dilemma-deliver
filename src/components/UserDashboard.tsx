import { useState } from 'react';
import type { Participant } from '../models/Participant';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';
import AdminProgressMatrix from './AdminProgressMatrix';
import ParticipantSummary from './ParticipantSummary';
import UserDataTable from './UserDataTable';

interface UserDashboardProps {
    participants: Participant[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ participants }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

    const filteredParticipants = participants.filter(p =>
        p.prolificId.toLowerCase().includes(searchTerm.toLowerCase())

    );
    console.log("검색 결과:", filteredParticipants);


    return (
        <Container>
            <Body>
                <ProgressWrapper>
                    <AdminProgressMatrix participants={participants} />
                </ProgressWrapper>

                {selectedParticipant && 
                <UserContainer>
                  <Title>ID: {selectedParticipant.prolificId}</Title>
                  <ParticipantSummary participant={selectedParticipant} />
                  <TableWrapper>
                   <UserDataTable participant={selectedParticipant} />
                  </TableWrapper>
                  </UserContainer>
                }
            </Body>

            <Sidebar>
                <SearchLabel htmlFor="search">🔍 ID 검색</SearchLabel>
                <Input
                    id="search"
                    type="text"
                    placeholder="Prolific ID 입력"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            <SearchResults>
                {filteredParticipants.map((p) => (
                    <SearchItem key={p.prolificId} onClick={() => setSelectedParticipant(p)}>
                        {p.prolificId}
                    </SearchItem>
                ))}
            </SearchResults>
            </Sidebar>    
        </Container>
    );
}

export default UserDashboard;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.gray200};
`;

const Body = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;
const SearchLabel = styled.label`
  ${textStyles.buttonLabel()}
`;
const Title = styled.div`
    ${textStyles.buttonLabel()}
    color: ${colors.gray700};
    font-weight: 500;
    flex: 1;
    margin-top: 36px;
`

const UserContainer = styled.div`
  flex: 2;
  padding: 1rem;
`;

const TableWrapper = styled.div`
  width: 98%;
`;

const ProgressWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const Sidebar = styled.div`
  position: sticky;
  top: 0;
  align-self: flex-start;

  width: 260px;
  height: 100vh;
  padding: 2rem 1.5rem;
  background-color: ${colors.white};
  border-right: 1px solid ${colors.gray300};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.gray400};
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const SearchItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.95rem;
  cursor: pointer;
  color: ${colors.gray800};

  &:hover {
    background-color: ${colors.gray100};
  }
`;