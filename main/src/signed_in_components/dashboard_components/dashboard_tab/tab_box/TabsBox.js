import React, {useState} from 'react';
import DonutGraph from './DonutGraph.js'
import TabTotalSold from './TabTotalSold.js';
import TabSellthrough from './TabSellthrough.js'
import TabAvgPrice from './TabAvgPrice.js'

function TabsBox({dataSet}) {
  const [activeTab, setActiveTab] = useState("mostsold");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabContent = {
    mostsold: <TabTotalSold dataSet = {dataSet}/>,
    sellthrough: <TabSellthrough dataSet = {dataSet}/>,
    saleprice: <TabAvgPrice dataSet = {dataSet}/>
  };

  return (
    <div className='h-full '>
      <div className="border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-white pb-2 hidden justify-center">Performance</h2>

        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 justify-end">
          <li className="mr-1">
            <div
              className={`cursor-pointer inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 group ${
                activeTab === "mostsold" &&
                "text-blue-600 border-b-2 border-blue-500 active dark:text-blue-400 dark:border-blue-400 hover:border-blue-500"
              }`}
              onClick={() => handleTabClick("mostsold")}
            >
              <svg
              
                aria-hidden="true"
                className={`w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 ${
                  activeTab === "mostsold" &&
                  "text-blue-500 dark:text-blue-400 group-hover:text-blue-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </li>
          <li className="mr-1">
            <div
              className={`cursor-pointer inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 group ${
                activeTab === "sellthrough" &&
                "text-blue-600 border-b-2 border-blue-500 active dark:text-blue-400 dark:border-blue-400 group hover:border-blue-500"
              }`}
              onClick={() => handleTabClick("sellthrough")}
            >
              <svg
                aria-hidden="true"
                className={`w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500  ${
                  activeTab === "sellthrough" &&
                  "text-blue-500 dark:text-blue-400 group-hover:text-blue-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              ><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
                  </div>
              </li>
              <li className="mr-1">
              <div
              className={`cursor-pointer inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300 group ${
                activeTab === "saleprice" &&
                "text-blue-600 border-b-2 border-blue-500 active dark:text-blue-400 dark:border-blue-400 hover:border-blue-500"
              }`}
              onClick={() => handleTabClick("saleprice")}
            >
              <svg
                aria-hidden="true"
                className={`w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500  ${
                  activeTab === "saleprice" &&
                  "text-blue-500 dark:text-blue-400 group-hover:text-blue-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              ><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
                  </div>
              </li>
          </ul>
      </div>
      <div className='h-2/3 2xl:h-3/4'> 
        {tabContent[activeTab]}
      </div>
    </div>
  );
}


export default TabsBox;


