import React, { useState } from 'react';


const Carousel = ({ slides}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  // Function to set the current slide based on the provided index
  const setCurrentSlideIndex = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className='bg-[#2b3141] w-full h-full rounded-lg shadow-lg relative overflow-hidden'>
      <div className="flex items-center justify-center">
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-xl font-bold text-white py-2 px-4 rounded-full"
          onClick={prevSlide}
        >
          &lt;
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 text-xl font-bold text-white py-2 px-4 rounded-full"
          onClick={nextSlide}
        >
          &gt;
        </button>
      </div>

      <div className="flex justify-center mt-4 absolute bottom-2 left-0 right-0 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 mx-1 cursor-pointer rounded-full ${
              index === currentSlide ? 'bg-gray-900' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentSlideIndex(index)}
          ></div>
        ))}
      </div>

      {/* Render the current slide component */}
      {slides[currentSlide]}
    </div>
  );
};

export default Carousel;