import React, { useState, useEffect } from "react";
import { Switch } from '@headlessui/react'
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios'

const Continous = ( {onToggleChange, socket} ) => {
  const [cookieStatus, setCookieStatus] = useState(null)
  const [frequency, setFrequency] = useState(0)
  const [firstIntervalBound, setFirstIntervalBound] = useState(30)
  const [secondIntervalBound, setSecondIntervalBound] = useState(60)
  const [enabled, setEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [sharingOrder, setSharingOrder] = useState(null)
  const [sharingSpeed, setSharingSpeed] = useState(null)

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value)
  }

  const handleFirstIntervalBound = (event) => {
    setFirstIntervalBound(Number(event.target.value))
  }

  const handleSecondIntervalBound = (event) => {
    setSecondIntervalBound(Number(event.target.value))
  }

  const handleSharingOrderChange = (index) => {
    
    setSharingOrder(index)
  }

  const handleSharingSpeedChange = (index) => {
    
    setSharingSpeed(index)
  }

  const handleSwitchToggle = () => {
    if(cookieStatus == "false") {
      setShowErrorMessage(true)
      setErrorMessage("Reconnect Poshmark session.")
      return
    }

    if(frequency > 0) {
      setErrorMessage(false)
      setEnabled(!enabled)
      onToggleChange(enabled)

      const continuousSettings = {
        frequency: frequency,
        firstIntervalBound: firstIntervalBound,
        secondIntervalBound: secondIntervalBound,
        sharingOrder: sharingOrder,
        sharingSpeed: sharingSpeed,
        enabled: !enabled,
      }

      secureLocalStorage.setItem("continuousSettings", continuousSettings)

      var options = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/setSettings`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER, "settings": continuousSettings, "field": "continuousSettings"}
      };
    
      axios.request(options).then(function (response) {
        socket.emit("updateSettings", { user: process.env.REACT_APP_USER})
          console.log(response.data)
      }).catch(function (error) {
          console.error(error.response);
      });

    }
    else {
      setShowErrorMessage(true)
      setErrorMessage("Select a sharing frequency.")
    }
  }

  useEffect(() => {
    setCookieStatus(secureLocalStorage.getItem('cookieStatus'))
    if(secureLocalStorage.getItem('continuousSettings')) {
      const localContinuousSettings = secureLocalStorage.getItem('continuousSettings')
      setFrequency(localContinuousSettings['frequency'])
      setFirstIntervalBound(localContinuousSettings['firstIntervalBound'])
      setSecondIntervalBound(localContinuousSettings['secondIntervalBound'])
      setSharingOrder(localContinuousSettings['sharingOrder'])
      setSharingSpeed(localContinuousSettings['sharingSpeed'])
      setEnabled(localContinuousSettings['enabled'])
      if(localContinuousSettings['enabled']) {
          onToggleChange(localContinuousSettings['enabled'])
      }
      if(localContinuousSettings['sharingOrder']) {
        setSharingOrder(localContinuousSettings['sharingOrder'])
      }
      if(localContinuousSettings['sharingSpeed']) {
        setSharingSpeed(localContinuousSettings['sharingSpeed'])
      }
    }
  },[] )

  
  return (
    <div className="h-full">
      <div className='flex'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1 mr-6">Frequency:</h>
        <div className="rounded-lg overflow-hidden w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
            placeholder="0"
            min="0"
            max="14"
            value={frequency}
            onChange={handleFrequencyChange}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>daily sharing periods</h>
      </div>
      <div className='flex my-10 w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1 mr-6">Time Interval:</h>
        <div className="rounded-lg overflow-hidden w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`}
            placeholder="0"
            min="30"
            max="600"
            value={firstIntervalBound}
            onChange={handleFirstIntervalBound}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>to</h>
        <div className="rounded-lg overflow-hidden w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
            placeholder="0"
            min="30"
            max="600"
            value={secondIntervalBound}
            onChange={handleSecondIntervalBound}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>minutes between sharing periods</h>
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
      <div className="flex">
        <div className="mb-5">
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
        </div>
        <span className={`text-red-400 text-[15px] duration-200 xl:text-[18px] mb-6 p-1 pl-6 ${showErrorMessage ? 'block' : 'hidden'}`}>{errorMessage}</span>
        <span className={`text-green-200 text-[15px] duration-200 xl:text-[18px] mb-6 p-1 pl-6 ${enabled ? 'block' : 'hidden'}`}>Sharing active!</span>

      </div>
      
    </div>

  )
}; 


export default Continous;


