import React from 'react';
import DonutGraph from './DonutGraph';

const TabTotalSold = ({dataSet}) => {
  // filters json to only include 5 brands that are most frequent
  const filterJson = (dataSet) => {
    let data = dataSet.filter(entry => entry.status == "sold_out")
    data = data.filter(entry => entry.display_status !== 'Order Cancelled')
    
    const count = {};
    data.forEach(entry => {
      if (entry.brand && entry.brand in count) {
        count[entry.brand]++;
      } else if (entry.brand) {
        count[entry.brand] = 1;
      }
    });
    
    const sortedBrands = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 5);
    
    const result = [];
    data.forEach(entry => {
      if (entry.brand && sortedBrands.includes(entry.brand)) {
        result.push(entry);
      }
    });


    return (
      result
    )
  }

  const data = filterJson(dataSet);
  
  const brandCounts = data.reduce((acc, curr) => {
    if (!acc[curr.brand]) {
      acc[curr.brand] = 1;
    } else {
      acc[curr.brand]++;
    }
    return acc;
  }, {});
  

  const brands = Object.keys(brandCounts);
  const counts = Object.values(brandCounts);


  return (
    <div className='h-full'>
      <div className='pt-2 flex flex-col items-center'>
        <h2 className="text-md 2xl:text-lg font-semibold text-white pb-2">Top Brands Sold</h2>
      </div>
      
      <DonutGraph labels={brands} counts={counts} toolTipLabel={"Count"} showLegend={false}/>
      
    </div>

  );
};





export default TabTotalSold;


