import React, { useState, useEffect } from 'react';
import AutoFollow from './AutoFollow';
import AutoOffer from './AutoOffer';
import Sharer from './Sharer';
import secureLocalStorage from 'react-secure-storage';
import io from 'socket.io-client';

import moment from 'moment-timezone';
import { Loading } from '@nextui-org/react';


const ActivityBoard = ({ socketState }) => {

  const [socket, setSocket] = socketState

  useEffect(() => {
    let newSocket = socket


    newSocket.on('updateActivityBoard', (userActivity) => {
      buildActivityList(userActivity)
    });

    setSocket(newSocket)




  }, [])

  const buildActivityList = (userActivity) => {
    let tmpArr = []
    for (let i = userActivity.length - 1; i >= 0; i--) {
      //let date= new Date(userActivity[i]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      // let min = date.getMinutes()
      // if(min < 10)
      // {
      //   min = `0${min}`
      // }
      // let dateFormat = date.getHours() + ":" + min
      let date = Object.keys(userActivity[i])[0]
      let currentTimezone = moment.tz.guess(); // Get the current timezone
      let UTCtime = moment.tz(date, 'YYYY-MM-DD HH:mm:ss', 'UTC')

      let localTimeMoment = UTCtime.clone().tz(currentTimezone)

      let localTime = localTimeMoment.format('MM/DD/YY hh:mm A')

      tmpArr.push(`${localTime}: ${userActivity[i][date]}`)
      //tmpArr.push( <br />)

    }
    console.log('tmparr ' + tmpArr)
    setActivityList(tmpArr)

  }

  const [activityList, setActivityList] = useState([]);

  return (
    <div className="w-1/3 h-5/6 flex flex-col ml-6 bg-gray-700 rounded-xl text-gray-400 shadow-lg overflow-hidden">
      <h1 className="flex justify-center text-xl items-center p-6 mx-6 border-white">
        My Activity
      </h1>
      <div className="flex border-white border h-full flex-col-reverse border-gray-200/[.55] mx-6 mb-6 rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
        {activityList.length === 0 && (
          <div className="flex flex-grow items-center justify-center "
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
            }}>
            <Loading size="lg" />
          </div>
        )}
        {activityList.map((activity, index) => (
          <div
            key={index}
            className="p-2 h-min border-t border-gray-200/[.25] m-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
            }}
          >
            {activity}
          </div>
        ))}
      </div>
    </div>
  );
};




export default ActivityBoard;

