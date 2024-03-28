import React, { useState, useEffect } from 'react';
import DonutGraph from '../dashboard_tab/tab_box/DonutGraph.js'
import GraphDropdown from '../dashboard_tab/carousel/GraphDropdown.js'


const ListingsBreakdown = ({ dataSet }) => {
  const [category, setCategory] = useState('brand');
  const [title, setTitle] = useState('Brand')
  const [counts, setCounts] = useState({});
  
  useEffect(() => {
    // Calculate month counts based on the category and dataSet
    
    const calculatedCounts = () => {

      const counts = dataSet.reduce((acc, curr) => {
    
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
      const sortedCounts = Object.fromEntries(countsArray.slice(0, 30));
      return sortedCounts;
    };

    // Update month counts when the category changes
    const updatedCounts = calculatedCounts();
    setCounts(updatedCounts);
  }, [category, dataSet]);


  const options = [
    { name: 'Brand', dictValue: 'brand' },
    { name: 'Category', dictValue: 'category' },
    { name: 'Gender', dictValue: 'gender' },
  ]
  

  const handleCategoryChange = (categorySetting) => {
    setCategory(categorySetting);
    setTitle(categorySetting.charAt(0).toUpperCase() + categorySetting.slice(1))
  };

  return (
    <div className='m-5 flex flex-col w-full h-full'>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold text-white pb-3'>Listings Breakdown by {title}</h1>
        <GraphDropdown options={options} onCategoryChange={handleCategoryChange} />
      </div>
      <div className='flex flex-grow justify-center'>
        <div className='h-5/6 w-11/12 mt-4 2xl:mt-8'>
          <DonutGraph labels={Object.keys(counts)} counts={Object.values(counts)} toolTipLabel={"Count"} showLegend={false} />
        </div>
      </div>
      {/* <div>PUT DETAILS HERE</div> */}
    </div>
  );
};

export default ListingsBreakdown;
