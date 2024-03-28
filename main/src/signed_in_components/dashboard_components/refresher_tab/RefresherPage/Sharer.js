import React, { useState, useRef, useEffect } from 'react';
import Scheduled from './Scheduled';
import Continuous from './Continuous';
import Once from './Once';
import secureLocalStorage from 'react-secure-storage';



const Sharer = ({socket}) => {
  const [currentFrequencySetting, setCurrentFrequencySetting] = useState(0);
  const [toggled, setToggled] = useState(false)
  const componentRef = useRef(null);

  const sharerSettings = [
    {
      id: "schedule",
      title: "Sharer",
      component: Scheduled,
    },
    {
      id: "continuous",
      title: "Auto-Offer",
      component: Continuous,
    },
    {
      id: "once",
      title: "Auto-Follow",
      component: Once,
    },
  ];

  const handleToggleChange = () => {
    setToggled(!toggled)
  }


  useEffect(() => {
    // When the frequency setting changes, update the ref to the new component instance
    componentRef.current = null;
  }, [currentFrequencySetting]);

  useEffect(() => {
    
    if(secureLocalStorage.getItem('currentFrequencySetting')) {
      setCurrentFrequencySetting(secureLocalStorage.getItem('currentFrequencySetting')) }
  },[])

  const onFrequencyClick = (index) => {
    setCurrentFrequencySetting(index);

    secureLocalStorage.setItem('currentFrequencySetting', index)
  

  }


  const Component = sharerSettings[currentFrequencySetting].component;

  return (
    <div className='h-full'>
      <div className='flex gap-10 mb-10'>
        <h className="text-white text-[15px] xl:text-[18px] pt-2">Sharing mode:</h>
        <div>
          <div className="flex w-full">
            <button
              disabled={toggled}
              key="schedule"
              className={`w-30 bg-[#45464f] hover:text-gray-400 border-r text-white py-3 px-4 rounded-l-lg border-gray-200/[.25] overflow-hidden 
              whitespace-nowrap text-overflow-ellipsis 
              ${toggled ? `${currentFrequencySetting === 0  ? "opacity-30 hover:text-white cursor-not-allowed" : "opacity-60 hover:text-white cursor-not-allowed"}` : `${currentFrequencySetting === 0 && 'opacity-60 hover:text-white '}`}
               `}
              onClick={() => onFrequencyClick(0)}
            >
              Schedule
            </button>
            <button
              disabled={toggled}
              className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 border-r border-gray-200/[.25] overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${toggled ? `${currentFrequencySetting === 1  ? "opacity-30 hover:text-white cursor-not-allowed" : "opacity-60 hover:text-white cursor-not-allowed"}` : `${currentFrequencySetting === 1 && 'opacity-60 hover:text-white '}`} `}
              onClick={() => onFrequencyClick(1)}
            >
              Continuous
            </button>
            <button
              disabled={toggled}
              className={`w-30 bg-[#45464f] hover:text-gray-400 text-white py-3 px-4 border-gray-200/[.25] rounded-r-lg overflow-hidden whitespace-nowrap text-overflow-ellipsis 
              ${toggled ? `${currentFrequencySetting === 2  ? "opacity-30 hover:text-white cursor-not-allowed" : "opacity-60 hover:text-white cursor-not-allowed"}` : `${currentFrequencySetting === 2 && 'opacity-60 hover:text-white '}`} `}
              onClick={() => onFrequencyClick(2)}
            >
              Once
            </button>
          </div>
        </div>
      </div>
      <Component ref={componentRef} onToggleChange={handleToggleChange} socket={socket}/>
    </div>
  )
};

export default Sharer;
