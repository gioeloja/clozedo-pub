import React, { useState, useEffect, useRef } from "react";


const SettingsDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeOpenMenus = (e)=>{
    if(dropdownRef.current && isDropdownOpen && !dropdownRef.current.contains(e.target)){
      setIsDropdownOpen(false)
    }
}

  document.addEventListener('mousedown',closeOpenMenus)

  return (
    <div>
      <div className="relative">
        </div>
            <div ref={dropdownRef}
            className='absolute right-0 p-2 py-5 2xl:p-5 '>
              <button className={`flex items-center justify-center w-12 h-12 rounded-full hover:bg-[#313342] focus:outline-none ${isDropdownOpen ? 'bg-[#2B2D3A] hover:bg-[#2B2D3A]' : ''}`}
              onClick={toggleDropdown}>
            <svg
                className="cursor-pointer ml-auto xl:h-10 xl:w-10 rounded-full"
                viewBox="0 0 30 30"
                fill="white"
              >
              <path d="M12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4ZM12 12C10.3431 12 9 13.3431 9 15C9 16.6569 10.3431 18 12 18C13.6569 18 15 16.6569 15 15C15 13.3431 13.6569 12 12 12ZM12 20C10.3431 20 9 21.3431 9 23C9 24.6569 10.3431 26 12 26C13.6569 26 15 24.6569 15 23C15 21.3431 13.6569 20 12 20Z" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div
            className="absolute right-0 z-10 m-2 mt-1 w-56 rounded-xl bg-[#37394a] shadow-xl border border-[#AAB0E2] ring-1 ring-black ring-opacity-5">
              {/* Dropdown content */}
              <ul className="py-2 w-full">
                <a href="/settings"><li className="px-4 py-2 text-[#A9AFD8] hover:bg-[#484B5E] cursor-pointer">Account</li></a>  
                <a href="/dashboard"><li className="px-4 py-2 text-[#A9AFD8] hover:bg-[#484B5E] cursor-pointer">Dashboard</li></a>  
                <a href="/settings"><li className="px-4 py-2 text-[#A9AFD8] hover:bg-[#484B5E] cursor-pointer">Settings</li></a>  
                
              </ul>
            </div>
          )}

        </div>
    </div>
  )
};


export default SettingsDropdown;


