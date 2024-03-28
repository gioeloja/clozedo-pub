import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale, PointElement, Filler);


const BarChart = ({ xvalues, yvalues, ystepsize, toolTipLabel, indexAxis = 'x'}) => {
  const chartData = {
    labels: xvalues,
    datasets: [
      {
        label: toolTipLabel,
        data: yvalues,
        backgroundColor: 'rgba(50, 54, 80, 0.8)', // Bar color
        borderColor: '#6069a8', // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: indexAxis,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#bebebe',
        },
      },
      y: {
        suggestedMin: 0,
        ticks: {
          color: '#bebebe',
          stepSize: ystepsize
        },
        grid: {
          borderDash: [10],
          borderColor: '#FFFFFF',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
