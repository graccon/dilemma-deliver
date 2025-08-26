import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import colors from '../styles/colors';

interface AgeHistogramProps {
  data: { age: number }[];
}

// Helper to group ages into bins (e.g., 20-29, 30-39)
function getAgeBins(data: { age: number }[]) {
  const bins: Record<string, number> = {};

  data.forEach(({ age }) => {
    const binStart = Math.floor(age / 10) * 10;
    const binLabel = `${binStart}–${binStart + 9}`;
    bins[binLabel] = (bins[binLabel] || 0) + 1;
  });

  return Object.entries(bins).sort((a, b) => {
    const aStart = parseInt(a[0].split('–')[0], 10);
    const bStart = parseInt(b[0].split('–')[0], 10);
    return aStart - bStart;
  }).map(([range, count]) => ({
    range,
    count,
  }));
}

const AgeHistogram: React.FC<AgeHistogramProps> = ({ data }) => {
  const histogramData = getAgeBins(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill={colors.gray600} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AgeHistogram;