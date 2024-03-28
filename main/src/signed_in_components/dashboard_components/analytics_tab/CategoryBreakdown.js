import React, { useState, useEffect } from 'react';
import BarGraph from '../dashboard_tab/carousel/BarGraph.js'
import GraphDropdown from '../dashboard_tab/carousel/GraphDropdown.js'
import { filterJsonByCount, filterJsonByPrice, filterJsonBySellThrough, filterJsonBySellTime } from './FilterScripts.js';


const CategoryBreakdown = ({ dataSet }) => {
  const [category, setCategory] = useState('Total Sales');
  let data = {}

  if(category == "Total Sales") {
    data = filterJsonByCount(dataSet, "category");
  }
  else if(category == "Average Sale Price") {
    data = filterJsonByPrice(dataSet, "category");
  }
  else if(category == "Average Sell Time") {
    data = filterJsonBySellTime(dataSet, "category");
  }
  else if(category == "Sell Through Rate") {
    data = filterJsonBySellThrough(dataSet, "category");
  }

  const brands = Object.keys(data);
  const counts = Object.values(data);

  const options = [
    { name: 'Total Sales', dictValue: 'Total Sales' },
    { name: 'Average Sale Price', dictValue: 'Average Sale Price' },
    { name: 'Average Sell Time', dictValue: 'Average Sell Time' },
    { name: 'Sell Through Rate', dictValue: 'Sell Through Rate' },
  ];

  const handleCategoryChange = (categorySetting) => {
    setCategory(categorySetting);
  };

  return (
    <div className='m-5 flex flex-col w-full h-full'>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold text-white pb-3'>Category Breakdown by {category}</h1>
        <GraphDropdown options={options} onCategoryChange={handleCategoryChange} />
      </div>
      <div className='flex flex-grow justify-left'>
        <div className='h-5/6 w-11/12 mt-8'>
          <BarGraph xvalues={brands} yvalues={counts} toolTipLabel={"Count"} indexAxis='y' />
        </div>
      </div>
      {/* <div>PUT DETAILS HERE</div> */}
    </div>
  );
};

export default CategoryBreakdown;
