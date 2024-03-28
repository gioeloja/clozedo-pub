import React, {useState, useRef, useEffect} from 'react';
import AutoFollow from './AutoFollow';
import AutoOffer from './AutoOffer';
import Sharer from './Sharer';
import ActivityBoard from './ActivityBoard.js'
import secureLocalStorage from 'react-secure-storage';
import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";




const Refresher = ({socket}) => {
  const [currentTab, setCurrentTab] = useState(0)

  const [sock, setSocket] = useState(null);

  const componentRef = useRef(null);
  
  const refresherPageLinks = [
    {
      id: "sharer",
      title: "Sharer",
      component: Sharer,
    },
    {
      id: "autooffer",
      title: "Auto-Offer",
      component: AutoOffer,
    },
    {
      id: "autofollow",
      title: "Follower",
      component: AutoFollow,
    },
  ];

  const onTabClick = (index) => {
      setCurrentTab(index);
    }

  useEffect(() => {
    setSocket(socket)
    socket.emit('updateActivityBoard', { authuser: process.env.REACT_APP_USER})
    
  })

    const updateSettings = (schedule) => {
      socket.emit("updateSettings", schedule)
    }

    const Component = refresherPageLinks[currentTab].component;

    return (
      <div className='h-screen bg-[#242734]'>
        <div className='mr-10 pt-5 xl:pt-10 flex pb-10 h-full'>
    
          <div className='w-2/3 mr-6 flex flex-col h-5/6'>
            <div className='w-full p-6 mr-6 bg-[#2b3141] rounded-xl text-xxl text-gray-400 mb-5 xl:mb-10 shadow-lg'>
              <ul className='list-none sm:flex justify-start items-center flex-1 ml-6'>
                {refresherPageLinks.map((nav, index) => (
                  <li
                    key={index}
                    className={`font-poppins font-normal cursor-pointer text-[16px] ${
                      index === refresherPageLinks.length - 1 ? 'mr-20' : 'mr-20'
                    }`}
                    onClick={() => onTabClick(index)}
                  >
                    <div>{nav.title}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='w-full h-full flex-1 p-6 mr-6 bg-[#2b3141] rounded-xl text-xxl text-gray-400 shadow-lg scrollbar-thin scrollbar-thumb-gray-400 overflow-y-auto'>
              {socket && <Component ref={componentRef} socket={socket} />}
            </div>
          </div>
          {socket && <ActivityBoard socketState={[socket, setSocket]} />}
        </div>
      </div>
    );
    
};


export default Refresher;


