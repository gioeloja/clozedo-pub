import React from 'react';
import LineGraph from './LineGraph.js';
import DonutGraph from '../tab_box/DonutGraph.js';
import { DatasetController } from 'chart.js';

const TotalRevenueCarousel = ({dataSet}) => {
    let data = dataSet;

    const monthCounts = data.reduce((acc, curr) => {
      if(curr.status == "available") {
        return acc
      }

      if (!acc[parseInt(curr.month_sold)]) {
        acc[parseInt(curr.month_sold)] = parseFloat(curr.price_sold);
      } else {

        acc[parseInt(curr.month_sold)] += parseFloat(curr.price_sold);
      }
      
      return acc;
    }, {});

    console.log(monthCounts)

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

    const val = Math.max(...Object.values(sortedMonthCounts)) / 8
    const ystep = Math.round(val / 10) * 10

    return(
      <div className='m-5 flex flex-col h-full '>
        <h1 className='text-lg font-semibold text-white pb-3 justify-center flex'>Revenue Overtime</h1>
        <div className='flex flex-grow justify-center'>
          <div className='h-3/4 w-3/4 mt-2 '>
            <LineGraph xvalues={Object.keys(sortedMonthCounts)} yvalues={Object.values(sortedMonthCounts)} ystepsize={ystep}/>
          </div>
        </div>
      </div>
  
      )
};

export default TotalRevenueCarousel;
