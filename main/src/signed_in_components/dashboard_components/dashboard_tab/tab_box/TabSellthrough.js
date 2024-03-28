import React from 'react';
import DonutGraph from './DonutGraph';

const TabTotalSold = ({dataSet}) => {
  
  function filterBySellThrough(data) {
  
    const activeListings = data.filter(entry => entry.status === 'available');
    let soldListings = data.filter(entry => entry.status === 'sold_out');
    soldListings = soldListings.filter(entry => entry.display_status !== 'Order Cancelled')
    
    const brandActiveCounts = {};
    const brandSoldCounts = {};
  
    activeListings.forEach(listing => {
      const { brand } = listing;
      if (!brandActiveCounts[brand]) {
        brandActiveCounts[brand] = 1;
      } else {
        brandActiveCounts[brand]++;
      }
    });
  
    soldListings.forEach(listing => {
      const { brand } = listing;
      if (!brandSoldCounts[brand]) {
        brandSoldCounts[brand] = 1;
      } else {
        brandSoldCounts[brand]++;
      }
    });
  
    const sellThroughRates = {};
  
    for (const brand in brandActiveCounts) {
      const activeCount = brandActiveCounts[brand];
      const soldCount = brandSoldCounts[brand] || 0;

      if(soldCount > 5) {
        const sellThroughRate = activeCount === 0 ? 100 : (soldCount / activeCount) * 100;
        sellThroughRates[brand] = sellThroughRate;
      }
    }

    let sortedSellThroughs = Object.entries(sellThroughRates).sort((a, b) => b[1] - a[1]);

    sortedSellThroughs = sortedSellThroughs.slice(0, 5);

    const res = sortedSellThroughs.reduce((dict, [brand, value]) => {
      dict[brand] = value;
      return dict;
    }, {});

    return res;
  }

  const data = filterBySellThrough(dataSet);
  
  console.log(data)

  const brands = Object.keys(data);
  const counts = Object.values(data);

  return (
    <div className='h-full'>
      <div className='pt-2 flex flex-col items-center'>
        <h2 className="text-md 2xl:text-lg font-semibold text-white pb-2">Top Sellthrough Rates by Brand</h2>
      </div>
      <DonutGraph labels={brands} counts={counts} toolTipLabel={"Sell-through"} showLegend={false}/>
    </div>

  );
};





export default TabTotalSold;


