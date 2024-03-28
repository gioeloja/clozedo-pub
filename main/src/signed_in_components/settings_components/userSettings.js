import React from "react";
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios';
import  secureLocalStorage  from  "react-secure-storage";
import PoshmarkLinkPopup from './PoshmarkLinkPopup.js'
import logo from '../assets/small_logo.png'
import { Loading } from '@nextui-org/react';
import poshmarkIcon from '../assets/poshmark.png'
import SettingsDropdown from '../dashboard_components/dashboard_tab/settings/SettingsDropdown.js';

const UserSettings = () => {
  const [showNextPage, setShowNextPage] = useState(false);
  const [salesDataSet, setSalesDataSet] = useState(false)
  const [isPoshmarkLinked, setIsPoshmarkLinked] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [linkedPoshmark, setLinkedPoshmark] = useState("")
  const [checkedIfLinked, setCheckedIfLinked] = useState(false)
  const [cookieStatus, setCookieStatus] = useState()
  

  async function closeModal() {
    setIsOpen(false)
    console.log('setting to false')
    await checkIfUserLinkedPoshmark();
  }

  function openModal() {
    setIsOpen(true)
  }

  async function firstLink() {
    openModal()
    var options = {
      method: 'POST',
      url: `${process.env.REACT_APP_DOMAIN}/api/initializeMongo`,
      headers: { 'content-type': 'application/json'},
      data: {username: process.env.REACT_APP_USER}
    };

    await axios.request(options)
  }


  useEffect(() =>{
    const fetchData = async () => {
      try {
        await checkIfUserLinkedPoshmark();
        await checkForSalesData();
        setCheckedIfLinked(true);
        
      } catch (error) {
        // Handle any errors that occurred during the retrieval process
        console.error(error);
      }
    };
    
    fetchData();

  }, [])

  async function checkIfUserLinkedPoshmark()
  {
    if(secureLocalStorage.getItem("udt") && secureLocalStorage.getItem("cookieStatus"))
    {
      
      setIsPoshmarkLinked(true)
      setCookieStatus(secureLocalStorage.getItem("cookieStatus"))
      setShowNextPage(true)
      setLinkedPoshmark(secureLocalStorage.getItem("udt"))
    }
    else
    {
      var options = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/mongoCheckForUser`,
        headers: { 'content-type': 'application/json'},
        data: {authuser: process.env.REACT_APP_USER}
      };

      await axios.request(options).then(function (res) {
  
        if(res.data.error)
        {
          
        }
        else if(res.data.notfound)
        {
          setIsPoshmarkLinked(false)
        }
        else
        {
          setCookieStatus(res.data.cookieStatus)
          setPoshmarkLocalVars(res.data.username)

          
        }

      }).catch(function (error) {
          console.error(error.response);
      });

      

    }
  }


  
  async function setPoshmarkLocalVars(metadata)
  {
    //udt short for user data
    secureLocalStorage.setItem("udt",metadata);
    setIsPoshmarkLinked(true);
    setShowNextPage(true)
    setLinkedPoshmark(secureLocalStorage.getItem("udt"))
    
  }

  function removePoshmarkLocalVarsTesting()
  {

    secureLocalStorage.clear()
    setSalesDataSet(false)
    setShowNextPage(false)
    setIsPoshmarkLinked(false)


    var options = {
      method: 'POST',
      url: `${process.env.REACT_APP_DOMAIN}/api/updateMongoUserInfo`,
      headers: { 'content-type': 'application/json'},
      data: {authuser: process.env.REACT_APP_USER, deleteEntry:true}
    };

    axios.request(options).then(function (res) {

      if(res.data.error)
      {
        
      }
      else if(res.data.notfound)
      {
        setIsPoshmarkLinked(false)
      }
      else
      {

        
      }
        
    }).catch(function (error) {
        console.error(error.response);
    });


  }

  async function checkForSalesData() {
    if(secureLocalStorage.getItem("salesData")) {
      setSalesDataSet(true)
    }
    else {
      var setSalesOptions = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/getSalesData`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER}
      };
  
      await axios.request(setSalesOptions).then(function (response) {

        if(response["data"].length > 0) {
          console.log(response["data"])
          setSalesDataSet(true)
          secureLocalStorage.setItem("salesData", response.data)
        }
        }).catch(function (error) {
            console.error(error.response);
        });  

    } 
  }


  function PoshmarkLinkButtons()
  {
    return(
      isPoshmarkLinked ? 
      (  <div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={removePoshmarkLocalVarsTesting}
          >
            Unlink from Poshmark
          </button>

      </div>
    ) 
      :
      (
        <div>
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={firstLink}
        >
          {isOpen && <PoshmarkLinkPopup isOpen={isOpen} openModal={openModal} closeModal={closeModal}/>}
          Link to Poshmark
      </button>
    </div>
    )

  );
  }


  return (
    checkedIfLinked ? (
      <div className='h-screen bg-[#242734]'>
        <SettingsDropdown/>
        <div className='p-3 pl-4 font-semibold bg-[#37394a] text-white h-20 flex items-center justify-start'>
          <img
            src={logo}
            className={`cursor-pointer w-13 rounded-md`}
          />
          <h1 className={`p-3 pl-5 text-white origin-left font-semibold text-4xl duration-300`}>Settings</h1>

        </div>
        
        <div className="p-5 flex items-center justify-center h-3/4 w-full">
          
          <div className="bg-[#2b3141] rounded-xl w-2/3 h-2/3 3xl:h-1/2 3xl:w-1/2 p-6">
            <h1 className="flex justify-center items-center text-white font-semibold text-2xl 2xl:text-3xl">Account Connections</h1>
            <div class="flex w-full justify-between h-3/4">
                <div class="py-10 items-center flex">
                  <img src={poshmarkIcon} className="w-12 h-12"/>
                  <h className="font-semibold px-4 text-lg text-white">Poshmark</h>

                </div>
                <div class="py-10 items-center flex">
                {isPoshmarkLinked ? (
                  <>
                    <div className={`text-${cookieStatus == "false" ? 'red' : 'green'}-500`}>
                      {cookieStatus == "false" ? (
                        <>
                        <p>Expired session for {linkedPoshmark}</p>
                        <button onClick={() => console.log(secureLocalStorage.getItem("udt"))}>Display</button>
                      </>
                      
                      
                    ) : (
                      <>
                        <p>{`Connected as ${linkedPoshmark}`}</p>
                        <button onClick={() => console.log(secureLocalStorage.getItem("udt"))}>Display</button>
                      </>
                    )}
                  </div>
                </>
                  ) : (
                    <>                  
                    <p className="text-red-500">No account linked</p>
                    </>
                  )
                }

                </div>
                <div className="py-10 items-center flex">
                <div>
                  {isPoshmarkLinked && cookieStatus === "false" && (
                    <div className="mb-4">
                      <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={openModal}>
                      
                        Refresh session
                      </button>
                      {isOpen && <PoshmarkLinkPopup isOpen={isOpen} openModal={openModal} closeModal={closeModal}/>}
                    </div>
                  )}
                  <div>
                    <PoshmarkLinkButtons />
                  </div>
                </div>


                </div>

            </div>
            {!isPoshmarkLinked && (
              <div className="rounded-md h-8 bg-gray-600 flex items-center justify-center">
                <p className="text-white">Install Clozedo Chrome Extension. Then, log into Poshmark in a different tab and press "Link to Poshmark".</p>
              </div>
            )}
            {showNextPage && (
              <div className="rounded-md h-8 xl:text-md 2xl:text-lg flex items-center justify-end">
                {salesDataSet ? (
                  <a href="/dashboard" className="text-white hover:text-blue-500 font-semibold">
                    Go to Dashboard &gt;
                  </a>
                ) : (
                  <a href="/settings/setup" className="text-white hover:text-blue-500 font-semibold">
                    Set up Dashboard &gt;
                  </a>
                )}

                
              </div>

            )}
          </div>
        </div>
  </div>
    ) : (
      <div className='h-screen bg-[#242734]'>
        <SettingsDropdown/>
        <div className='p-3 pl-4 font-semibold bg-[#37394a] text-white h-20 flex items-center justify-start'>
          <img
            src={logo}
            className={`cursor-pointer w-13 rounded-md`}
          />
          <h1 className={`p-3 pl-5 text-white origin-left font-semibold text-4xl duration-300`}>Settings</h1>

        </div>
        <div className="p-5 flex items-center justify-center h-3/4">
          <div className="bg-[#2b3141] rounded-xl w-2/3 h-2/3 3xl:h-1/2 3xl:w-1/2 p-6">
            <h1 className="flex justify-center items-center text-white font-semibold text-2xl 2xl:text-3xl">Connect account</h1>
            <div className="flex justify-center items-center h-3/4">
              <Loading size='lg' />
            </div>
          </div>
        </div>
      </div>
    )
  );
  
    
}

export default UserSettings;