import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import colors from '../styles/colors';

const EducationBarChart = ({ data }: { data: { education: string }[] }) => {
  const countByEducation = data.reduce((acc, cur) => {
    acc[cur.education] = (acc[cur.education] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(countByEducation).map(([education, count]) => ({
    education,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="education" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill={colors.gray600} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EducationBarChart;