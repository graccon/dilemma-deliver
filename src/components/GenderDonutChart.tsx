import {
    PieChart, Pie, Cell, Legend, Tooltip,
  } from 'recharts';
import colors from '../styles/colors';

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
      <PieChart width={500} height={300}>
        <Pie
          data={distribution}
          cx="50%"
          cy="40%"
          innerRadius={30}
          outerRadius={150}
          fill={colors.gray700}
          paddingAngle={0}
          dataKey="value"
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
    );
  };

  export default GenderDonutChart;