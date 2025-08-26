import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { TreemapChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import styled from 'styled-components';
import { textStyles } from '../styles/textStyles';
import colors from '../styles/colors';

import { continentColors, continentMap } from "../styles/continentData";
echarts.use([TreemapChart, TooltipComponent, CanvasRenderer]);

interface GeoChartProps {
  data: { nationality: string }[];
}

const GeoChart: React.FC<GeoChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const nationalityCount: Record<string, number> = {};
    data.forEach((item) => {
      const country = item.nationality?.trim();
      if (!country) return;
      nationalityCount[country] = (nationalityCount[country] || 0) + 1;
    });

    const treemapData = Object.entries(nationalityCount).map(([country, value]) => {
      const continent = continentMap[country] || 'Unknown';
      return {
        name: country,
        value,
        itemStyle: {
          color: continentColors[continent]
        }
      };
    });

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} participants' },
      series: [
        {
          type: 'treemap',
          data: treemapData,
          label: {
            show: true,
            formatter: '{b}'
          },
          leafDepth: 1,
          roam: false,
        }
      ]
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
    };
  }, [data]);

return <Container ref={chartRef} />;

//   return (
//     <Container>
//         {/* <div ref={chartRef} style={{ width: '100%', height: '400px' }} /> */}
//     </Container> 
//   );
};

export default GeoChart;



const Container = styled.div`
flex: 1;
width: '100%';
`;
