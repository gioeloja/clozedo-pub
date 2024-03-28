
import React from 'react';

const BestSale = ({ dataSet }) => {
  let bestSaleItem = {};


  if (dataSet.length > 0) {
    const soldListings = dataSet.filter(entry => entry.status === 'sold_out');
    bestSaleItem = soldListings.reduce((prevEntry, currentEntry) => {
      if (parseInt(currentEntry.price_sold) > parseInt(prevEntry.price_sold)) {
        return currentEntry;
      } else {
        return prevEntry;
      }
    });
  }

  let title = bestSaleItem.title
  let price = Number(bestSaleItem.price_sold).toFixed(2);

  const dateStr = '2022-10-06T15:47:35-07:00';

  const dateSold = new Date(bestSaleItem.date_sold);
  const dateListed = new Date(bestSaleItem.date_listed);
  const differenceMs = Math.abs(dateListed - dateSold);
  let dateDiff = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));


  let formattedDate = dateSold.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (!title) {
    title = 'None'
    price = '--'
    formattedDate = '--'
    dateDiff = '--'
  }

  return (
    <div className="w-full h-full rounded-lg shadow-md p-4">
      <div className="mb-2 2xl:mb-4 ">
        <h2 className="text-lg font-semibold text-white pb-1 2xl:pb-3">Best Sale</h2>
        <hr className="border-gray-500" />
      </div>
      <h2 className="text-sm 2xl:text-lg 3xl:text-xl font-bold mt-1 text-gray-300 text-center">{title}</h2>

      <div className="flex 2xl:mt-5 3xl:mt-10 3xl:m-5">
        <div className="w-3/4">
          <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Price:</p>
          <p className="text-xl 2xl:text-2xl 3xl:text-3xl pb-2 font-bold text-[#6069a8]">${price}</p>
          <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Sold on:</p>
          <p className="text-xl 2xl:text-2xl pb-2 3xl:text-3xl font-bold text-[#6069a8]">{formattedDate}</p>
          <p className="text-gray-500 font-semibold text-sm 2xl:text-md 3xl:text-lg">Sell Time:</p>
          <p className="text-xl 2xl:text-2xl pb-2 3xl:text-3xl font-bold text-[#6069a8]">{dateDiff} days</p>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <a href={bestSaleItem.link} target="_blank" rel="noopener noreferrer">
            <img src={bestSaleItem.picUrl} alt={bestSaleItem.title} className="max-w-full h-auto rounded-3xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BestSale;
