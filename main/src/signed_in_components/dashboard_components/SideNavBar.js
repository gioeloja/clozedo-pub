import React, { useState, useEffect, useRef } from "react";
import logo from '../assets/logo.png'
import small_logo from '../assets/small_logo.png'
import slide_open from '../assets/dashboard_three_lines.svg'
import Dashboard from './dashboard_tab/Dashboard.js';
import Analytics from './analytics_tab/Analytics.js';
import Refresher from './refresher_tab/RefresherPage/Refresher.js';
import Crosslister from './crosslister_tab/Crosslister.js';
import SettingsDropdown from './dashboard_tab/settings/SettingsDropdown';
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage';
import { Loading } from '@nextui-org/react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDateToYYYYMMDD } from "../../scripts/data_filterer";
import io from 'socket.io-client';

const Menus = [
  { id:"home", title: "Dashboard", src: "dashboard", component: <Dashboard />},
  { id:"analytics", title: "Analytics", src: "graph", component: <Analytics />},
  { id:"refresher", title: "Refresher", src: "refresh", component: <Refresher />},
  { id:"crosslister", title: "Crosslister", src: "crosslister", component: <Crosslister />}
]


const SideNavBar = () => {
  const [userId, setUserId] = useState(null);
  const [cookieStatus, setCookieStatus] = useState()
  const [ open, setOpen ] = useState(true);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [isPoshmarkLinked, setIsPoshmarkLinked] = useState(true);
  const [socket, setSocket] = useState(null);


  const Menus = [
    {
      id: "home",
      title: "Dashboard",
      src: "dashboard",
      component: Dashboard,
    },
    {
      id: "analytics",
      src: "graph",
      title: "Analytics",
      component: Analytics,
    },
    {
      id: "Refresher",
      title: "Refresher",
      src: "refresh",
      component: Refresher,
    },
    {
      id: "crosslister",
      title: "Crosslister",
      src: "crosslister",
      component: Crosslister,
    }
  ];

  const onMenuClick = (index) => {
    setSelectedMenuIndex(index);
  }
  const [dataFetched, setDataFetched] = useState();

  const validateCookies = async () => {
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/validateCookies`, {
        username: process.env.REACT_APP_USER
      });
  
      secureLocalStorage.setItem("cookieStatus", response.data.toString());
      setCookieStatus(response.data)
    } catch (error) {
      console.error("Error occurred during cookie validation:", error);
    }
  };

  useEffect(() =>{
    
    const fetchData = async () => {
      var settingsOptions = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/getSettings`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER}
      };
      await axios.request(settingsOptions).then(function (response) {
        if(!response.data[0] || !response.data[0].userInfo.username) {
          setIsPoshmarkLinked(false)
          }
    
        secureLocalStorage.setItem("cookieStatus", response.data[0].userInfo["cookieStatus"])
        secureLocalStorage.setItem("scheduleSettings", response.data[0].scheduleSettings)
        secureLocalStorage.setItem("continuousSettings", response.data[0].continuousSettings)
        secureLocalStorage.setItem("offerSettings", response.data[0].offerSettings)
        secureLocalStorage.setItem("poshUser", response.data[0].userInfo.username)
        secureLocalStorage.setItem("dataVersion", response.data[0].dataVersion)
        secureLocalStorage.setItem("updatingData", response.data[0].updatingData)

        
        
      if(response.data[0].continuousSettings && response.data[0].continuousSettings['enabled']) {
        secureLocalStorage.setItem("currentFrequencySetting", 1)
      }
      else {
        secureLocalStorage.setItem("currentFrequencySetting", 0)
      }
      
      // Check if nothing in local storage or currently stored data version is outdated
      if(!secureLocalStorage.getItem("salesData") || response.data[0].dataVersion > secureLocalStorage.getItem("dataVersion")) {

        // Retrieve sales data from mongo db
        var salesOptions = {
          method: 'POST',
          url: `${process.env.REACT_APP_DOMAIN}/api/getSalesData`,
          headers: { 'content-type': 'application/json'},
          data: {"username":process.env.REACT_APP_USER}
        };
  
        
        axios.request(salesOptions).then(function (response) {
          console.log(response.data)
          secureLocalStorage.setItem("salesData", response.data)
          }).catch(function (error) {
              console.error(error.response);
          });
      }
      const today = new Date()
      const soldListings = secureLocalStorage.getItem("salesData").filter(entry => entry.status === 'sold_out');
      const earliestDate = soldListings.reduce((minDate, entry) => {
        const currentDate = new Date(entry.date_listed);
        return currentDate < minDate ? currentDate : minDate;
      }, new Date());

      const differenceMs = Math.abs(today - earliestDate);
      const dayDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      secureLocalStorage.setItem("dayDifference", dayDifference)
      const firstDate = formatDateToYYYYMMDD(earliestDate)
      const lastDate = formatDateToYYYYMMDD(today)
      secureLocalStorage.setItem("firstDate", firstDate)
      secureLocalStorage.setItem("lastDate", lastDate)
      
    })
    
    }

    
    if (!userId) {
      const fetchDataAndValidate = async () => {
        try {
          await fetchData();
          await validateCookies();
          setDataFetched(true);
        } catch (error) {
          // Handle any errors that occurred during the retrieval process
          console.error(error);
        }
      };
    
      fetchDataAndValidate();

      const socket = io('/',
        { path: '/socketio'} );
          socket.on('connect', () => {
            console.log('connected to socket');
        }
      );
      socket.emit('connectUser', { authuser: process.env.REACT_APP_USER})
      setSocket(socket)
  
      return () => {
        socket.disconnect();
      };
    }
    

  }, [])

