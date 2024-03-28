import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react'
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios'


const AutoOffer = ({ socket }) => {
  const [cookieStatus, setCookieStatus] = useState(null)
  const [enabled, setEnabled] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10)
  const [offerInterval, setOfferInterval] = useState(10)
  const [shippingDiscount, setShippingDiscount] = useState(null)
  const [basedOff, setBasedOff] = useState(null)
  const [minimum, setMinimum] = useState(10)
  const [errorMessage, setErrorMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  const handleDiscountPercentChange = (event) => {
    setDiscountPercent(event.target.value)
  }

  // 0 = 5.95, 1 = 4.99, 2 = free
  const handleShippingDiscountChange = (index) => {

    setShippingDiscount(index)
  }
  const handleOfferIntervalChange = (event) => {

    setOfferInterval(event.target.value)
  }
  const handleMinimumChange = (event) => {
    setMinimum(event.target.value)
  }

  const handleBasedOffChange = (index) => {
    setBasedOff(index)
  }

  const handleSwitchToggle = () => {
    if (cookieStatus == "false") {
      setShowErrorMessage(true)
      setErrorMessage("Reconnect Poshmark session.")
      return
    }

    if (shippingDiscount != null && basedOff != null) {
      secureLocalStorage.setItem("offerEnabled", !enabled)
      setErrorMessage(false)
      setEnabled(!enabled)

      const offerSettings = {
        discountPercent: discountPercent,
        offerInterval: offerInterval,
        shippingDiscount: shippingDiscount,
        basedOff: basedOff,
        minimum: minimum,
        enabled: !enabled,

      }


      secureLocalStorage.setItem("offerSettings", offerSettings)

      var options = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/setSettings`,
        headers: { 'content-type': 'application/json' },
        data: { "username": process.env.REACT_APP_USER, "settings": offerSettings, "field": "offerSettings" }
      };

      axios.request(options).then(function (response) {
        //console.log(response.data);
        socket.emit("updateOfferSettings", { user: process.env.REACT_APP_USER })
        console.log(response.data)
      }).catch(function (error) {
        console.error(error.response);
      });


    }
    else {
      setErrorMessage("Select all settings.")
      setShowErrorMessage(true)
    }

  }

  useEffect(() => {
    setCookieStatus(secureLocalStorage.getItem('cookieStatus'))

    if (secureLocalStorage.getItem('offerSettings')) {
      const localOfferSettings = secureLocalStorage.getItem('offerSettings')
      setDiscountPercent(localOfferSettings['discountPercent'])
      setOfferInterval(localOfferSettings['offerInterval'])
      setShippingDiscount(localOfferSettings['shippingDiscount'])
      setBasedOff(localOfferSettings['basedOff'])
      setMinimum(localOfferSettings['minimum'])
      setEnabled(localOfferSettings['enabled'])


    }
  }, [])

  return (
    <div className='h-full'>
      <div className='flex w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Price Discount:</h>
        <div className="rounded-lg overflow-hidden ml-10 w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
            placeholder="10"
            min="10"
            max="100"
            value={discountPercent}
            onChange={handleDiscountPercentChange}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>%</h>
      </div>
      <div className='flex my-10 w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Offer Interval:</h>
        <div className="rounded-lg overflow-hidden ml-10 w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
            placeholder="10"
            min="5"Z
            max="60"
            value={offerInterval}
            onChange={handleOfferIntervalChange}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>minutes after offer is liked</h>
      </div>
      <div className='flex my-10 w-full gap-10'>
        <h className="text-white text-[15px] xl:text-[18px] pt-2">Shipping Discount:</h>
        <div className="flex">
          <button key="schedule" className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 rounded-l-lg border-gray-200/[.25] overflow-hidden 
              whitespace-nowrap text-overflow-ellipsis border-r 
              ${shippingDiscount === 0 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
            onClick={() => handleShippingDiscountChange(0)}
            disabled={enabled}>
            $5.95
          </button>
          <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white border-r py-3 px-4 border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
             ${shippingDiscount === 1 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
            onClick={() => handleShippingDiscountChange(1)}
            disabled={enabled}>
            $4.99
          </button>
          <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 border-gray-200/[.25] rounded-r-lg overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${shippingDiscount === 2 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
            onClick={() => handleShippingDiscountChange(2)}
            disabled={enabled}>
            Free
          </button>
        </div>
      </div>
      <div className='flex my-10 w-full gap-10'>
        <h className="text-white text-[15px] xl:text-[18px] pt-2">Based Off:</h>
        <div className="flex">
          <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white border-r rounded-l-lg py-3 px-4 border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${basedOff === 0 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}
              `}
            onClick={() => handleBasedOffChange(0)}
            disabled={enabled}>
            Sales Price
          </button>

          <button className={`w-30 bg-[#45464f] hover:text-gray-400 text-white rounded-r-lg  py-3 px-4 border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${basedOff === 1 ? (enabled ? 'cursor-not-allowed opacity-30 hover:text-white' : 'opacity-50 hover:text-white') : (enabled ? 'cursor-not-allowed opacity-60 hover:text-white' : '')}`}
            onClick={() => handleBasedOffChange(1)}
            disabled={enabled}>
            Earnings
          </button>
        </div>
      </div>
      <div className='flex my-10 w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Minimum price/earnings:</h>
        <div className="rounded-lg overflow-hidden ml-10 w-16">
          <input
            type="number"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none ${enabled ? "cursor-not-allowed bg-gray-400" : ""}`}
            placeholder="10"
            min="10"
            max="100"
            value={minimum}
            onChange={handleMinimumChange}
            disabled={enabled}
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3 ${enabled ? "text-gray-500" : ""}`}>USD</h>
      </div>
      <div className="flex">
        <div className="">
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
        <span className={`text-red-400 text-[15px] duration-200 xl:text-[18px] mb-6 p-1 pl-6  ${showErrorMessage ? 'block' : 'hidden'}`}>{errorMessage}</span>
        <span className={`text-green-200 text-[15px] duration-200 xl:text-[18px] mb-6 p-1 pl-6 ${enabled ? 'block' : 'hidden'}`}>Auto-Offer enabled!</span>

      </div>





    </div>
  )
};


export default AutoOffer;


