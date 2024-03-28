import React, { useState, useEffect } from 'react';
import LoginButton from '../landing_page/login.js';
import RegisterButton from '../landing_page/register.js'
import logo from '../assets/gray_purple_logo.png';
import menu from '../assets/menu.svg';

const navLinks = [
  {
    id: "features",
    title: "Features",
  },
  {
    id: "pricing",
    title: "Pricing",
    url: '/pricing', // Specify the URL for Pricing
  },
  {
    id: "faqs",
    title: "FAQs",
  },
];

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const baseUrl = 'http://localhost:3000'; // Set your preset link here

  useEffect(() => {
    // Add or remove the 'overflow-hidden' class from the body based on the toggle state.
    if (toggle) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Clean up by removing the class when the component unmounts.
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [toggle]);

  return (
    <nav className={`w-full flex py-6 px-6 justify-start items-center navbar`}>
      <a href="https://localhost:3000/home">
        <img src={logo} alt="logo" className="w-[156px] " />
      </a>

      <ul className="list-none lg:flex  justify-center hidden items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              index === navLinks.length - 1 ? 'mx-10' : 'mx-10'
            }`}
          >
            <a href={nav.url || `${baseUrl}/#${nav.id}`}>
              {nav.title}
            </a>
          </li>
        ))}
      </ul>

      <div className='lg:hidden flex flex-1 justify-end items-center'>
        <img 
          src={menu}
          className='w-[28px] object-contain cursor-pointer'
          onClick={() => setToggle((prev) => !prev)}
          
        />
        <div
          className={`${
            toggle
              ? 'fixed inset-y-0 top-20'
              : 'absolute hidden'
          } right-0 w-full h-full bg-white rounded-xl sidebar z-50`}
        >
          <ul className="list-none flex flex-col mx-4 my-6 flex-1 gap-4">
            {navLinks.map((nav, index) => (
              <a href={nav.url || `${baseUrl}/#${nav.id}`}
              onClick={() => setToggle((prev) => !prev)}>
                <li
                  key={nav.id}
                  className={`mx-2 block rounded-lg px-1 py-2 text-base font-semibold leading-7 text-[30px] text-gray-900 hover:bg-gray-100 `}
                >
                  {nav.title}
                </li>
              </a>
            ))}
            
            <div className="w-full mt-10 h-[50px] ">
              <LoginButton />
            </div>
          </ul>
        </div>
      </div>

      <div className='gap-2 flex'>
        <div className="ml-auto hidden lg:block">
          <LoginButton />
        </div>
        <div className="ml-auto hidden lg:block">
        <RegisterButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
