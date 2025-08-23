import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';
import { fetchParticipantData } from '../services/participantStore';
import ReloadButton from '../components/ReloadButton';
import StageDashboard from '../components/StageDashboard';
import type { Participant } from '../models/Participant';
import GroupDashboard from '../components/GroupDashboard';
import UserDashboard from '../components/UserDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [view, setView] = useState("stage");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin-login");
      return;
    }
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const data = await fetchParticipantData(); 
      setParticipants(data);
    } catch (error) {
      console.error("❌ Error fetching participants with session:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "stage":
        return <StageDashboard participants={participants}/>;
      case "group":
        return <GroupDashboard participants={participants}/>;
      case "user":
        return <UserDashboard participants={participants}/>;
      default:
        return null;
    }
  };
  const iconSrc = `/assets/icons/step_active_session_icon.png`;

  return (
    <Container>
      <Sidebar>
        <SidebarTitleWrapper>
            <SidebarTitleIcon src={iconSrc} alt={`step`} />
            <SidebarTitle>Dilemma Deliver</SidebarTitle>
        </SidebarTitleWrapper>
        <SidebarItem onClick={() => setView("stage")} $active={view === "stage"}>Stage</SidebarItem>
        <SidebarItem onClick={() => setView("group")} $active={view === "group"}>Group</SidebarItem>
        <SidebarItem onClick={() => setView("user")} $active={view === "user"}>User</SidebarItem>
      </Sidebar>
      <MainContent>
        <MainTitleWrapper>
            <MainTitle>Admin Dashboard</MainTitle>
            <ReloadButton loading={loading} onClick={fetchParticipants} />
        </MainTitleWrapper>
        <StyledHr />
        {renderContent()}
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.gray200};
`;

const Sidebar = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 180px;
  background-color: ${colors.gray800};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MainTitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const SidebarTitleWrapper = styled.div`
  display: flex;
`;

const SidebarTitleIcon = styled.img`
    width:60px;
    height:60px;
`;

export const StyledHr = styled.hr`
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid ${colors.gray400};
`;

const SidebarTitle = styled.h3`
    ${textStyles.secondH1()}
    color: ${colors.gray100};
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
`;

const MainTitle = styled.h1`
    ${textStyles.thirdH1()}
    color: ${colors.black};
    letter-spacing: -0.2px;
    padding: 0rem 1rem;
`;

const SidebarItem = styled.div<{ $active?: boolean }>`
  ${textStyles.buttonLabel()}
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.6rem;
  color: ${({ $active }) => ($active ? colors.gray800 : colors.gray500)};
  background-color: ${({ $active }) => ($active ? colors.white : 'transparent')};

  &:hover {
    background-color: ${colors.gray700};
  }
`;

const MainContent = styled.div`
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;