const navigate = useNavigate();
  // if (!isPoshmarkLinked) {
  //   // Redirect the user to a different page if not authenticated
  //   navigate('/settings');
  //   return null; // You can return null or any other component while the redirect happens
  // }
    
  const Component = Menus[selectedMenuIndex].component;
  
  return (
    
    <div className='flex '>

      <div className={`${
        open ? "w-48" : "w-20"
        } duration-300 h-screen flex-shrink-0 bg-[#2b3141] duration-300`}
      > 
        <a href={`https://localhost:3000/dashboard`}>
          <div className='flex gap-x-4 h-[70px] justify-center items-center p-3'>
            <img
              src={open ? logo : small_logo}
              className={`cursor-pointer w-5/8 mt-3  rounded-md duration-500 ${open && "rotate-[360deg] px-4 mt-4"}`}
            />
          </div>
        </a>
        <ul className='pt-10 '>
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`text-gray-200 text-lg p-5 flex items-center gap-x-4 cursor-pointer rounded-md mb-9 ${selectedMenuIndex === index ? "bg-[#303649] cursor-auto" : "hover:bg-[#303649]"}`}
              onClick={() => onMenuClick(index)}
            >
              <img src={require(`../assets/${menu.src}.png`)} className="w-10 opacity-50"/>
              <span className={`${!open && "scale-0"} origin-left duration-300 text-white font-semibold`}>{menu.title}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className='h-screen'>
        <div className='w-12 2xl:w-16 text-4xl font-semibold flex items-center justify-center h-20 bg-[#37394a]'>
          <img src={slide_open} className="flex opacity-60 cursor-pointer w-5 2xl:w-7" onClick={()=>setOpen(!open)} />
        </div>
        <div className='h-screen bg-[#242734]'/>
      </div>

      <div className='w-screen'> 
        <div className='flex bg-[#37394a]'>
          <h1 className='pt-5 pb-7 text-3xl 2xl:text-4xl font-semibold text-white h-20 w-40'>
            {Menus[selectedMenuIndex].title}
          </h1>
          
          {cookieStatus == false && (
            <div class="flex items-center justify-center w-3/4">
              <div class="bg-red-500 text-white px-4 py-2 fixed m-4 rounded-md z-10">
                <span class="font-bold">Session expired:</span> Log into Poshmark on a separate tab.
                <Link to="/settings">
                  <button class="ml-2 bg-white text-red-500 py-1 px-2 rounded">Reconnect</button>
                </Link>
               
              </div>
            </div>
          )}
          <SettingsDropdown/>
        </div>
        {dataFetched ? (
            <Component  socket={socket}/>
          ) : (
            <div className='h-screen bg-[#242734]'>
              <div className='items-center justify-center flex h-3/4 pt-10'>
                <Loading size="xl"/>
              </div>
            </div>
          )}
        

        
      </div>
    </div>
  )
};


export default SideNavBar;


