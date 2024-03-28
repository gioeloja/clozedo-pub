import React from 'react';

const BestSale = ({ dataSet }) => {
  const soldListings = dataSet.filter(entry => entry.status === 'sold_out');
  const brandSalesCounts = soldListings.reduce((counts, entry) => {
    const brand = entry.brand;
    counts[brand] = (counts[brand] || 0) + 1;
    return counts;
  }, {});

  let brandWithMostSales = Object.keys(brandSalesCounts).reduce((brand, currBrand) => {
    if (!brand || brandSalesCounts[currBrand] > brandSalesCounts[brand]) {
      return currBrand;
    }
    return brand;
  }, "");

  const filteredSalesEntries = soldListings.filter((entry) => entry.brand === brandWithMostSales);

  const totalSales = filteredSalesEntries.length;
  const totalRevenue = filteredSalesEntries.reduce((sum, entry) => sum + parseInt(entry.price_sold), 0);

  // Calculate average sell price
  let averageSellPrice = 0;
  if (totalSales > 0) {
    averageSellPrice = (totalRevenue / totalSales).toFixed(2);
  }

  // Calculate average sell time
  let averageSellTime = 0;
  if (totalSales > 0) {
    averageSellTime = (filteredSalesEntries.reduce((sum, entry) => {
      const sellTime = Math.ceil((new Date(entry.date_sold) - new Date(entry.date_listed)) / (1000 * 60 * 60 * 24));
      return sum + sellTime;
    }, 0) / totalSales).toFixed(0);
  }

  // Default average sell price and sell time to zero if calculated values are NaN
  if (isNaN(averageSellPrice)) {
    averageSellPrice = 0;
  }
  if (isNaN(averageSellTime)) {
    averageSellTime = 0;
  }
  if (!brandWithMostSales) {
    brandWithMostSales = "None"
  }


  return (
    <div className="w-full h-full rounded-lg shadow-md p-4">
      <div className="mb-2 2xl:mb-4">
        <h2 className="text-lg font-semibold text-white pb-1 2xl:pb-3">Best Brand</h2>
        <hr className="border-gray-500" />
      </div>
      <h2 className="xl:text-lg 2xl:text-xl 3xl:text-2xl font-bold 2xl:mt-1 text-gray-300 text-center">{brandWithMostSales}</h2>

      <div className="flex text-center">
        <div className="w-full ">
          <div className='flex gap-5 2xl:gap-10 mt-2 2xl:mt-5 3xl:mt-10 3xl:m-5 pb-2 2xl:pb-6 justify-center'>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg ">Total Sales:</p>
              <p className="text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-[#6069a8]">{totalSales}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Total Revenue:</p>
              <p className="text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-[#6069a8]">${totalRevenue}</p>
            </div>
          </div>
          <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Sell Price:</p>
          <p className="text-xl 2xl:text-2xl 3xl:text-3xl pb-2 2xl:pb-6 font-bold text-[#6069a8]">${averageSellPrice}</p>
          <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Sell Time:</p>
          <p className="text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-[#6069a8]">{averageSellTime} days</p>
        </div>
      </div>

    </div>
  );
};

export default BestSale;
