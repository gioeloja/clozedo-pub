import React from 'react';
import image from "../../../assets/calendar_icon.svg"

const ActiveListings = ({dataSet}) => {
  let data = dataSet.filter(entry => entry.status == "available")


  return (
    <div className="flex">
      <div>
        <h1 className='text-sm xl:text-md 2xl:text-lg font-semibold text-[#858c97]'>ACTIVE LISTINGS</h1>
        <div style={{textAlign: 'left', marginLeft: '10px'}}>
          <h1 className='text-[25px] 2xl:text-[30px] 3xl:text-[35px] pt-2 font-bold text-white'>{data.length}</h1>
        </div>
      </div>
      <img class="text-white ml-auto top-0 bottom-0 right-0 h-7 w-7 xl:h-10 xl:w-10 rounded-full p-1 bg-blue-500" src={image} alt="..." />
    </div>



  )
};


export default ActiveListings;


