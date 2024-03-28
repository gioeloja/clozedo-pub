import React from 'react';

const AutoFollow = ({ socket }) => {
  const handleClick = () => {

  }

  return (
    <div className='h-full'>
      <div className='flex w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Follow from page: </h>
        <div className="rounded-lg overflow-hidden ml-10 w-24 h-full">
          <input
            type="number"
            placeholder='0'
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none`}
            min="0"
            max="1000"
          />
        </div>
        <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3`}>people from</h>
        <div className="rounded-lg overflow-hidden w-64 h-full">
          <input
            placeholder="Username to follow from"
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none`}
          />
        </div>

      </div>
      <div className='flex my-10 w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Follow:</h>
        <div>
          <div className='flex'>
            <div className="rounded-lg overflow-hidden ml-10 w-24">
              <input
                type="number"
                placeholder='0'
                className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none`}
                min="0"
                max="1000"
              />
            </div>
            <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3`}>just joined users</h>
          </div>

          <div className='flex mt-8'>
            <div className="flex rounded-lg overflow-hidden ml-10 w-24 ">
              <input
                type="number"
                placeholder='0'
                className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none`}
                min="0"
                max="1000"
              />
            </div>
            <h className={`text-gray-400 text-[15px] xl:text-[18px] duration-200 pt-1 ml-3 mr-3`}>users from Fresh Closets</h>
          </div>
        </div>
      </div>


      <div className='flex my-10 w-full'>
        <h className="text-white text-[15px] xl:text-[18px] pt-1">Unfollow:</h>
        <div className="rounded-lg overflow-hidden ml-10 w-24">
          <input
            type="number"
            placeholder='0'
            className={`w-full px-2 py-1 bg-gray-100 duration-200 text-gray-800 focus:outline-none`}
            min="0"
            max="1000"
          />
        </div>
      </div>
      <div>
        <button
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
          onClick={handleClick}
        >
          Follow Users
        </button>
      </div>
    </div>
  )
};


export default AutoFollow;


