import {
    PieChart, Pie, Cell, Legend, Tooltip,
  } from 'recharts';
import colors from '../styles/colors';
import styled from 'styled-components';
import { textStyles } from '../styles/textStyles';

  const GENDER_COLORS = {
    Female: colors.darkRed,
    Male: colors.darkBlud,
    Other: colors.gray400,
  };
  
  function getGenderDistribution(data: { gender: string }[]) {
    const count: Record<string, number> = {};
    data.forEach((item) => {
      const gender = item.gender || 'Other';
      count[gender] = (count[gender] || 0) + 1;
    });
  
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }
  
  const GenderDonutChart: React.FC<{ data: { gender: string }[] }> = ({ data }) => {
    const distribution = getGenderDistribution(data);
  
    return (
      <Container>
        <Title>Gender Donut Chart</Title>
        <PieChart width={300} height={300}>
        <Pie
          data={distribution}
          cx="50%"
          cy="45%"
          innerRadius={30}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
          label
        >
          {distribution.map((entry, index) => (
            <Cell
            key={`cell-${index}`}
            fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] || colors.gray500}
          />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}`} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
      </Container>
    );
  };

  export default GenderDonutChart;


  const Container = styled.div`
  flex: 1;
  display: 'flex';
  justifyContent: 'center';
`;

const Title = styled.div`
    ${textStyles.dashboardTitle()}
    color: ${colors.gray700};
    font-weight: 500;
    flex: 1;
    margin-top: 36px;
    margin-bottom: 15px;
`
