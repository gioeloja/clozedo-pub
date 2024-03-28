import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, LineElement, Tooltip, TimeScale,LinearScale, PointElement, Filler } from 'chart.js';

ChartJS.register(Tooltip, LineElement, LinearScale, TimeScale, PointElement, Filler);

const LineGraph = ({ salesData, timeScale }) => {
  // Aggregate sales count based on the desired time scale (years, months, days, or hours)
  const salesCountMap = new Map();
  salesData.forEach((entry) => {
    const dateSold = new Date(entry.date_sold);

    let key;
    if (timeScale === 'years') {
      key = dateSold.getFullYear();
    } else if (timeScale === 'months') {
      key = dateSold.getFullYear() + '-' + (dateSold.getMonth() + 1);
    } else if (timeScale === 'days') {
      key = dateSold.toISOString().split('T')[0];
    } else if (timeScale === 'hours') {
      key = dateSold.toISOString().slice(0, 13);
    }

    salesCountMap.set(key, (salesCountMap.get(key) || 0) + 1);
  });

  // Extract and sort x values (unique time scale units)
  let xvalues = Array.from(salesCountMap.keys());
  if (timeScale === 'years') {
    xvalues = xvalues.sort((a, b) => a - b);
  } else if (timeScale === 'months' || timeScale === 'days' || timeScale === 'hours') {
    xvalues = xvalues.sort((a, b) => new Date(a) - new Date(b));
  }

  // Use the aggregated sales count as y values
  const yvalues = xvalues.map((key) => salesCountMap.get(key));

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
          display: false,
        },
        ticks: {
          color: '#bebebe',
        },
      },
      y: {
        suggestedMin: 0,
        ticks: {
          stepSize: 1, // You can adjust this to set the step size for the y-axis
          color: '#bebebe',
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;