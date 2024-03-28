import React from 'react';

const ListingsSummary = ({ dataSet, numDaysInRange }) => {



  const totalListings = Object.keys(dataSet).length;
  const activeListings = dataSet.filter(entry => entry.status === 'available');
  const soldListings = dataSet.filter(entry => entry.status === 'sold_out');

  
  let totalActiveListings = Object.keys(activeListings).length 
  const totalSoldListings = Object.keys(soldListings).length 

  let sellThrough = 0;

  if (totalActiveListings === 0 && totalSoldListings === 0) {
    sellThrough = 0;
  } else if (totalActiveListings === 0 && totalSoldListings !== 0) {
    sellThrough = 100;
  } else {
    sellThrough = (totalSoldListings / totalActiveListings) * 100;
  }

  const totalPrices = dataSet.reduce((sum, entry) => sum + parseInt(entry.price || 0), 0);
  
  const averagePriceListed = totalPrices / totalListings || 0;
  
  let averageListingsPerDay = (totalListings / numDaysInRange).toFixed(2) || 0;
  
  if(totalActiveListings == 0) {
    totalActiveListings = "-"
  }

  const brandListingCounts = dataSet.reduce((counts, entry) => {
    const brand = entry.brand;
    counts[brand] = (counts[brand] || 0) + 1;
    return counts;
  }, {});

  let brandWithMostListings = Object.keys(brandListingCounts).reduce((brand, currBrand) => {
    if (!brand || brandListingCounts[currBrand] > brandListingCounts[brand]) {
      return currBrand;
    }
    return brand;
  }, "");

  if (!brandWithMostListings) {
    brandWithMostListings = "None"
  }

  if (isNaN(averageListingsPerDay)) {
    averageListingsPerDay = 0;
  }


  return (
<div className="w-full h-full rounded-lg shadow-md p-4">
  <div className="mb-2 2xl:mb-4">
    <h2 className="text-lg font-semibold text-white pb-3">Listings Summary</h2>
    <hr className="border-gray-500" />
  </div>

  <div className="flex items-center justify-center mt-2 2xl:mt-7">
    <div className="grid grid-cols-2 gap-5 2xl:gap-20 text-center">
      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Total Listings Made</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">{totalListings}</p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Active Listings</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">{totalActiveListings}</p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Average Price Listed At</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">${averagePriceListed.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Most Listed Brand</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">{brandWithMostListings}</p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Sell-Through</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">{sellThrough.toFixed(2)}%</p>
      </div>

      <div>
        <p className="text-gray-500 font-semibold text-md 3xl:text-lg">Average Listings / Day</p>
        <p className="text-3xl 3xl:text-4xl pt-2 font-bold text-[#6069a8]">{averageListingsPerDay}</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default ListingsSummary;
