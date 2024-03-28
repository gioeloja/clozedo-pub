const filterJsonByCount = (dataSet, category) => {
  let data = dataSet.filter(entry => entry.status == "sold_out");
  data = data.filter(entry => entry.display_status !== 'Order Cancelled')
  let brandCounts = {};

  for (const sale of data) {
    if (!brandCounts[sale[category]]) {
      brandCounts[sale[category]] = 1;
    } else {
      brandCounts[sale[category]]++;
    }
  }

  let sortedCounts = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  brandCounts = sortedCounts.slice(0, 10);

  const res = brandCounts.reduce((dict, [brand, value]) => {
    dict[brand] = value;
    return dict;
  }, {});

  return res;
}


const filterJsonByPrice = (dataSet, category) => {
  let data = dataSet.filter(entry => entry.status == "sold_out");
  data = data.filter(entry => entry.display_status !== 'Order Cancelled')
  
  const brandTotals = {};
  const brandCounts = {};

  for (const sale of data) {
    if (!brandTotals[sale[category]]) {
      brandTotals[sale[category]] = parseInt(sale["price_sold"]);
      brandCounts[sale[category]] = 1;
    } else {
      brandTotals[sale[category]] += parseInt(sale["price_sold"]);
      brandCounts[sale[category]]++;
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

  sortedPrices = sortedPrices.slice(0, 10);

  const res = sortedPrices.reduce((dict, [brand, value]) => {
    dict[brand] = value;
    return dict;
  }, {});

  return res;
}

const filterJsonBySellTime = (dataSet, category) => {
  let data = dataSet.filter(entry => entry.status == "sold_out");
  data = data.filter(entry => entry.display_status !== 'Order Cancelled')
  
  const brandTotals = {};
  const brandCounts = {};

  for (const sale of data) {
    const listed = new Date(sale["date_listed"]);
    const sold = new Date(sale["date_sold"]);
    const diffInMs = Math.abs(listed - sold);
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    if (!brandTotals[sale[category]]) {
      brandTotals[sale[category]] = diffInDays;
      brandCounts[sale[category]] = 1;
    } else {
      brandTotals[sale[category]] += diffInDays;
      brandCounts[sale[category]]++;
    }
  }

  const averageSellTimes = {};

  for (const brand in brandTotals) {
    if(brandCounts[brand] > 0) {
      const averageTime = brandTotals[brand] / brandCounts[brand];
      averageSellTimes[brand] = averageTime;
    }
  }

  let sortedTimes = Object.entries(averageSellTimes).sort((a, b) => a[1] - b[1]);


  sortedTimes = sortedTimes.slice(0, 10);

  const res = sortedTimes.reduce((dict, [brand, value]) => {
    dict[brand] = value;
    return dict;
  }, {});

  return res;
}

function filterJsonBySellThrough(data, category) {

  const activeListings = data.filter(entry => entry.status === 'available');
  const soldListings = data.filter(entry => entry.status === 'sold_out');

  const brandActiveCounts = {};
  const brandSoldCounts = {};

  activeListings.forEach(listing => {
    if (!brandActiveCounts[listing[category]]) {
      brandActiveCounts[listing[category]] = 1;
    } else {
      brandActiveCounts[listing[category]]++;
    }
  });

  soldListings.forEach(listing => {
    if (!brandSoldCounts[listing[category]]) {
      brandSoldCounts[listing[category]] = 1;
    } else {
      brandSoldCounts[listing[category]]++;
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

  sortedSellThroughs = sortedSellThroughs.slice(0, 10);

  const res = sortedSellThroughs.reduce((dict, [brand, value]) => {
    dict[brand] = value;
    return dict;
  }, {});

  return res;
}

module.exports = {
	filterJsonByCount: filterJsonByCount,
  filterJsonByPrice: filterJsonByPrice,
  filterJsonBySellThrough:filterJsonBySellThrough,
  filterJsonBySellTime:filterJsonBySellTime,
  };