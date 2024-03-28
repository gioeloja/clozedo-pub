import React from 'react';

const Once = ({socket}) => {

  const makeRefreshRequest = () => {
    socket.emit("refreshListingsOnce", { user: process.env.REACT_APP_USER})    
  }

  return (
    <div>
      <button
        className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
        onClick={makeRefreshRequest}
      >
        Share Listings Once
    </button>
    
    </div>
  )
};


export default Once;


