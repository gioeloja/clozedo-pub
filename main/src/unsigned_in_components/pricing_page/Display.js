import React from 'react'
import styles from "../../style.js";

const Display = () => {
    return(
        <div>
            <h1 className={`flex-1 font-bold flex md:flex-row flex-col justify-center text-center ss:text-text[72px] text-[50px] ss:leading-[100px] leading-[75px] ${styles.heading1}`}>
            Pricing<br className='sm:block hidden'></br> 
            </h1>
            <p className={`${styles.paragraph} text-center text-[#444444] text-[24px] `}> Elevate your business today.</p>
            <div class="flex justify-center items-center">
                <div className="w-full md:w-2/3 lg:w-1/2 h-[550px] bg-[#2b3141] rounded-xl shadow-2xl justify-center mt-10 p-8 ring-1 xl:p-10">
                    <h className="text-white text-[40px] font-semibold leading-8">Features</h>
                    <p className='text-gray-300 mt-4 text-[15px] leading-6'>Start for free, no credit card required.</p>
                    <div className="items-center mt-6 gap-10">
                        <div className="flex items-baseline gap-x-1">
                            <span className="text-white text-[55px] font-bold tracking-tight">$15</span>
                            <span className="text-gray-300 text-[20px] font-semibold leading-6">/month</span>
                        </div>
                        <button className=" mt-2 bg-indigo-600 w-full rounded-lg shadow-md hover:bg-indigo-500 text-white font-semibold py-4 px-4 rounded">
                            Try 7 days free!
                        </button>
                    </div>
                    <div className="flex items-center mt-10">
                        <p className="text-gray-300 text-[20px] min-w-[150px] leading-6">What's included</p>
                        <div className="ml-4 h-px bg-gray-300 w-full opacity-40"></div>
                    </div>
                    
                    <ul role="list" className='mt-4 xl:mt-5 text-gray-300 space-y-3 text-[20px] leading-6'>
                        <li className='flex gap-x-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="text-white h-6 w-5 flex-none"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>
                            Visualize your sales trends
                        </li>
                        <li className='flex gap-x-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="text-white h-6 w-5 flex-none"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>
                            Scheduled item sharing
                        </li>
                        <li className='flex gap-x-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="text-white h-6 w-5 flex-none"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>
                            Automated offers to likers
                        </li>
                        <li className='flex gap-x-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="text-white h-6 w-5 flex-none"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path></svg>
                            Automatic closet following
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default Display