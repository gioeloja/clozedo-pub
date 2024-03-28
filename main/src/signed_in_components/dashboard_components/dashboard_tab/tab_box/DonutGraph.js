import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement, 
  Tooltip,
  Legend
)


const DonutGraph = ({ labels, counts, toolTipLabel, showLegend}) => {

  const options = {
    plugins: {
      legend: showLegend,
    },
    maintainAspectRatio: false 
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: toolTipLabel,
        data: counts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className='items-center justify-center flex h-full w-full'>
      <Doughnut data={chartData} 
      options={options}
      >

      </Doughnut></div>
  )
};

export default DonutGraph;
