import React from 'react';
import DonutGraph from './DonutGraph';
const TabTotalSold = ({dataSet}) => {

  const filterJson = (dataSet) => {
    let data = dataSet.filter(entry => entry.status == "sold_out")
    data = data.filter(entry => entry.display_status !== 'Order Cancelled')
    const brandTotals = {};
    const brandCounts = {};

    for (const sale of data) {
      const { brand, price_sold } = sale;
      if (!brandTotals[brand]) {
        brandTotals[brand] = parseInt(price_sold);
        brandCounts[brand] = 1;
      } else {
        brandTotals[brand] += parseInt(price_sold);
        brandCounts[brand]++;
      }
    }

    const averageSalePrices = {};

    for (const brand in brandTotals) {
      if(brandCounts[brand] > 0) {
        const averagePrice = brandTotals[brand] / brandCounts[brand];
        averageSalePrices[brand] = averagePrice;
      }
    }

    let sortedPrices = Object.entries(averageSalePrices).sort((a, b) => b[1] - a[1]);

    sortedPrices = sortedPrices.slice(0, 5);

    const res = sortedPrices.reduce((dict, [brand, value]) => {
      dict[brand] = value;
      return dict;
    }, {});

    return res;
  }

  const data = filterJson(dataSet);
  
  console.log(data)

  const brands = Object.keys(data);
  const counts = Object.values(data);

  return (
    <div className='h-full'>
      <div className='pt-2 flex flex-col items-center'>
        <h2 className="text-md 2xl:text-lg font-semibold text-white pb-2">Average Sell Price By Brand</h2>
      </div>
      
      <DonutGraph labels={brands} counts={counts} toolTipLabel={"Price"} showLegend={false}/>
      
    </div>

  );
};





export default TabTotalSold;


