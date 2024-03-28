import React, { useState, useEffect } from 'react';
import { filterDataByBrands, filterDataByTime, formatDateToYYYYMMDD } from '../../../scripts/data_filterer';
import BrandDropdown from '../dashboard_tab/settings/BrandDropdown';
import TimeDropdown from '../dashboard_tab/settings/TimeDropdown';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { Loading } from '@nextui-org/react';
import Datepicker from 'react-tailwindcss-datepicker';
import SalesOvertime from './SalesOvertime';
import SalesBreakdown from './SalesBreakdown';
import BrandBreakdown from './BrandBreakdown';
import CategoryBreakdown from './CategoryBreakdown';
import ListingsBreakdown from './ListingsBreakdown';
import ListingsOvertime from './ListingsOvertime';
import SoldSummary from './SalesSummary';
import BestSale from './BestSale';
import BestBrand from './BestBrand';
import ListingsSummary from './ListingsSummary';

const Analytics = ({ socket }) => {
  const [unfilteredData, setUnfilteredData] = useState(null);
  const [data, setData] = useState([{}]);
  const [listingsData, setListingsData] = useState([{}]);
  const [brands, setBrands] = useState();
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [time, setTime] = useState("All Time")
  const [customRangeActive, setCustomRangeActive] = useState(false)
  const [customRange, setCustomRange] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  })


  const [isUpdatingData, setIsUpdatingData] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [numDaysInRange, setNumDaysInRange] = useState()
  const [cookieStatus, setCookieStatus] = useState(null)
  const [firstDay, setFirstDay] = useState("2000/01/01")
  const [lastDay, setLastDay] = useState("3000/01/01")


  useEffect(() => {
    setCookieStatus(secureLocalStorage.getItem("cookieStatus"))
    setIsUpdatingData(secureLocalStorage.getItem("updatingData"))

    // if updating data, connect to socket
    if (secureLocalStorage.getItem("updatingData") == "true") {
      socket.emit('updateData', { authuser: process.env.REACT_APP_USER })
      socket.on('status', (message) => {
        console.log(message)
        if (message == "UPDATING DONE") {
          updatingDone()
        }
      })

    }

    setNumDaysInRange(secureLocalStorage.getItem("dayDifference"))
    setFirstDay(secureLocalStorage.getItem("firstDate"))
    setLastDay(secureLocalStorage.getItem("lastDate"))


    if (secureLocalStorage.getItem("dataVersion")) {

      const date = new Date(secureLocalStorage.getItem("dataVersion") * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const newFormattedDate = `${month}/${day}/${year}`;
      setFormattedDate(newFormattedDate);

    }

    if (secureLocalStorage.getItem("salesData")) {
      setUnfilteredData(secureLocalStorage.getItem("salesData"))
      setData(secureLocalStorage.getItem("salesData"))
      setListingsData(secureLocalStorage.getItem("salesData"))
      setBrands(Array.from(new Set(secureLocalStorage.getItem("salesData").map(entry => entry.brand))))

    }
    else {
      var salesOptions = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/getSalesData`,
        headers: { 'content-type': 'application/json' },
        data: { "username": process.env.REACT_APP_USER }
      };


      axios.request(salesOptions).then(function (response) {
        setUnfilteredData(response.data)
        setData(response.data)
        setListingsData(response.data)
        setBrands(Array.from(new Set(unfilteredData.map(entry => entry.brand))))

      }).catch(function (error) {
        console.error(error.response);
      });


    }

  }, [])

  const handleTimeChange = (timeSetting) => {
    setTime(timeSetting)

    handleSettingChange(timeSetting, brands)
  }

  const handleBrandChange = (selected) => {
    setBrands(selected)

    if (customRangeActive) {
      let filteredData = filterDataByBrands(unfilteredData, selected)
      setData(filterDataByTime(filteredData, true, customRange.startDate, customRange.endDate))
    }
    else {
      handleSettingChange(time, selected)
    }

  }



  const handleCustomDateChange = (newValue) => {
    let data = filterDataByBrands(unfilteredData, brands)

    const first = new Date(newValue.startDate)
    const second = new Date(newValue.endDate)
    const differenceMs = Math.abs(first - second);
    const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    setNumDaysInRange(dayDifference)

    setFirstDay(newValue.startDate)
    setLastDay(newValue.endDate)
    setData(filterDataByTime(unfilteredData, true, newValue.startDate, newValue.endDate))
    setListingsData(filterDataByTime(unfilteredData, false, newValue.startDate, newValue.endDate))
    setCustomRangeActive(true)
    setCustomRange(newValue);
  }



  const handleSettingChange = (selectedTime, selectedBrands) => {
    let newData = filterDataByBrands(unfilteredData, selectedBrands)

    let newListingData = filterDataByBrands(unfilteredData, selectedBrands)
    newData = newListingData.filter(entry => entry.status === 'sold_out');
    if (selectedTime == "All Time") {
      setCustomRangeActive(false)
      setShowCustomRange(false);

      const today = new Date()
      const earliestDate = newListingData.reduce((minDate, entry) => {
        const currentDate = new Date(entry.date_listed);
        return currentDate < minDate ? currentDate : minDate;
      }, new Date());

      const firstDate = formatDateToYYYYMMDD(earliestDate)
      const lastDate = formatDateToYYYYMMDD(today)
      setFirstDay(firstDate)
      setLastDay(lastDate)

      const differenceMs = Math.abs(today - earliestDate);
      const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      setNumDaysInRange(dayDifference)
      newData = filterDataByTime(newData, true, firstDate, lastDate)
      newListingData = filterDataByTime(newListingData, false, firstDate, lastDate)
    }
    else if (selectedTime == "Today") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDateString = `${year}/${month}/${day}`;
      setNumDaysInRange(1)
      setFirstDay(currentDateString)
      setLastDay(currentDateString)

      newData = filterDataByTime(newData, true, currentDateString, currentDateString)
      newListingData = filterDataByTime(newListingData, false, currentDateString, currentDateString)
    }
    else if (selectedTime == "Last 7 Days") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      setNumDaysInRange(7)
      var sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      var sevenDaysAgoDateString = sevenDaysAgo.getFullYear() + '/' + (sevenDaysAgo.getMonth() + 1) + '/' + sevenDaysAgo.getDate();


      const currentDateString = `${year}/${month}/${day}`;
      setFirstDay(sevenDaysAgoDateString)
      setLastDay(currentDateString)

      newData = filterDataByTime(newData, true, sevenDaysAgoDateString, currentDateString)
      newListingData = filterDataByTime(newListingData, false, sevenDaysAgoDateString, currentDateString)

    }

    else if (selectedTime == "Current Week") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date();

      // get the first day of the week (Sunday)
      const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

      // get the last day of the week (Saturday)
      const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

      const differenceMs = Math.abs(today - firstDayOfWeek);
      const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      setNumDaysInRange(dayDifference)
      // format dates as YYYY/MM/DD
      const firstDayOfWeekDateString = firstDayOfWeek.getFullYear() + '/' + (firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0') + '/' + firstDayOfWeek.getDate().toString().padStart(2, '0');
      const lastDayOfWeekDateString = lastDayOfWeek.getFullYear() + '/' + (lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0') + '/' + lastDayOfWeek.getDate().toString().padStart(2, '0');

      setFirstDay(firstDayOfWeekDateString)
      setLastDay(lastDayOfWeekDateString)

      newData = filterDataByTime(newData, true, firstDayOfWeekDateString, lastDayOfWeekDateString)
      newListingData = filterDataByTime(newListingData, false, firstDayOfWeekDateString, lastDayOfWeekDateString)
    }

    else if (selectedTime == "Current Month") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date(); // Get current date
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get first day of current month
      const firstDayCurrentMonthDateString = `${firstDayOfMonth.getFullYear()}/${(firstDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}/${firstDayOfMonth.getDate().toString().padStart(2, '0')}`; // Format date as YYYY/MM/DD


      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const lastDayOfMonth = new Date(nextMonth - 1);
      const year = lastDayOfMonth.getFullYear();
      const month = lastDayOfMonth.getMonth() + 1;
      const day = lastDayOfMonth.getDate();

      const differenceMs = Math.abs(today - firstDayOfMonth);
      const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      setNumDaysInRange(dayDifference)

      const lastDayCurrentMonthDateString = year + '/' + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');

      setFirstDay(firstDayCurrentMonthDateString)
      setLastDay(lastDayCurrentMonthDateString)

      newData = filterDataByTime(newData, true, firstDayCurrentMonthDateString, lastDayCurrentMonthDateString)
      newListingData = filterDataByTime(newListingData, false, firstDayCurrentMonthDateString, lastDayCurrentMonthDateString)

    }

    else if (selectedTime == "Current Year") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const now = new Date(); // get the current date
      const year = now.getFullYear(); // get the current year
      const firstDayOfYear = new Date(year, 0, 1); // create a new date object for the first day of the year

      // format the date as "YYYY/MM/DD"
      const firstDayOfYearDateString = `${firstDayOfYear.getFullYear()}/${(firstDayOfYear.getMonth() + 1).toString().padStart(2, '0')}/${firstDayOfYear.getDate().toString().padStart(2, '0')}`;
      const lastDayOfYear = new Date(year, 11, 31); // Create new date object for last day of the year
      const lastDayOfYearDateString = lastDayOfYear.toISOString().slice(0, 10);


      const today = new Date()
      const differenceMs = Math.abs(today - firstDayOfYear);
      const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      setNumDaysInRange(dayDifference)

      setFirstDay(firstDayOfYearDateString)
      setLastDay(lastDayOfYearDateString)

      newData = filterDataByTime(newData, true, firstDayOfYearDateString, lastDayOfYearDateString)
      newListingData = filterDataByTime(newListingData, false, firstDayOfYearDateString, lastDayOfYearDateString)

    }
    else if (selectedTime == "Custom Range") {
      setShowCustomRange(true);
    }
    setListingsData(newListingData)
    setData(newData)
  }

  const updatingDone = async () => {
    setIsUpdatingData("false")
    secureLocalStorage.setItem("updatingData", "false")

    // Get sales data from Mongo
    var getSalesOptions = {
      method: 'POST',
      url: `${process.env.REACT_APP_DOMAIN}/api/getSalesData`,
      headers: { 'content-type': 'application/json' },
      data: { "username": process.env.REACT_APP_USER }
    };

    await axios.request(getSalesOptions).then(function (response) {
      setUnfilteredData(response.data)
      setData(response.data)
      setBrands(Array.from(new Set(unfilteredData.map(entry => entry.brand))))

      secureLocalStorage.setItem("salesData", response.data)
    }).catch(function (error) {
      console.error(error.response);
    });

    // Set new data version in Mongo and local storage
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);

    var setDateOptions = {
      method: 'POST',
      url: `${process.env.REACT_APP_DOMAIN}/api/setSettings`,
      headers: { 'content-type': 'application/json' },
      data: { "username": process.env.REACT_APP_USER, "settings": currentUnixTimestamp, "field": "dataVersion" }
    };

    await axios.request(setDateOptions).then(function (response) {
      secureLocalStorage.setItem("dataVersion", currentUnixTimestamp)
    }).catch(function (error) {
      console.error(error.response);
    });

    const date = new Date(currentUnixTimestamp * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const newFormattedDate = `${month}/${day}/${year}`;
    setFormattedDate(newFormattedDate);
  }

  const updateSalesData = async () => {
    setIsUpdatingData("true")
    secureLocalStorage.setItem("updatingData", "true")
    // Set sales data in Mongo
    socket.emit('updateData', { authuser: process.env.REACT_APP_USER })
    socket.on('status', (message) => {
      console.log(message)
      if (message == "UPDATING DONE") {
        updatingDone()
      }
    })


  }

  return (
    <div className='h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 flex justify-left bg-[#242734] pr-10 mb-10'>
      {unfilteredData ? (
        <div className='w-full h-full mr-10 '>
          <div className='mr-10 w-full h-[180px] mt-10 '>
            <div className='w-full h-full bg-[#2b3141] rounded-xl shadow-lg p-5  justify-between'>
              <h1 className='text-lg font-semibold text-white pb-2'>Filter Analytics</h1>
              <div className='flex justify-between'>
                <div className='items-center flex gap-3'>
                  <div className='flex ml-auto'>
                    <h1 className={`py-2 mr-3 text-md font-semibold text-[#858c97]`}>
                      {isUpdatingData === "true" ? (
                        "Fetching data. This may take a minute."
                      ) : (
                        formattedDate ? "Last updated: " + formattedDate : ""
                      )}
                    </h1>
                    {isUpdatingData === "true" && <Loading />}
                  </div>

                </div>

                <div className='items-center flex gap-5 pb-2'>
                  <h1 className='text-md font-semibold text-white '>Time Range:</h1>
                  <TimeDropdown data={[{}]} onTimeChange={handleTimeChange} />

                </div>




                <div className='items-center flex gap-5'>
                  <h1 className='text-lg font-semibold text-white '>Brands:</h1>
                  <BrandDropdown data={unfilteredData} onBrandsChange={handleBrandChange} />
                </div>
              </div>
              <div className="flex w-5/6">
                <div className="flex items-center text-lg">
                  <button
                    onClick={updateSalesData}
                    disabled={isUpdatingData === "true" || cookieStatus === "false"}
                    className={`py-2 px-4 font-semibold rounded-lg shadow-md text-white ${isUpdatingData === "true"
                        ? 'bg-blue-500 opacity-50 duration-500 cursor-not-allowed'
                        : cookieStatus === "false"
                          ? 'bg-red-500 cursor-not-allowed opacity-70 duration-500'
                          : 'bg-blue-500 hover:bg-blue-400 duration-500'
                      }`}
                  >
                    {isUpdatingData === "true"
                      ? 'Updating...'
                      : cookieStatus === "false"
                        ? 'Poshmark session expired.'
                        : 'Update Data'}
                  </button>


                </div>
                <div className="flex justify-center flex-grow items-center">
                  <div className={`w-[280px] ${showCustomRange ? 'block' : 'hidden'}`}>
                    <Datepicker value={customRange} onChange={handleCustomDateChange} dark={true} />
                  </div>
                </div>
              </div>



            </div>
          </div>
          <div className="w-full h-1/2 my-10 flex gap-10">
            <div className="w-2/3 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <SalesOvertime dataSet={data} firstDay={firstDay} lastDay={lastDay} />
            </div>
            <div className="w-1/3 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <SoldSummary dataSet={data} numDaysInRange={numDaysInRange} />
            </div>
          </div>

          <div className="w-full h-1/2 my-10 flex gap-10">
            <div className="w-2/3 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <BrandBreakdown dataSet={data} />
            </div>
            <div className="w-1/3 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <BestSale dataSet={data} />
            </div>
          </div>

          <div className="w-full h-2/3 my-10 flex gap-10">
            <div className="w-1/2 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <SalesBreakdown dataSet={data} />
            </div>
            <div className="w-1/2 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <CategoryBreakdown dataSet={data} />
            </div>
          </div>

          <div className="w-full h-1/2 my-10 flex gap-10">
            <div className="w-3/4 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <ListingsOvertime dataSet={listingsData} firstDay={firstDay} lastDay={lastDay} />
            </div>
            <div className="w-1/4 h-full bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <BestBrand dataSet={listingsData} />
            </div>
          </div>

          <div className="w-full h-5/6 my-10 flex gap-10">
            <div className="w-1/2 h-3/4 2xl:h-5/6 bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <ListingsBreakdown dataSet={listingsData} />
            </div>
            <div className="w-1/2 h-3/4 2xl:h-5/6 bg-[#2b3141] rounded-xl shadow-lg flex justify-between">
              <ListingsSummary dataSet={listingsData} numDaysInRange={numDaysInRange} />
            </div>
          </div>





        </div>
      ) : (
        <div className='h-screen w-full bg-[#242734]'>
          <div className='items-center justify-center flex h-3/4 pt-10 '>
            <Loading size="xl" />
          </div>
        </div>
      )}
    </div>
  )
};


export default Analytics;


