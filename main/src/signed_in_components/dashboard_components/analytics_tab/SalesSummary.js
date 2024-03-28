import React, { useState, useEffect } from 'react';
import { Loading } from '@nextui-org/react';

const SoldSummary = ({ dataSet, numDaysInRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [averageRevenuePerItem, setAverageRevenuePerItem] = useState(0);
  const [averageSellTime, setAverageSellTime] = useState(0);
  const [averageSalesPerDay, setAverageSalesPerDay] = useState(0);

  useEffect(() => {
    const calculateStatistics = async () => {
      // Calculate Total Sales
      let soldListings = dataSet.filter(entry => entry.status === 'sold_out');
      soldListings = soldListings.filter(entry => entry.display_status !== 'Order Cancelled')
      const totalSalesValue = Object.keys(soldListings).length;
      setTotalSales(totalSalesValue);

      // Calculate Total Revenue
      const totalRevenueValue = soldListings.reduce((sum, entry) => sum + parseInt(entry.price_sold || 0), 0);
      setTotalRevenue(totalRevenueValue);

      // Calculate Average Price
      const averagePriceValue = totalRevenueValue / totalSalesValue || 0;
      setAveragePrice(averagePriceValue);

      // Calculate Average Revenue Per Item
      const averageRevenuePerItemValue = totalRevenueValue / totalSalesValue || 0;
      setAverageRevenuePerItem(averageRevenuePerItemValue);

      const averageSellTimeValue = await calculateAverageSellTime(soldListings);
      setAverageSellTime(averageSellTimeValue);

      // Calculate Average Sales Per Day
      let averageSalesPerDayValue = (totalSalesValue / numDaysInRange).toFixed(2) || 0;
      if (isNaN(averageSalesPerDayValue)) {
        averageSalesPerDayValue = 0;
      }
      setAverageSalesPerDay(averageSalesPerDayValue);

      setIsLoading(false); // Set isLoading to false when calculations are done
    };

    calculateStatistics();
  }, [dataSet, numDaysInRange]);

  const calculateAverageSellTime = async (soldListings) => {
    let totalSellTime = 0

    soldListings.forEach(entry => {
      if (entry.date_sold) {
        totalSellTime += Math.ceil(Math.abs(new Date(entry.date_listed) - new Date(entry.date_sold)) / (1000 * 60 * 60 * 24));
      }

    });

    const averageSellTimeValue = totalSellTime / soldListings.length || 0;
    return averageSellTimeValue
  };

  if (!isLoading) {
    // Show a loading screen while calculating statistics
    return (
      <div className="w-full h-full rounded-lg shadow-md p-4">
        <div className="">
          <h2 className="text-lg font-semibold text-white pb-3">Sales Summary</h2>
          <hr className="border-gray-500" />
        </div>
        <div className="flex items-center justify-center mt-3 2xl:mt-7">
          <div className="grid grid-cols-2 gap-2 2xl:gap-5 3xl:gap-10 text-center">
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Total Sales</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl 2x:pt-2 font-bold text-[#6069a8]">{totalSales}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Total Revenue</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl 2x:pt-2 font-bold text-[#6069a8]">${totalRevenue.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Price</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl 2x:pt-2 font-bold text-[#6069a8]">${averagePrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Sell Time</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl 2x:pt-2 font-bold text-[#6069a8]">{averageSellTime.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Rev. / Item</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl  2x:pt-2 font-bold text-[#6069a8]">${averageRevenuePerItem.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Average Sales / Day</p>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl  2x:pt-2 font-bold text-[#6069a8]">{averageSalesPerDay}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="w-full h-full rounded-lg shadow-md p-4">
      </div>)
  }

};

export default SoldSummary;
