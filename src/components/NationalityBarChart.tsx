import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
  } from "recharts";
import { continentColors, continentMap } from "../styles/continentData";
import styled from 'styled-components';


  interface NationalityBarChartProps {
    data: { nationality: string }[];
  }
  
  export default function NationalityBarChart({ data }: NationalityBarChartProps) {
    const counts: Record<string, number> = {};
    data.forEach(({ nationality }) => {
      counts[nationality] = (counts[nationality] || 0) + 1;
    });
  
    const sortedData = Object.entries(counts)
      .map(([nationality, count]) => ({ nationality, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

  
    return (
      <Container style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart layout="vertical" data={sortedData}>
            <XAxis type="number" />
            <YAxis dataKey="nationality" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="count">
              {sortedData.map((item, index) => {
                const continent =
                  continentMap[item.nationality] || "Unknown";
                const fill = continentColors[continent] || continentColors.Unknown;
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
              <LabelList dataKey="count" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Container>
    );
  }

  const Container = styled.div`
  flex: 1;
  display: 'flex';
  justifyContent: 'center';
  `;
  