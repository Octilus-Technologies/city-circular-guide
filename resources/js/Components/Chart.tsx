import React from 'react';
import BaseChart from 'react-apexcharts';

function Chart({ data }: { data: ChartDTO }) {
    return (
        <BaseChart options={data.options} series={data.options.series} {...data.options.chart} />
    );
}

export default Chart;