import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react'
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";
import moment from 'moment';
import 'moment-timezone';


const Scheduled = ({ onToggleChange, socket }) => {
  const [cookieStatus, setCookieStatus] = useState(null)
  const [numberTimes, setNumberTimes] = useState(0);
  const [firstEntries, setFirstEntries] = useState([]);
  const [secondEntries, setSecondEntries] = useState( []);
  const [enabled, setEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState()
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [sharingOrder, setSharingOrder] = useState(null)
  const [sharingSpeed, setSharingSpeed] = useState(null)
  

  const handleChange = (event) => {
    let newNumberTimes = Number(event.target.value)
    if(newNumberTimes > 14) { 
      newNumberTimes = 14
    }
    
    let newFirstEntries = []
    let newSecondEntries = []

    if(newNumberTimes <= numberTimes) {
      for (let i = 0; i < newNumberTimes; i++) {
        if(i < 7) {
          newFirstEntries.push(firstEntries[i])
        }
        else {
          newSecondEntries.push(secondEntries[i-7])
        }
      }
    }
    else {
      for (let i = 0; i < newNumberTimes; i++) {
        if(i <= numberTimes-1) {
          if(i < 7) {
            newFirstEntries.push(firstEntries[i])

          }
          else {
            newSecondEntries.push(secondEntries[i-7])

          }
        }
        else {
          if(i < 7) {
            newFirstEntries.push({id: i, value: ''})
          }
          else {
            if(i>13) {
              break
            }
            newSecondEntries.push({id: i, value: ''}) 
          }
        }
      }
    }


    setFirstEntries(newFirstEntries)
    setSecondEntries(newSecondEntries)
    setNumberTimes(newNumberTimes)
    
  }

  const handleSharingOrderChange = (index) => {
    
    setSharingOrder(index)
  }

  const handleSharingSpeedChange = (index) => {
    
    setSharingSpeed(index)
  }

  const handleEntryChange = (event, id) => {
    if(id <= 7) {
      const newFirstEntries = firstEntries.map((entry) => {
        if (entry.id === id) {
          return { ...entry, value: event.target.value };
        }
        return entry;
      });
      setFirstEntries(newFirstEntries);
    }
    else {
      const newSecondEntries = secondEntries.map((entry) => {
        if (entry.id === id) {
          return { ...entry, value: event.target.value };
        }
        return entry;
      });
      setSecondEntries(newSecondEntries);
    }
  };



  const handleSwitchToggle = () => {
    // Check entries
    

    const combinedTimes = [...firstEntries, ...secondEntries];
    const uniqueTimes = new Set();

    if(cookieStatus == "false") {
      setShowErrorMessage(true)
        setErrorMessage("Reconnect Poshmark session.")
        return
    }
    if(sharingOrder == null || sharingSpeed == null) {
      setShowErrorMessage(true)
        setErrorMessage("Incomplete settings.")
        return
    }

    for (const key in combinedTimes) {
      
      const time = combinedTimes[key];
      if (uniqueTimes.has(time.value)) {
        setShowErrorMessage(true)
        setErrorMessage("Duplicate time selected.")
        return
      } else {
        uniqueTimes.add(time.value);
      }
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const UTCfirstEntries = firstEntries.map(timeString => {
      const formatString = 'h:mm A'; 
      const userDateTime = moment.tz(timeString.value, formatString, userTimezone);
      
      const utcDateTime = userDateTime.utc();
      return { id: timeString.id, value: utcDateTime.format('HH:mm') }
    });
    const UTCsecondEntries = secondEntries.map(timeString => {
      const formatString = 'h:mm A'; 
      const userDateTime = moment.tz(timeString.value, formatString, userTimezone);
      const utcDateTime = userDateTime.utc();
      return { id: timeString.id, value: utcDateTime.format('HH:mm') }
    });


    if(firstEntries.length > 0) {
      setShowErrorMessage(false)
      setEnabled(!enabled)
      onToggleChange(enabled)

      const scheduleSettings = {
          numberTimes: numberTimes,
          firstEntries: UTCfirstEntries,
          secondEntries: UTCsecondEntries,
          sharingOrder: sharingOrder,
          sharingSpeed: sharingSpeed,
          enabled: !enabled,
      }


      
      secureLocalStorage.setItem("scheduleSettings", scheduleSettings)

      var options = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/setSettings`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER, "settings": scheduleSettings, "field": "scheduleSettings"}
      };
    
      axios.request(options).then(function (response) {
          socket.emit("updateSettings", { user: process.env.REACT_APP_USER})
      }).catch(function (error) {
          console.error(error.response);
      });

      

    }
    else {
      setErrorMessage("Select a time.")
      setShowErrorMessage(true)
    }

  }

  useEffect(() => {
  
    if(secureLocalStorage.getItem('cookieStatus')) {
      setCookieStatus(secureLocalStorage.getItem("cookieStatus"))
      
    }
    
    
    console.log("am here")
    if(secureLocalStorage.getItem('scheduleSettings')) {
      const localScheduleSettings = secureLocalStorage.getItem('scheduleSettings')
      if(localScheduleSettings) {
        setNumberTimes(localScheduleSettings['numberTimes'])
        setSharingOrder(localScheduleSettings['sharingOrder'])
        setSharingSpeed(localScheduleSettings['sharingSpeed'])
        // Get the user's current timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const UTCtoTimeZoneFirstEntries = localScheduleSettings['firstEntries'].map(entry => {
          const utcDateTime = moment.utc(entry.value, 'HH:mm').tz(userTimezone)
          return { id: entry.id, value: utcDateTime.format('hh:mm A') }; // Output in the desired format
        });

        const UTCtoTimeZoneSecondEntries = localScheduleSettings['secondEntries'].map(entry => {
          const utcDateTime = moment.utc(entry.value, 'HH:mm').tz(userTimezone)
          return { id: entry.id, value: utcDateTime.format('hh:mm A') }; // Output in the desired format
        });



        setFirstEntries(UTCtoTimeZoneFirstEntries)
        setSecondEntries(UTCtoTimeZoneSecondEntries)
        
        
        setEnabled(localScheduleSettings['enabled'])
        if(localScheduleSettings['enabled']) {
           onToggleChange(localScheduleSettings['enabled'])
        }
        if(localScheduleSettings['sharingOrder']) {
          setSharingOrder(localScheduleSettings['sharingOrder'])
       }
       if(localScheduleSettings['sharingSpeed']) {
        setSharingSpeed(localScheduleSettings['sharingSpeed'])
     }
        
      }
    }



  },[]

  )

  const [isOpen, setIsOpen] = useState({});

  const toggleDropdown = (id) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleInputChange = (event, id) => {
    const newValue = event.target.value;

    // Update the entry value in your state
    setFirstEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, value: newValue } : entry
      )
    );
  };

  const handleDropdownSelection = (id, value, type) => {
    if(id < 7) {
      setFirstEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.id === id) {
          if (type=="Hour") {
            // If an hour is selected and minute is not yet selected, set minutes to "00"
            const minutes = entry.value.slice(3,5) || '00';
            const AMorPM = entry.value.slice(5,8) || ' AM'
            return {
              ...entry,
              value: `${value.toString().padStart(2, '0')}:${minutes}${AMorPM}`,
            };
          } else if(type=="Minute") {
            // If a minute is selected and hour is not yet selected, set hour to "12"
            const hour = entry.value.slice(0, 2) || '12';
            const AMorPM = entry.value.slice(5,8) || ' AM'
            return {
              ...entry,
              value: `${hour}:${value.toString().padStart(2, '0')}${AMorPM}`,
            };
            }
            else {
              const hour = entry.value.slice(0, 2) || '12';
              const minutes = entry.value.slice(3,5) || '00';
              return {
                ...entry,
              value: `${hour}:${minutes}${' ' + value}`
              }
          }
        }
        return entry;
      })
    );
    }
    else {
      setSecondEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.id === id) {
          if (type=="Hour") {
            // If an hour is selected and minute is not yet selected, set minutes to "00"
            const minutes = entry.value.slice(3,5) || '00';
            const AMorPM = entry.value.slice(5,8) || ' AM'
            return {
              ...entry,
              value: `${value.toString().padStart(2, '0')}:${minutes}${AMorPM}`,
            };
          } else if(type=="Minute") {
            // If a minute is selected and hour is not yet selected, set hour to "12"
            const hour = entry.value.slice(0, 2) || '12';
            const AMorPM = entry.value.slice(5,8) || ' AM'
            return {
              ...entry,
              value: `${hour}:${value.toString().padStart(2, '0')}${AMorPM}`,
            };
            }
            else {
              const hour = entry.value.slice(0, 2) || '12';
              const minutes = entry.value.slice(3,5) || '00';
              return {
                ...entry,
              value: `${hour}:${minutes}${' ' + value}`
              }
          }
        }
        return entry;
      })
    );
    }
    
  };
  
  

  return (
    <div className='flex'>
      <div className='gap-10 w-full'>
        <div className='flex gap-10 h'>
            <h className="text-white text-[15px] xl:text-[18px] pt-1 ">Scheduled Times:</h>          
            <div className="rounded-lg overflow-hidden w-16">
              <input
                type="number"
                className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
                placeholder="1"
                min="1"
                max="14"
                value={numberTimes}
                onChange={handleChange}
                disabled={enabled}
              />
          </div>
          
        </div>

        <div className="flex gap-10 w-1/2 my-10 mx-10">
            <div className="flex-col flex-wrap">
            
            {firstEntries.map((entry) => (
              <div key={entry.id} className='w-fit pb-4 flex rounded-lg items-end'>
                <h className="text-white text-[15px] xl:text-[18px] pr-6">#{entry.id + 1}:</h>
                <div className="relative ">
                  <input
                    type='text'
                    className={`w-32 px-2 py-1 rounded-lg duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""} ${
                      isOpen[entry.id] ? 'bg-gray-400' : ''
                    }`}
                    placeholder=''
                    value={entry.value}
                    onChange={(event) => handleInputChange(event, entry.id)}
                    onClick={() => toggleDropdown(entry.id)}
                    disabled={enabled}
                  />
              {isOpen[entry.id] && (
                <ul className="absolute h-64 flex left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-md z-10 overflow-y-hidden">
                  <div className="w-1/4  m-4 hover:overflow-y-auto scrollbar-thin " style={{ maxHeight: "calc(100% - 16px)" }}>
                    {[...Array(12)].map((_, index) => (
                      <li
                        key={`hour-${index + 1}`}
                        className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                        onClick={() => handleDropdownSelection(entry.id, index + 1, "Hour")}
                      >
                        {index + 1}
                      </li>
                    ))}
                  </div>
                  <div className="w-1/4 m-4  hover:overflow-y-auto scrollbar-thin  " style={{ maxHeight: "calc(100% - 16px)" }}>
                    {[...Array(60)].map((_, index) => (
                      <li
                        key={`minute-${index}`}
                        className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                        onClick={() => handleDropdownSelection(entry.id, index < 10 ? `0${index}` : index, "Minute")}
                      >
                        {index < 10 ? `0${index}` : index}
                      </li>
                    ))}
                  </div>
                  <div className="w-1/4 m-4">
                    <ul className="justify-between">
                      <li>
                        <button className="py-1 mb-2 px-2 bg-gray-100 rounded-md"
                        onClick={() => handleDropdownSelection(entry.id, "AM", "AM")}
                        >AM</button>
                      </li>
                      <li>
                        <button className="py-1 px-2 bg-gray-100 rounded-md"
                        onClick={() => handleDropdownSelection(entry.id, "PM", "PM")}
                        >PM</button>
                      </li>
                    </ul>
                  </div>
                </ul>
                )}


                </div>
              </div>
            ))}
              </div>
              <div className="flex-col flex-wrap flex items-end">
                {secondEntries.map((entry) => (
                  <div key={entry.id} className='w-fit pb-4 flex rounded-lg items-end'>
                  <h className="text-white text-[15px] xl:text-[18px] px-6">#{entry.id + 1}:</h>
                  <div className="relative ">
                    <input
                      type='text'
                      className={`w-32 px-2 py-1 rounded-lg duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""} ${
                        isOpen[entry.id] ? 'bg-gray-400' : ''
                      }`}
                      placeholder=''
                      value={entry.value}
                      onChange={(event) => handleInputChange(event, entry.id)}
                      onClick={() => toggleDropdown(entry.id)}
                      disabled={enabled}
                    />
                {isOpen[entry.id] && (
                  <ul className="absolute h-64 flex left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-md z-10 overflow-y-hidden">
                    <div className="w-1/4  m-4 hover:overflow-y-auto hover:scrollbar-thumb-gray-300 hover:scrollbar-track-gray-100" style={{ maxHeight: "calc(100% - 16px)" }}>
                      {[...Array(12)].map((_, index) => (
                        <li
                          key={`hour-${index + 1}`}
                          className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                          onClick={() => handleDropdownSelection(entry.id, index + 1, "Hour")}
                        >
                          {index + 1}
                        </li>
                      ))}
                    </div>
                    <div className="w-1/4 m-4  hover:overflow-y-auto hover:scrollbar-thumb-gray-300 hover:scrollbar-track-gray-100" style={{ maxHeight: "calc(100% - 16px)" }}>
                      {[...Array(60)].map((_, index) => (
                        <li
                          key={`minute-${index}`}
                          className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                          onClick={() => handleDropdownSelection(entry.id, index < 10 ? `0${index}` : index, "Minute")}
                        >
                          {index < 10 ? `0${index}` : index}
                        </li>
                      ))}
                    </div>
                    <div className="w-1/4 m-4">
                      <ul className="justify-between">
                        <li>
                          <button className="py-1 mb-2 px-2 bg-gray-100 rounded-md"
                          onClick={() => handleDropdownSelection(entry.id, "AM", "AM")}
                          >AM</button>
                        </li>
                        <li>
                          <button className="py-1 px-2 bg-gray-100 rounded-md"
                          onClick={() => handleDropdownSelection(entry.id, "PM", "PM")}
                          >PM</button>
                        </li>
                      </ul>
                    </div>
                  </ul>
                  )}
        
        
                  </div>
                </div>
                ))}

            </div>
          </div>


        <div className='flex my-10 w-full gap-10'>
          <h className="text-white text-[15px] xl:text-[18px] pt-2">Sharing Order:</h> 
            <div className="flex">
              <button key="schedule" className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 rounded-l-lg border-gray-200/[.25] overflow-hidden 
              whitespace-nowrap text-overflow-ellipsis border-r 
              ${sharingOrder === 0 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingOrderChange(0)}
              disabled={enabled}>
                Current
              </button>
              <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white border-r py-3 px-4 border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${sharingOrder === 1 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingOrderChange(1)}
              disabled={enabled}>
                Reverse
              </button>
              <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 border-gray-200/[.25] rounded-r-lg overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${sharingOrder === 2 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingOrderChange(2)}
              disabled={enabled}>
                Random
              </button>
          </div>
        </div>
        <div className='flex my-10 w-full gap-10'>
          <h className="text-white text-[15px] xl:text-[18px] pt-2">Sharing Speed:</h> 
            <div className="flex">
              <button key="schedule" className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 rounded-l-lg border-gray-200/[.25] overflow-hidden 
              whitespace-nowrap text-overflow-ellipsis border-r 
              ${sharingSpeed === 0 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingSpeedChange(0)}
              disabled={enabled}>
                Fast
              </button>
              <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white border-r py-3 px-4 border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${sharingSpeed === 1 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingSpeedChange(1)}
              disabled={enabled}>
                Medium
              </button>
              <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 border-gray-200/[.25] rounded-r-lg overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${sharingSpeed === 2 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
              onClick={() => handleSharingSpeedChange(2)}
              disabled={enabled}>
                Slow
              </button>
          </div>
        </div>
        <div className="my-10">

          <div className=" flex">
            <Switch
              checked={enabled}
              onChange={handleSwitchToggle}
              className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
                relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 mt-auto`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                  pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <span className={`text-red-400 text-[15px] duration-200 xl:text-[18px]  p-1 pl-6 ${showErrorMessage ? 'block' : 'hidden'}`}>{errorMessage}</span>
         <span className={`text-green-200 text-[15px] duration-200 xl:text-[18px]  p-1 pl-6 ${enabled ? 'block' : 'hidden'}`}>Sharing active!</span>

          </div>
          
        </div>
      </div>
    </div>
      
    
  );
}; 

export default Scheduled;
