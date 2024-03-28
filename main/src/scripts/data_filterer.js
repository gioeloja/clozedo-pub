
// Filters the json data by time, taking in a start and end parameter
// sold is a boolean specifying if you want to use date sold or date listed
// True is for date sold, 0 is for date listed
function filterDataByTime(jsonData, sold, start, end) {
    const data = jsonData;
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Set end date to 23:59:59.999

    const filteredEntries = data.filter((entry) => {
        
      if (sold) {
        const date = new Date(entry.date_sold);
        if(date >= startDate && date <= endDate) {
          return true
        }
        else {
          return false
        }
      } else {
        const date = new Date(entry.date_listed);
        return date >= startDate && date <= endDate;
      }
    });
    return filteredEntries;
  }

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
}
  


// Filters the json data by a brand list
function filterDataByBrands(jsonData, brandList) {
    const filteredEntries = jsonData.filter(entry => brandList.includes(entry.brand));
    return filteredEntries;
  }



  function getTimeScale(firstDate, lastDate, sold = true) {
    const date1 = new Date(firstDate);
    const date2 = new Date(lastDate);
  
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const timeDiff = Math.abs(date2 - date1);
    const daysDiff = Math.ceil(timeDiff / ONE_DAY_MS);

    const shortMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    if (daysDiff === 0) {
      // Same day
      return [`${sold ? 'hour_sold' : 'hour_listed'}`, { "4 AM": 0, "8 AM": 0, "12 PM": 0, "4 PM": 0, "8 PM": 0, "12 AM": 0 }];
    } else if (daysDiff <= 7 && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()) {
      // Same month, less than or equal to 7 days apart
      const res = {};
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(date1.getTime() + i * ONE_DAY_MS);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        res[`${month}/${day}`] = 0;
      }
      return [`${sold ? 'month_day_sold' : 'month_day_listed'}`, res];
    } else if (daysDiff <= 7) {
      // Different months, less than or equal to 7 days apart
      const res = {};
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(date1.getTime() + i * ONE_DAY_MS);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        res[`${month}/${day}`] = 0;
      }
      return [`${sold ? 'month_day_sold' : 'month_day_listed'}`, res];
      
    } else if (date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()) {
      // Same month, more than 7 days apart
      const res = {};
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(date1.getTime() + i * ONE_DAY_MS);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        res[`${month}/${day}`] = 0;
      }
      return [`${sold ? 'month_day_sold' : 'month_day_listed'}`, res];
    } else if (date1.getFullYear() === date2.getFullYear()) {
      // Same year
      const res = {};
      for (let i = 0; i <= date2.getMonth() - date1.getMonth(); i++) {
        const month = shortMonths[date1.getMonth() + i];
        res[month] = 0;
      }
      return [`${sold ? 'str_month_sold' : 'str_month_listed'}`, res];
    } else {
      // Different years
      const res = {};
      for (let i = 0; i <= date2.getFullYear() - date1.getFullYear(); i++) {
        const year = date1.getFullYear() + i;
        res[year] = 0;
      }
      return [`${sold ? 'year_sold' : 'year_listed'}`, res];
    }
  }

  const dateString = "2023-07-28T00:09:59-07:00";
  const dateObj = new Date(dateString);
  
  // Get the time zone offset in minutes
  const offsetMinutes = dateObj.getTimezoneOffset();

  console.log(offsetMinutes); // Output: -07:00
  

module.exports = {
	filterDataByTime: filterDataByTime,
  filterDataByBrands: filterDataByBrands,
  getTimeScale: getTimeScale,
  formatDateToYYYYMMDD: formatDateToYYYYMMDD
  };
  