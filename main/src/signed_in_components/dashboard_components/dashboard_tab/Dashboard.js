import React, { useEffect, useState } from 'react';
import TabsBox from './tab_box/TabsBox.js'
import ActiveListings from './insights/ActiveListings.js';
import AveragePrice from './insights/AveragePrice.js';
import TotalSales from './insights/TotalSales.js';
import TotalRevenue from './insights/TotalRevenue.js';
import gear from "../../assets/gear_icon.svg"
import TimeDropdown from './settings/TimeDropdown.js';
import { filterDataByBrands, filterDataByTime, formatDateToYYYYMMDD } from "../../../scripts/data_filterer.js";
import Datepicker from "react-tailwindcss-datepicker";
import BrandDropdown from './settings/BrandDropdown.js';
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage';
import { Loading } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import Carousel from './carousel/Carousel.js'
import TotalSalesCarousel from './carousel/SalesCarousel.js';
import ActiveListingsCarousel from './carousel/ActiveListingsCarousel.js';


const Dashboard = ({ socket }) => {

  const [unfilteredData, setUnfilteredData] = useState(null);

  const [isPoshmarkLinked, setIsPoshmarkLinked] = useState(true);

  const [formattedDate, setFormattedDate] = useState('');

  const [data, setData] = useState([{}]);

  const [brands, setBrands] = useState();

  const [isUpdatingData, setIsUpdatingData] = useState(null);

  const [cookieStatus, setCookieStatus] = useState(null)
  const [firstDay, setFirstDay] = useState("2000/01/01")
  const [lastDay, setLastDay] = useState("3000/01/01")


  useEffect(() => {
    setCookieStatus(secureLocalStorage.getItem("cookieStatus"))
    setIsUpdatingData(secureLocalStorage.getItem("updatingData"))

    if (secureLocalStorage.getItem("updatingData") == "true") {
      socket.emit('updateData', { authuser: process.env.REACT_APP_USER })
      socket.on('status', (message) => {
        console.log(message)
        if (message == "UPDATING DONE") {
          updatingDone()
        }
      })

    }

    setFirstDay(secureLocalStorage.getItem("firstDate"))
    setLastDay(secureLocalStorage.getItem("lastDate"))

    if (secureLocalStorage.getItem("continuousSettings") && secureLocalStorage.getItem("continuousSettings")['enabled']) {
      secureLocalStorage.setItem("currentFrequencySetting", 1)
    }
    else {
      secureLocalStorage.setItem("currentFrequencySetting", 0)
    }

    if (secureLocalStorage.getItem("dataVersion")) {

      const date = new Date(secureLocalStorage.getItem("dataVersion") * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const newFormattedDate = `${month}/${day}/${year}`;
      setFormattedDate(newFormattedDate);

    }

    if (!secureLocalStorage.getItem("salesData")) {

      setUnfilteredData(secureLocalStorage.getItem("salesData"))
      setData(secureLocalStorage.getItem("salesData"))
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
        setBrands(Array.from(new Set(unfilteredData.map(entry => entry.brand))))


        secureLocalStorage.setItem("salesData", response.data)
      }).catch(function (error) {
        console.error(error.response);
      });
    }
  }, [])



  const [showModal, setShowModal] = useState(false);
  const [prevTime, setPrevTime] = useState(null);

  const [showCustomRange, setShowCustomRange] = useState(false);

  const [time, setTime] = useState("All Time")
  const [customRangeActive, setCustomRangeActive] = useState(false)

  const [customRange, setCustomRange] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  })

  const handleCustomDateChange = (newValue) => {
    let data = filterDataByBrands(unfilteredData, brands)
    setData(filterDataByTime(data, true, newValue.startDate, newValue.endDate))
    setCustomRangeActive(true)
    setCustomRange(newValue);
    setFirstDay(newValue.startDate)
    setLastDay(newValue.endDate)
  }

  const currentDate = new Date()



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

  const handleTimeChange = (timeSetting) => {
    setTime(timeSetting)

    handleSettingChange(timeSetting, brands)
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
      if (message == "UPDATING DONE") {
        updatingDone()
      }
    })
  }

  const handleSettingChange = (selectedTime, selectedBrands) => {
    let newData = filterDataByBrands(unfilteredData, selectedBrands)
    if (selectedTime == "All Time") {
      setCustomRangeActive(false)
      setShowCustomRange(false);

      const today = new Date()
      const earliestDate = unfilteredData.reduce((minDate, entry) => {
        const currentDate = new Date(entry.date_listed);
        return currentDate < minDate ? currentDate : minDate;
      }, new Date());

      const firstDate = formatDateToYYYYMMDD(earliestDate)
      const lastDate = formatDateToYYYYMMDD(today)
      setFirstDay(firstDate)
      setLastDay(lastDate)

      newData = filterDataByTime(newData, true, firstDate, lastDate)
    }
    else if (selectedTime == "Today") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDateString = `${year}/${month}/${day}`;
      setFirstDay(currentDateString)
      setLastDay(currentDateString)

      newData = filterDataByTime(newData, true, currentDateString, currentDateString)

    }
    else if (selectedTime == "Last 7 Days") {
      setCustomRangeActive(false)
      setShowCustomRange(false);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      var sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      var sevenDaysAgoDateString = sevenDaysAgo.getFullYear() + '/' + (sevenDaysAgo.getMonth() + 1) + '/' + sevenDaysAgo.getDate();


      const currentDateString = `${year}/${month}/${day}`;
      setFirstDay(sevenDaysAgoDateString)
      setLastDay(currentDateString)

      newData = filterDataByTime(newData, true, sevenDaysAgoDateString, currentDateString)
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
      // format dates as YYYY/MM/DD
      const firstDayOfWeekDateString = firstDayOfWeek.getFullYear() + '/' + (firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0') + '/' + firstDayOfWeek.getDate().toString().padStart(2, '0');
      const lastDayOfWeekDateString = lastDayOfWeek.getFullYear() + '/' + (lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0') + '/' + lastDayOfWeek.getDate().toString().padStart(2, '0');

      setFirstDay(firstDayOfWeekDateString)
      setLastDay(lastDayOfWeekDateString)

      newData = filterDataByTime(newData, true, firstDayOfWeekDateString, lastDayOfWeekDateString)
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

      const lastDayCurrentMonthDateString = year + '/' + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');

      setFirstDay(firstDayCurrentMonthDateString)
      setLastDay(lastDayCurrentMonthDateString)

      newData = filterDataByTime(newData, true, firstDayCurrentMonthDateString, lastDayCurrentMonthDateString)
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

      setFirstDay(firstDayOfYearDateString)
      setLastDay(lastDayOfYearDateString)

      newData = filterDataByTime(newData, true, firstDayOfYearDateString, lastDayOfYearDateString)

    }
    else if (selectedTime == "Custom Range") {
      setShowCustomRange(true);
    }
    setData(newData)
    setPrevTime(selectedTime);
  }

  const navigate = useNavigate();
  if (!isPoshmarkLinked) {
    // Redirect the user to a different page if not authenticated
    navigate('/settings');
    return null; // You can return null or any other component while the redirect happens
  }

  const slides = [


    <TotalSalesCarousel dataSet={data} firstDay={firstDay} lastDay={lastDay} />,
    <ActiveListingsCarousel dataSet={unfilteredData} />

  ];

  return (

    <div className='h-screen bg-[#242734]'>
      {unfilteredData ? (
        <>

          <div className='py-2 2xl:p-3 mr-3'>
            <img class="cursor-pointer ml-auto top-0 bottom-0 right-0 h-7 w-7 md:h-9 md:w-9 xl:h-10 xl:w-10 rounded-full "
              src={gear} alt="..."
              onClick={() => setShowModal(true)}
            />

            <div
              className={`${showModal ? "opacity-100" : "opacity-0 pointer-events-none"
                } fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center transition-opacity duration-500`}
            >

              <div
                className="absolute bg-[#464f60] rounded-lg w-full max-w-lg p-6 transform transition-all rounded-xl z-10"
                style={{
                  top: showModal ? "calc(45% - 150px)" : "-45%",
                  opacity: showModal ? 1 : 0,
                  transitionDuration: showModal ? "500ms" : "1000ms"
                }}
              >
                <div className="flex justify-center items-center mb-8">
                  <h3 className="text-2xl text-white font-semibold">Settings</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-600 transition-all duration-500 focus:outline-none">
                  </button>
                </div>
                <div class="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-white text-xl font-semibold pl-2">Time:</h1>
                    <div className="relative ml-auto ">
                      <TimeDropdown onTimeChange={handleTimeChange} />
                    </div>
                  </div>
                  <div class={`flex justify-end ${showCustomRange ? 'block' : 'hidden'}`}>
                    <Datepicker value={customRange} onChange={handleCustomDateChange} dark={true} />
                  </div>
                </div>

                <div class="flex items-center justify-between my-8">
                  <h1 class="text-white font-semibold text-xl pl-2 ">Brands:</h1>
                  <div className='relative ml-auto'>
                    <BrandDropdown data={unfilteredData} onBrandsChange={handleBrandChange} />
                  </div>
                </div>

                <div class="my-8 flex">
                  <button
                    onClick={updateSalesData}
                    disabled={secureLocalStorage.getItem("updatingData") === "true" || cookieStatus === "false"}
                    className={`py-2 px-4 font-semibold rounded-lg shadow-md text-white ${secureLocalStorage.getItem("updatingData") === "true"
                        ? 'bg-blue-500 opacity-50 cursor-not-allowed duration-500'
                        : cookieStatus === "false"
                          ? 'bg-red-500 cursor-not-allowed opacity-70'
                          : 'bg-blue-500 hover:bg-blue-400 duration-500'
                      }`}
                  >
                    {secureLocalStorage.getItem("updatingData") === "true"
                      ? 'Updating...'
                      : cookieStatus === "false"
                        ? 'Poshmark session expired.'
                        : 'Update Data'}
                  </button>
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



                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>





            <div className=' h-screen mr-5 xl:pb-5 2xl:pt-3'>
              <div className='flex h-1/5 gap-10 3xl:gap-20 mr-7 2xl:mr-10'>
                <div className='pt-3 p-3 2xl:p-4 bg-[#2b3141] w-1/4 h-full rounded-lg shadow-lg'>
                  <ActiveListings dataSet={data} />

                </div>
                <div className='p-3 2xl:p-4 bg-[#2b3141] w-1/4 h-full rounded-lg shadow-lg'>
                  <TotalSales dataSet={data} />
                </div>
                <div className='p-3 2xl:p-4 bg-[#2b3141] w-1/4 h-full rounded-lg shadow-lg'>
                  <AveragePrice dataSet={data} />
                </div>
                <div className='p-3 2xl:p-4 bg-[#2b3141] w-1/4 h-full rounded-lg shadow-lg'>
                  <TotalRevenue dataSet={data} />
                </div>
              </div>

              <div className='flex h-full w-full gap-10 3xl:gap-20 pr-7 2xl:pr-10 relative' >
                <div className='my-5 2xl:my-10 bg-[#2b3141] w-3/4 h-1/2 rounded-lg shadow-lg'>
                  <Carousel slides={slides} />


                </div>




                <div className='my-5 2xl:my-10 p-3 pb-6  bg-[#2b3141] h-1/2 w-1/3 rounded-lg shadow-lg'>
                  <TabsBox dataSet={data} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='h-screen bg-[#242734]'>
          <div className='items-center justify-center flex h-3/4 pt-10 '>
            <Loading size="xl" />
          </div>
        </div>
      )}
    </div>
  );
};




export default Dashboard;


