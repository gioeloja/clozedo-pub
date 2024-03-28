import React from 'react';
import styles from "../../style.js";
import {Navbar, Features, FirstMedia, SecondMedia, ThirdMedia, Footer, Pitch, Questions} from './index.js';
//import './index.css';

function LandingPage () {
  return (
    <div className="bg-primary w-full overflow-hidden ">
      <div className={`${styles.paddingX}} ${styles.flexCenter} shadow-md` }>
        <div className = {`${styles.boxWidth} `}>
        <Navbar/>
        </div>  
      </div>
      <div className = {`bg-primary ${styles.paddingX} sm:my-10 ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Pitch/>
        </div>
      </div>
      <div>
        <div className={'py-12'} >
          <Features/>
        </div>
      </div>

      <div className='mt-10'>
        
          <h1 className={`flex-1 font-bold font-poppins text-slate-800 flex md:flex-row flex-col justify-center text-center ss:text-text[72px] sm:text-[45px] text-[40px] ss:leading-[100px] leading-[60px] sm:leading-[75px] px-6 py-6 `}>
            The simplest way to optimize<br className='sm:block hidden'></br>  your closet
          </h1>
      </div>
      <div className = {`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <FirstMedia/>
          <SecondMedia />
        </div>
      </div>
      <div>
      <div className="mt-32">
      <div className="">
        <Questions />
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
      </div>
    </div>
  );
}

export default LandingPage ;
