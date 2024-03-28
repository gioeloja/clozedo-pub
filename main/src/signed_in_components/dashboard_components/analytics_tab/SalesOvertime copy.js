import React, { useState, useEffect } from 'react';
import LineGraph from '../dashboard_tab/carousel/LineGraph.js'
import GraphDropdown from '../dashboard_tab/carousel/GraphDropdown.js'


const SalesOvertime = ({ dataSet, firstDay, lastDay }) => {
  const [category, setCategory] = useState('Total Sales');
  const [monthCounts, setMonthCounts] = useState({});

  useEffect(() => {
    console.log(firstDay, lastDay)
    // Calculate month counts based on the category and dataSet
    const calculateMonthCounts = () => {
      let newMonthCounts = {};

      if (category === 'Total Sales') {
        newMonthCounts = dataSet.reduce((acc, curr) => {
          if (curr.status === 'available') {
            return acc;
          }
          if (!acc[parseInt(curr.month_sold)]) {
            acc[parseInt(curr.month_sold)] = 1;
          } else {
            acc[parseInt(curr.month_sold)]++;
          }
          return acc;
        }, {});
      } else {
        newMonthCounts = dataSet.reduce((acc, curr) => {
          if (curr.status === 'available') {
            return acc;
          }
          if (!acc[parseInt(curr.month_sold)]) {
            acc[parseInt(curr.month_sold)] = parseFloat(curr.price_sold);
          } else {
            acc[parseInt(curr.month_sold)] += parseFloat(curr.price_sold);
          }
          return acc;
        }, {});
      }

      return newMonthCounts;
    };

    // Update month counts when the category changes
    const updatedMonthCounts = calculateMonthCounts();
    setMonthCounts(updatedMonthCounts);
  }, [category, dataSet]);

  const month_dict = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
  };

  const sortedMonthCounts = {};
  for (let key in month_dict) {
    const monthName = month_dict[key];
    if (monthCounts[key]) {
      sortedMonthCounts[monthName] = monthCounts[key];
    } else {
      sortedMonthCounts[monthName] = 0;
    }
  }

  const val = Math.max(...Object.values(sortedMonthCounts)) / 8;
  const ystep = Math.round(val / 10) * 10;

  const options = [
    { name: 'Total Sales', dictValue: 'Total Sales' },
    { name: 'Revenue', dictValue: 'Revenue' },
  ];

  const handleCategoryChange = (categorySetting) => {
    setCategory(categorySetting);
    console.log(categorySetting);
  };

  return (
    <div className='m-5 flex flex-col w-full h-full'>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold text-white pb-3'>{category} Over Time</h1>
        <GraphDropdown options={options} onCategoryChange={handleCategoryChange} />
      </div>
      <div className='flex flex-grow justify-center'>
        <div className='h-3/4 w-3/4 mt-8'>
          <LineGraph xvalues={Object.keys(sortedMonthCounts)} yvalues={Object.values(sortedMonthCounts)} ystepsize={ystep} />
        </div>
      </div>
      {/* <div>PUT DETAILS HERE</div> */}
    </div>
  );
};

export default SalesOvertime;
