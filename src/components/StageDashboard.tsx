import AdminProgressMatrix from './AdminProgressMatrix';
import type { Participant } from '../models/Participant';
import styled from 'styled-components';
import { textStyles } from "../styles/textStyles";
import colors from '../styles/colors';

interface StageDashboardProps {
    participants: Participant[];
}
  
const StageDashboard: React.FC<StageDashboardProps> = ({ participants }) => {
    return (
        <div>
            <AdminProgressMatrix participants={participants} />;
        </div>
    );
}

export default StageDashboard;