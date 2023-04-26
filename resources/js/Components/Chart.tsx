import React from 'react';
import BaseChart from 'react-apexcharts';
import { isMobile } from 'react-device-detect';

function Chart({ data }: { data: ChartDTO }) {
    const defaultHeight = 300;
    let height = data.options.chart?.height ?? defaultHeight;
    const maxHeight = Math.min(window.innerHeight * 0.5, height);
    height = isMobile ? maxHeight : Math.min(height, window.innerHeight * 0.55);

    return (
        <BaseChart options={data.options} series={data.options.series} {...data.options.chart} height={height} />
    );
}

export default Chart;