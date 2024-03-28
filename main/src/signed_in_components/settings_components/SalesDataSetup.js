import React, {useState, useEffect} from 'react';
import logo from '../assets/small_logo.png'
import poshmarkIcon from '../assets/poshmark.png'
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import  secureLocalStorage  from  "react-secure-storage";
import { Loading } from '@nextui-org/react';
import SettingsDropdown from '../dashboard_components/dashboard_tab/settings/SettingsDropdown';

const SalesDataSetup = () => {
  const [isPoshmarkLinked, setIsPoshmarkLinked] = useState(null);
  const [linkedPoshmark, setLinkedPoshmark] = useState("")
  const [checkedIfLinked, setCheckedIfLinked] = useState(false)
  const [userId, setUserId] = useState(null);
  const [retrievingData, setRetrievingData] = useState(null)
  const [salesDataSet, setSalesDataSet] = useState(false)
  console.log("right here")

  async function checkIfUserLinkedPoshmark()
  {
    if(secureLocalStorage.getItem("udt"))
    {
      setIsPoshmarkLinked(true)
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
          console.log(JSON.stringify(res))
        }

      }).catch(function (error) {
          console.error(error.response);
      });

      

    }
  }

  async function retrieveData() {
      setRetrievingData('true')
      var setSalesOptions = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/setSalesData`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER}
      };
  
      await axios.request(setSalesOptions).then(function (response) {
        secureLocalStorage.setItem("salesData", response.data)
        }).catch(function (error) {
            console.error(error.response);
        });  

      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
  
      var setDateOptions = {
        method: 'POST',
        url: `${process.env.REACT_APP_DOMAIN}/api/setSettings`,
        headers: { 'content-type': 'application/json'},
        data: {"username":process.env.REACT_APP_USER, "settings": currentUnixTimestamp, "field": "dataVersion"}
      };
    
      await axios.request(setDateOptions).then(function (response) {
      }).catch(function (error) {
          console.error(error.response);
      });
      
      secureLocalStorage.setItem("dataVersion", currentUnixTimestamp)
      setRetrievingData('false')
      setSalesDataSet(true)

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
          setSalesDataSet(true)
          secureLocalStorage.setItem("salesData", response.data)
        }
        }).catch(function (error) {
            console.error(error.response);
        });  

    }

    
  }

  useEffect(() =>{
    setRetrievingData(secureLocalStorage.getItem("updatingData"))
    console.log(secureLocalStorage.getItem("updatingData"))
    const fetchData = async () => {
      await checkIfUserLinkedPoshmark();
      await checkForSalesData();
      setCheckedIfLinked(true);
    };
    fetchData();


  }, [])
  
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
            <h1 className="flex justify-center items-center text-white font-semibold text-3xl">Set up Dashboard</h1>
            <div class="flex w-full justify-between h-3/4">
                <div class="py-10 items-center flex">
                  <img src={poshmarkIcon} className="w-12 h-12"/>
                  <h className="font-semibold px-4 text-lg text-white">Poshmark</h>

                </div>
                <div class="py-10 items-center flex">
                {isPoshmarkLinked ? (
                  <>                  
                    <div className="text-green-500">
                      <p>{`Connected as ${linkedPoshmark}`}</p>
                      <button onClick={() => console.log(secureLocalStorage.getItem("udt"))}>Display </button> 
                    </div>
                  </>
                  ) : (
                    <>                  
                    <p className="text-red-500">No account linked</p>
                    </>
                  )
                }

                </div>
                <div class="py-10 items-center flex">

                  <button
                    className={`bg-blue-500 ${retrievingData === 'true' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} w-[180px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    onClick={retrieveData}
                    disabled={retrievingData === 'true'}
                  >
                    {retrievingData === 'true' ? (
                      "Updating..."
                    ) : (
                      !salesDataSet ? "Set up Dashboard" : "Update Dashboard"
                    )}
                  </button>
                </div>

                
            </div>
            {!retrievingData || retrievingData === "false" ? (
              <div className="flex justify-between">
                <a href="/settings" className="text-white hover:text-blue-500 font-semibold">
                  &lt; Back to Account Link 
                </a>
                {salesDataSet && (
                  <a href="/dashboard" className="text-white hover:text-blue-500 font-semibold">
                    Go to Dashboard &gt;
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-md bg-gray-600 flex items-center justify-center h-10">
                <p className="text-white">Retrieving sales data and preparing dashboard. This may take up to a few minutes.</p>
                <div className="ml-4 h-8">
                  <Loading />
                </div>
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
            <h1 className="flex justify-center items-center text-white font-semibold text-3xl">Set up Dashboard</h1>
            <div className="flex justify-center items-center h-3/4">
              <Loading size='lg' />
            </div>
          </div>
        </div>
      </div>
    )
  );
};


export default SalesDataSetup;


