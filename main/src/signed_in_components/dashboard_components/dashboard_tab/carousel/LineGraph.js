import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(Tooltip, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const LineGraph = ({ xvalues, yvalues, ystepsize }) => {

  const chartData = {
    labels: xvalues,
    datasets: [
      {
        label: 'Count',
        data: yvalues,
        backgroundColor: 'rgba(50, 54, 80, 0.5)', // Fill color under the line
        borderColor: '#6069a8', // Line color
        borderWidth: 4,
        pointBorderWidth: 4,
        fill: true, // Enable fill under the line
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: false,
    },
    showTooltips: true,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#bebebe"
        }
      },
      y: {
        suggestedMin: 0,
        ticks: {
          stepSize: ystepsize,
          color: "#bebebe"
        },
        grid: {
          borderDash: [10],
          borderColor: `#FFFFFF`
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
