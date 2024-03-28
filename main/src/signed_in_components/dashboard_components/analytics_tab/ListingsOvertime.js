import React, { useState, useEffect } from 'react';
import LineGraph from '../dashboard_tab/carousel/LineGraph.js'
import GraphDropdown from '../dashboard_tab/carousel/GraphDropdown.js'
import { getTimeScale } from '../../../scripts/data_filterer.js';


const ListingsOvertime = ({ dataSet, firstDay, lastDay }) => {
  const [category, setCategory] = useState('Total Listings');
  const [timeCounts, setTimeCounts] = useState({});

  useEffect(() => {
    
    const timeScale = getTimeScale(firstDay, lastDay, false)
    // Calculate month counts based on the category and dataSet
    const calculateCounts = () => {

      if (timeScale[0] === "hour_listed") {
        const hourLabels = {
          0: "12 AM", 1: "4 AM", 2: "4 AM", 3: "4 AM",
          4: "4 AM", 5: "8 AM", 6: "8 AM", 7: "8 AM",
          8: "8 AM", 9: "12 PM", 10: "12 PM", 11: "12 PM",
          12: "12 PM", 13: "4 PM", 14: "4 PM", 15: "4 PM",
          16: "4 PM", 17: "8 PM", 18: "8 PM", 19: "8 PM",
          20: "8 PM", 21: "12 AM", 22: "12 AM", 23: "12 AM"
        };
      
        for (let i = 0; i < dataSet.length; i++) {
          console.log(dataSet[i].hour_listed)
          const hour = dataSet[i].hour_listed;
          const label = hourLabels[hour];
          timeScale[1][label] += 1;
          
        }
      }

      else { 
        for (let i = 0; i < dataSet.length; i++) {
          if(dataSet[i][timeScale[0]] in timeScale[1]) {
            timeScale[1][dataSet[i][timeScale[0]]] += 1
          }
        
    }
      return timeScale[1]
    }
      return timeScale[1]
      

    };

    // Update month counts when the category changes
    const updatedTimeCounts = calculateCounts();
    setTimeCounts(updatedTimeCounts);
  }, [category, dataSet]);


  const val = Math.max(...Object.values(timeCounts)) / 8;
  const ystep = Math.round(val / 10) * 10;

  const options = [
    { name: 'Total Listings Made', dictValue: 'Total Listings Made' }
  ];

  const handleCategoryChange = (categorySetting) => {
    setCategory(categorySetting);
  };

  return (
    <div className='m-5 flex flex-col w-full h-full'>
      <div className='flex justify-between'>
        <h1 className='text-lg font-semibold text-white pb-3'>{category} Over Time</h1>
        <GraphDropdown options={options} onCategoryChange={handleCategoryChange} />
      </div>
      <div className='flex flex-grow justify-center'>
        <div className='h-3/4 w-3/4 mt-8'>
          <LineGraph xvalues={Object.keys(timeCounts)} yvalues={Object.values(timeCounts)} />
        </div>
      </div>
      {/* <div>PUT DETAILS HERE</div> */}
    </div>
  );
};

export default ListingsOvertime;
