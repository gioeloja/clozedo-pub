import React from 'react';
import image from "../../../assets/money.png"

const TotalRevenue = ({dataSet}) => {
  let data = dataSet.filter(entry => entry.status == "sold_out")
  data = data.filter(entry => entry.display_status !== 'Order Cancelled')
  let totalPrice = 0

  for (let i = 0; i < data.length; i++) {
    totalPrice += parseInt(data[i].price_sold)
  }

  return (
    <div className="flex">
      <div>
        <h1 className='text-sm xl:text-md 2xl:text-lg  font-semibold text-[#858c97]'>TOTAL REVENUE</h1>
        <div style={{textAlign: 'left', marginLeft: '10px'}}>
          <h1 className='text-[25px] 2xl:text-[30px] 3xl:text-[35px] pt-2 font-bold text-white'>{totalPrice}</h1>
        </div>
        
      </div>
      <img class="ml-auto top-0 bottom-0 right-0 h-7 w-7 xl:h-10 xl:w-10 rounded-full p-1 bg-green-400" src={image} alt="..." />
    </div>
    
  )
};


export default TotalRevenue;


