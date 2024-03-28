import React, { useState, useEffect } from 'react';
import BarGraph from './BarGraph.js';
import GraphDropdown from './GraphDropdown.js';


const ActiveListingsCarousel = ({dataSet}) => {
  const [category, setCategory] = useState('brand');
  const [title, setTitle] = useState('Brand')

  const handleCategoryChange = (categorySetting) => {
    setCategory(categorySetting);
    setTitle(categorySetting.charAt(0).toUpperCase() + categorySetting.slice(1))
  };

  let data = dataSet;

  const counts = data.reduce((acc, curr) => {
    if(curr.status == "sold_out") {
      return acc
    }

    if (!acc[curr[category]]) {
      acc[curr[category]] = 1;
    } else {

      acc[curr[category]]++;
    }
    
    return acc;
  }, {});

  // Convert the genderCounts object into an array of key-value pairs
  const countsArray = Object.entries(counts);

  // Sort the array based on the count (value) in descending order
  countsArray.sort((a, b) => b[1] - a[1]);

  // Convert the sorted array back into an object
  const sortedCounts = Object.fromEntries(countsArray.slice(0, 10));

  const val = Math.max(...Object.values(sortedCounts)) / 8
  const ystep = Math.round(val / 10) * 10

  const options = [
    { name: 'Brand', dictValue: 'brand' },
    { name: 'Category', dictValue: 'category' },
    { name: 'Gender', dictValue: 'gender' },
  ]


  return(
    <div className='m-5 flex flex-col h-full '>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold text-white pb-3'>Active Listings Breakdown by {title}</h1>
        <GraphDropdown options={options} onCategoryChange={handleCategoryChange}/>
      </div>
      
      <div className='flex flex-grow justify-center'>
        <div className='h-3/4 w-3/4 mt-1 2xl:mt-5 '>
          <BarGraph xvalues={Object.keys(sortedCounts)} yvalues={Object.values(sortedCounts)} ystepsize={ystep}/>
        </div>
      </div>
    </div>

    )
};

export default ActiveListingsCarousel;
