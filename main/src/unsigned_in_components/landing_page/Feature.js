import React from 'react';

const Feature = ({ title, description, image }) => {
  return (
    <div className='w-[350px]'>
      <div
        className='w-[140px] h-[140px] mx-auto rounded-full border-8 border-[#838ABB] flex items-center justify-center'
        style={{
          backgroundImage: `url(${image})`, // Use the 'image' prop as the background image
          backgroundSize: '70%', // Adjust the size of the graph within the circle
          backgroundPosition: 'center', // Center the graph within the circle
          backgroundRepeat: 'no-repeat', // Prevent the graph from repeating in the circle
        }}
      >
        {/* You can adjust the padding value to add space inside the circle */}
        <div style={{ padding: '20px' }}>
          {/* You can add additional content or text here */}
        </div>
      </div>
      <h className="flex-1 font-semibold  flex md:flex-row flex-col justify-center text-center text-[24px] ss:leading-[100px] py-2">{title}</h>
      <p className={`text-center text-gray-500 text-[18px] px-10 max-w-sm `}>{description}</p>
    </div>
  );
};

export default Feature;
